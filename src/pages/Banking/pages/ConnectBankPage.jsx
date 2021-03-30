import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';

import API from 'api/api';
import { ROUTES, REPORT_POLL_INTERVAL, TOS_TYPE_FINICITY } from 'constants/constants';
import { fetchApplicant } from 'reducers/applicant';
import { logToSentry } from 'utils/sentry';

import BankVerifying from 'pages/Banking/components/BankVerifying';
import VerifyIncome from 'pages/Banking/components/VerifyIncome';
import BankingContext from 'pages/Banking/BankingContext';

const finicityContainer = css`
    height: calc(100vh - 66px);
    max-width: 450px;
    margin: -15px -20px -45px -20px;
`;

export class ConnectBankPage extends React.Component {
    constructor() {
        super();
        this.state = {
            showFinicityIframe: false,
            errors: null,
            loadingFinicityIframe: false,
            loadingReport: false,
        };
    }

    componentWillUnmount() {
        clearInterval(window.fetchReportsInterval);
        try {
            if (Window.finicityConnect) {
                Window.finicityConnect.destroy();
            }
        } catch (e) {
            console.error(e);
        }
    }

    handleFetchReports = () => {
        API.fetchFinicityReports(this.props.application.id)
            .then((res) => {
                if (res.status === 202) return;
                return res.json();
            })
            .then((res) => {
                if (!res) return;
                clearInterval(window.fetchReportsInterval);
                this.context.refreshFinancialSources().then(() => {
                    this.props.history.push(ROUTES.INCOME_VERIFICATION_SUMMARY);
                });
            });
    };

    openFinicityIframe = () => {
        /* eslint-disable no-unused-expressions */
        this.setState({ loadingFinicityIframe: true });
        this.context.toggleLoader?.(true);

        API.createFinicityUrl()
            .then((res) => {
                if (!res || !res.link) {
                    this.context.toggleLoader?.(false);

                    return this.setState({
                        showFinicityIframe: false,
                        errors: ['There was a problem with the request. Please try again.'],
                    });
                }
                this.setState(
                    {
                        showFinicityIframe: true,
                        errors: null,
                    },
                    () =>
                        window.finicityConnect.connectIFrame(res.link, {
                            selector: '#finicity-container',
                            overlay: 'rgba(255,255,255, 0)',
                            success: (data) => {
                                // for testing - fake bank = finbank profiles a; fake bank creds= user:demo pw:profile_2
                                if (!!data.success) {
                                    this.setState({
                                        showFinicityIframe: null,
                                        errors: null,
                                        loadingReport: true,
                                        loadingFinicityIframe: false,
                                    });

                                    API.generateFinicityReports(this.props.application.id)
                                        .then(() => {
                                            window.fetchReportsInterval = window.setInterval(
                                                this.handleFetchReports,
                                                REPORT_POLL_INTERVAL
                                            );
                                        })
                                        .catch(() => {
                                            this.setState({
                                                showFinicityIframe: false,
                                                loadingFinicityIframe: false,
                                                errors: [
                                                    'There was an error generating your income and assets report. Please try again.',
                                                ],
                                            });
                                        })
                                        .finally(() => {});
                                } else {
                                    this.setState({
                                        showFinicityIframe: false,
                                        errors: ['There was an error accessing your information. Please try again.'],
                                        loadingFinicityIframe: false,
                                    });
                                }
                            },
                            cancel: () => {
                                this.setState({ showFinicityIframe: false, loadingFinicityIframe: false });
                            },
                            error: () => {
                                this.setState({
                                    showFinicityIframe: false,
                                    errors: ['There was an error attempting to get your records. Please try again.'],
                                    loadingFinicityIframe: false,
                                });
                            },
                            route: function (event) {
                                if (event.data && event.data.screen === 'Search') {
                                    const body = {
                                        type: TOS_TYPE_FINICITY,
                                        context: {
                                            time: Date.now(),
                                        },
                                    };
                                    API.acceptTerms(this.props.application.id, body).catch(() => {
                                        this.setState({
                                            showFinicityIframe: false,
                                            errors: [
                                                'There was an error accepting the terms of use. Please try again.',
                                            ],
                                            loadingFinicityIframe: false,
                                        });
                                    });
                                }
                            },
                        })
                );
            })
            .finally(() => {
                this.context.toggleLoader?.(false);
            });
    };

    reportNoIncomeAssets = async (e, targetPath) => {
        e.preventDefault();

        // Handle reporting no income/assets
        const formData = new FormData();
        formData.append('report_no_income_assets', 'True');
        this.context.toggleLoader(true);

        try {
            await API.submitFinancialSource(this.props.application.id, formData, false); // No files to encrypt
            await this.context.refreshFinancialSources();
            this.props.history.push(targetPath);
        } catch (e) {
            await logToSentry(e.response || e);
        } finally {
            this.context.toggleLoader(false);
        }
    };

    render() {
        if (!this.props.applicant) {
            return <div />;
        }
        if (this.state.showFinicityIframe) {
            return <div className={finicityContainer} id="finicity-container" />;
        }
        if (this.state.loadingReport) {
            return <BankVerifying />;
        }
        return (
            <VerifyIncome
                loadingFinicityIframe={!!this.state.loadingFinicityIframe}
                openFinicityIframe={this.openFinicityIframe}
                reportNoIncomeAssets={this.reportNoIncomeAssets}
                errors={this.state.errors}
            />
        );
    }
}

ConnectBankPage.propTypes = {
    applicant: PropTypes.object,
    refreshFinancialSources: PropTypes.func,
    fetchApplicant: PropTypes.func,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    application: state.renterProfile,
});

const mapDispatchToProps = { fetchApplicant };

ConnectBankPage.contextType = BankingContext;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectBankPage);
