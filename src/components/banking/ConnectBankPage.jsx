import React from 'react';
import { css } from 'emotion';

import { ROUTES } from 'app/constants';
import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';
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
        reportData: null
    }

    openFinicityIframe = () => {
        this.setState({loadingFinicityIframe: true});
        API.createFinicityUrl().then(res => {
            this.setState({showFinicityIframe: true, errors: null}, 
                () => window.finicityConnect.connectIFrame(res.link, {
                    selector: '#finicity-container',
                    overlay: "rgba(255,255,255, 0)",
                    success: (data) => {    
                        console.log('success')
                        // for testing - fake bank = finbank; fake bank creds= user:demo pw:go 
                        // example data:
                        // {success: true, reasonCode: "OK"}
                        if (!!data.success) {
                            this.setState({showFinicityIframe: null, errors: null, loadingReport: true, loadingFinicityIframe: false});
                            API.getFinicityReport().then( res => {
                                this.setState({reportData: res})
                            });
                        } else {
                            this.setState({showFinicityIframe: false, errors: ["There was an error accessing your information. Please try again."], loadingFinicityIframe: false});
                        }
                    },
                    cancel: () => {
                        console.log('The user cancelled the iframe');
                        // for some reason, this setState isn't defined here and errors out... thoughts?
                        this.setState({showFinicityIframe: false, loadingFinicityIframe: false});
                    },
                    error: (err) => {
                        console.error('Some runtime error was generated during Finicity Connect', err);
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
        if (this.state.reportData) return <div>{JSON.stringify(this.state.reportData)}</div>
        if (this.state.showFinicityIframe) {
            return <div className={finicityContainer} id="finicity-container"/>;
        }
        if (this.state.loadingReport) {
            return <BankVerifying/>;
        }
        return <ConnectFinicity 
            loadingFinicityIframe={!!this.state.loadingfinicityIframe}
            openFinicityIframe={this.openFinicityIframe}
            errors={this.state.errors}
        />
    }
}

export default withRelativeRoutes(ConnectBankPage, ROUTES.CONNECT_BANK);
