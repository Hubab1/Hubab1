import React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';

import { ROUTES, REPORT_POLL_INTERVAL, APPLICATION_EVENTS, TOS_TYPE_PAYMENTS } from 'app/constants';
import API, { MOCKY } from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';
import BankVerifying from './BankVerifying';
import VerifyIncome from './VerifyIncome';
import PropTypes from "prop-types";

const finicityContainer = css`
    height: calc(100vh - 66px);
    max-width: 450px;
    margin: -15px -20px -45px -20px;
`   


export class ConnectBankPage extends React.Component {
    state = {
        showFinicityIframe: false,
        errors: null,
        loadingFinicityIframe: false,
        loadingReport: false,
    };

    checkReportsGenerated = () => {
        const eventsSet = new Set(this.props.applicant.events.map(event => parseInt(event.event)));
        if (eventsSet.has(APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED)) {
            this.props.refreshFinancialSources().then( () => {
                this.props.history.push(ROUTES.INCOME_VERIFICATION_SUMMARY);
            });
        }
    };

    componentDidMount () {
        if (this.props.applicant && this.props.applicant.events) {
            this.checkReportsGenerated();
        }
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevProps.applicant === null && this.props.applicant && prevState === this.state) {
            this.checkReportsGenerated();
        }
    }

    componentWillUnmount () {
        clearInterval(window.fetchReportsInterval);
    }

    handleFetchReports = () => {
        API.fetchFinicityReports().then((res) => {
            if (res.status === 202) return;
            return res.json()
        }).then( res => {
            if (!res) return;
            clearInterval(window.fetchReportsInterval);
            this.props.refreshFinancialSources().then( () => {
                this.props.history.push(ROUTES.INCOME_VERIFICATION_SUMMARY);
            });
        })
    };

    openFinicityIframe = () => {
        this.setState({loadingFinicityIframe: true});
        API.createFinicityUrl().then(res => {
            if (!res || !res.link) {
                return this.setState({
                    showFinicityIframe: false,
                    errors: ["There was a problem with the request. Please try again."]
                });
            }
            this.setState(
                {
                    showFinicityIframe: true,
                    errors: null
                }, () => window.finicityConnect.connectIFrame(res.link, {
                    selector: '#finicity-container',
                    overlay: "rgba(255,255,255, 0)",
                    success: (data) => {
                        // for testing - fake bank = finbank profiles a; fake bank creds= user:demo pw:profile_2
                        if (!!data.success) {
                            this.setState({
                                showFinicityIframe: null,
                                errors: null,
                                loadingReport: true,
                                loadingFinicityIframe: false
                            });
                            API.generateFinicityReports().then( (res) => {
                                window.fetchReportsInterval = window.setInterval(
                                    this.handleFetchReports,
                                    REPORT_POLL_INTERVAL
                                );
                            }).catch( (res) => {
                                this.setState({
                                    showFinicityIframe: false,
                                    loadingFinicityIframe: false,
                                    errors: [
                                        "There was an error generating your income and assets report. Please try again."
                                    ]
                                })
                            });
                        } else {
                            this.setState({
                                showFinicityIframe: false,
                                errors: ["There was an error accessing your information. Please try again."],
                                loadingFinicityIframe: false
                            });
                        }
                    },
                    cancel: () => {
                        this.setState({showFinicityIframe: false, loadingFinicityIframe: false});
                    },
                    error: (err) => {
                        this.setState({
                            showFinicityIframe: false,
                            errors: ['There was an error attempting to get your records. Please try again.'],
                            loadingFinicityIframe: false
                        });
                    },
                    loaded: () => {
                        console.log('iframe has loaded')
                    },
                    route: function(event) {
                        if (event.data && event.data.screen === 'Search') {
                            const body = {
                                type: TOS_TYPE_PAYMENTS,
                                context: {
                                    time: Date.now(),
                                }
                            };
                            API.acceptTerms(body).catch(() => {
                                this.setState({
                                    showFinicityIframe: false,
                                    errors: ['There was an error accepting the terms of use. Please try again.'],
                                    loadingFinicityIframe: false
                                });
                            })
                        }
                    },
                })
            );
        });
    };

    render () {
        if (!this.props.applicant) {return <div/>}
        if (this.state.showFinicityIframe) {
            return <div className={finicityContainer} id="finicity-container"/>;
        }
        if (this.state.loadingReport) {
            return <BankVerifying/>;
        }
        return <VerifyIncome
            loadingFinicityIframe={!!this.state.loadingFinicityIframe}
            openFinicityIframe={this.openFinicityIframe}
            errors={this.state.errors}
        />
    }
}

ConnectBankPage.propTypes = {
    applicant: PropTypes.object,
    refreshFinancialSources: PropTypes.func,
};

const mapStateToProps = state => ({
    applicant: state.applicant,
});

export default connect(mapStateToProps)(withRelativeRoutes(ConnectBankPage, ROUTES.INCOME_AND_EMPLOYMENT));
