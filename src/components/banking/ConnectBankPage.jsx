import React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import get from 'lodash/get';

import { ROUTES, REPORT_POLL_INTERVAL, APPLICATION_EVENTS } from 'app/constants';
import API, { MOCKY } from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';
import ReviewAccountsPage from './ReviewAccounts/ReviewAccountsPage';
import BankVerifying from './BankVerifying';
import ConnectFinicity from './ConnectFinicity';
import reports from 'reports.json';

const finicityContainer = css`
    height: calc(100vh - 66px);
    max-width: 450px;
    margin: 0 -20px -45px -20px;
`   


export class ConnectBankPage extends React.Component {
    state = {
        showFinicityIframe: false, 
        errors: null, 
        loadingFinicityIframe: false, 
        loadingReport: false, 
        reportData: null,
    }

    checkReportsGenerated = () => {
        const eventsSet = new Set(this.props.applicant.events.map(event => parseInt(event.event)));
        if (eventsSet.has(APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED)) {
            this.setState({showFinicityIframe: null, errors: null, loadingReport: true, loadingFinicityIframe: false});
            window.fetchReportsInterval = window.setInterval(this.handleFetchReports, REPORT_POLL_INTERVAL);
        }
    }

    componentDidMount () {
        if (this.props.applicant && this.props.applicant.events) {
            if (MOCKY) {
                return this.parseReportData(reports);
            }
            this.checkReportsGenerated();
        }
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevProps.applicant === null && this.props.applicant && prevState === this.state) {
            if (MOCKY) {
                return this.parseReportData(reports);
            }

            this.checkReportsGenerated();
        }
    }

    componentWillUnmount () {
        clearInterval(window.fetchReportsInterval);
    }

    parseReportData = reportData => {
        const assetsTotal = get(reportData, 'voa.assets.currentBalance');
        const incomeData = get(reportData, 'voi.institutions', []);

        const data = {'incomeEntries': [], 'incomeTotal': 0, assetsTotal, 'incomeNameInitialValues': {}}
        incomeData.forEach(bank => {
            bank.accounts.forEach(account => {
                account.incomeStreams.forEach((income) => {
                    data.incomeNameInitialValues[income.id] = income.name;
                    data.incomeEntries.push({
                        name: income.name,
                        income: income.projectedGrossAnnual,
                        id: income.id,
                    });
                    data.incomeTotal += income.projectedGrossAnnual
                })
            })
        })
        this.setState({
            reportData: data,
            loadingReport: false,
            errors: null
        })
    }
    

    handleFetchReports = () => {
        API.fetchFinicityReports().then((res) => {
            if (res.status === 202) return;
            return res.json()
        }).then( res => {
            if (!res) return;
            clearInterval(window.fetchReportsInterval);
            this.parseReportData(res);
        })
    }


    openFinicityIframe = () => {
        if (MOCKY) {
            return this.parseReportData(reports);
        }
        this.setState({loadingFinicityIframe: true});
        API.createFinicityUrl().then(res => {
            if (!res || !res.link) {
                return this.setState({showFinicityIframe: false, errors: ["There was a problem with the request. Please try again."]})
            }
            this.setState({showFinicityIframe: true, errors: null}, 
                () => window.finicityConnect.connectIFrame(res.link, {
                    selector: '#finicity-container',
                    overlay: "rgba(255,255,255, 0)",
                    success: (data) => {    
                        // for testing - fake bank = finbank profiles a; fake bank creds= user:demo pw:profile_2
                        if (!!data.success) {
                            this.setState({showFinicityIframe: null, errors: null, loadingReport: true, loadingFinicityIframe: false});
                            API.generateFinicityReports().then( (res) => {
                                window.fetchReportsInterval = window.setInterval(this.handleFetchReports, REPORT_POLL_INTERVAL);
                            }).catch( (res) => {
                                this.setState({
                                    showFinicityIframe: false, 
                                    loadingFinicityIframe: false, 
                                    errors: ["There was an error generating your income and assets report. Please try again."]
                                })
                            });
                        } else {
                            this.setState({showFinicityIframe: false, errors: ["There was an error accessing your information. Please try again."], loadingFinicityIframe: false});
                        }
                    },
                    cancel: () => {
                        this.setState({showFinicityIframe: false, loadingFinicityIframe: false});
                    },
                    error: (err) => {
                        this.setState({showFinicityIframe: false, errors: ['There was an error attempting to get your records. Please try again.'], loadingFinicityIframe: false});
                    },
                    loaded: () => {
                        console.log('iframe has loaded')
                    },
                })
            );
        });
    }

    render () {
        if (!this.props.applicant) {return <div/>}
        if (!!this.state.reportData ) {
            return <ReviewAccountsPage 
                incomeNameInitialValues={this.state.reportData.incomeNameInitialValues}
                incomeEntries={this.state.reportData.incomeEntries}
                incomeTotal={this.state.reportData.incomeTotal}
                assetsTotal={this.state.reportData.assetsTotal}
                pushNextPage={this.props._nextRoute}
                resetReportData={() => this.setState({reportData: null})}
            />;
        }
        if (this.state.showFinicityIframe) {
            return <div className={finicityContainer} id="finicity-container"/>;
        }
        if (this.state.loadingReport) {
            return <BankVerifying/>;
        }
        return <ConnectFinicity 
            loadingFinicityIframe={!!this.state.loadingFinicityIframe}
            openFinicityIframe={this.openFinicityIframe}
            errors={this.state.errors}
        />
    }
}

const mapStateToProps = state => ({
    applicant: state.applicant,
})

export default connect(mapStateToProps)(withRelativeRoutes(ConnectBankPage, ROUTES.INCOME_AND_EMPLOYMENT));
