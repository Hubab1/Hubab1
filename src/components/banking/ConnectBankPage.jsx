import React, { Fragment, useRef } from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Link } from 'react-router-dom';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';

import safeImage from 'assets/images/connect-bank/safe.png';
import padlockImage from 'assets/images/connect-bank/padlock.png';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, H3, P, Bold, linkRoot } from 'assets/styles';
import { ROUTES } from 'app/constants';
import GenericFormError from 'components/common/GenericFormError';  
import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';
import BankVerifying from './BankVerifying';

const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
`

const bodyContainer = css`
    margin: 40px 10px 40px 30px;
    text-align: left;
    display: flex;
    flex-direction: column;
    p{ margin-left: 15px;}
`

const bodyRow = css`
    display: flex;
    :first-of-type{margin-bottom: 20px;}
`

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
                            this.setState({showFinicityIframe: null, errors: null, loadingReport: true});
                            API.getFinicityReport().then( res => {
                                this.setState({loadingFinicityIframe: false, reportData: res})
                            });
                        } else {
                            this.setState({showFinicityIframe: false, loadingFinicityIframe: false, errors: ["There was an error accessing your information. Please try again."]});
                        }
                    },
                    cancel: function(){
                        console.log('The user cancelled the iframe');
                        // for some reason, this setState isn't defined here and errors out... thoughts?
                        this.setState({showFinicityIframe: false, loadingFinicityIframe: false});
                    },
                    error: function(err){
                        console.error('Some runtime error was generated during Finicity Connect', err);
                        this.setState({showFinicityIframe: false, loadingFinicityIframe: false, errors: ['There was an error attempting to get your records. Please try again.']});
                    },
                    loaded: function(){
                        // we might want to add some sort of loading state while links are fetched... need to check with product. this callback would cancel it.
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
        return (
            <Fragment>
                <H1>Verify Your Income Instantly</H1>
                <SpacedH3>Confirm that you qualify for this apartment by linking your bank account.</SpacedH3>
                <img src={safeImage} alt="vault"/>
                <div className={bodyContainer}>
                    <div className={bodyRow}>
                        <img src={padlockImage} alt="padlock" width="18" height="28"/>
                        <P><Bold>Your data is safe.</Bold> Bank level encryption is used to connect and your credentials are never stored.</P>
                    </div>
                    <div className={bodyRow}>
                        <DoneRoundedIcon style={{color:'#00CAB1',width:'18px'}}/>
                        <P><Bold>Your money is safe.</Bold> This does not authorize any transactions from your account.</P>
                    </div>
                </div>
                {!!this.state.errors && <GenericFormError errors={this.state.errors}/>}
                <ActionButton disabled={!!this.state.loadingFinicityIframe} onClick={this.openFinicityIframe} marginBottom="20px">
                    Link Bank Account
                </ActionButton>
                <Link to={ROUTES.MANUAL_INCOME_ENTRY} className={linkRoot}>Don't Want to Link?</Link>
            </Fragment>
        );
    }
}

export default withRelativeRoutes(ConnectBankPage, ROUTES.CONNECT_BANK);
