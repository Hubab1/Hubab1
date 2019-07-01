import React from 'react';
import { css } from 'emotion';
import get from 'lodash/get';

import { ROUTES, REPORT_POLL_INTERVAL } from 'app/constants';
import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';
import ReviewAccountsPage from './ReviewAccounts/ReviewAccountsPage';
import BankVerifying from './BankVerifying';
import ConnectFinicity from './ConnectFinicity';

const finicityContainer = css`
    height: 500px;
`   


export class ConnectBankPage extends React.Component {
    state = {
        showFinicityIframe: false, 
        errors: null, 
        loadingFinicityIframe: false, 
        loadingReport: false, 
        incomeEntries: [],
        incomeTotal: 0,
        assetsTotal: 0,
    }

    componentWillUnmount () {
        clearInterval(window.fetchReportsInterval);
    }

    parseReportData = reportData => {
        debugger;
        const assetsData = get(reportData, 'voa.assets.currentBalance');
        const incomeData = get(reportData, 'voi.institutions', []);

        const incomeDataObj = {'entries': [], 'total': 0}
        incomeData.forEach(bank => {
            return bank.accounts.forEach(account => {
                return account.incomeStreams.forEach((income) => {
                    incomeDataObj['entries'].push({                         
                        name: income.name,
                        income: income.projectedGrossAnnual,
                        key: income.id,
                        incomeKey: income.id,
                    });
                    return incomeDataObj['total'] = incomeDataObj['total'] + income.projectedGrossAnnual
                })
            })
        })
        debugger;
        this.setState({
            incomeEntries: incomeDataObj['entries'], 
            incomeTotal: incomeDataObj['total'],
            assetsTotal: assetsData,
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
        this.setState({loadingFinicityIframe: true});
        API.createFinicityUrl().then(res => {
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
                            }).catch(
                                this.setState({
                                    showFinicityIframe: false, 
                                    loadingFinicityIframe: false, 
                                    errors: ["There was an error generating your income and assets report. Please try again."]
                                })
                            );
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
        if (
                this.state.incomeEntries.length > 0 || 
                this.state.incomeTotal > 0 || 
                this.state.assetsTotal > 0
            ) {
            return <ReviewAccountsPage 
                incomeEntries={this.state.incomeEntries}
                incomeTotal={this.state.incomeTotal}
                assetsTotal={this.state.assetsTotal}
                history={this.props.history}
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

export default withRelativeRoutes(ConnectBankPage, ROUTES.CONNECT_BANK);
