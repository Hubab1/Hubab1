import React, { Fragment } from 'react';
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
// import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';

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
    state = {finicityUrl: null, errors: null}

    openFinicityIframe = (data) => {
        this.props._nextRoute();
        // API.createFinicityUrl(data).then(res => {
        //     this.setState({finicityUrl: res.finicity_url, errors: null}, 
        //         () => window.finicityConnect.connectIFrame(this.state.finicityUrl, {
        //             selector: '#finicity-container',
        //             overlay: "rgba(255,255,255, 0)",
        //             link to webhook 
        //             success: (data) => {
        //               if(data.reportId){
        //                 console.log("Yay! We got reportId", data.reportId);

        //               } else{
        //                  console.log('The user finished, but added no accounts, so no report id exists');
        //               }
        //             },
        //             cancel: function(){
        //               console.log('The user cancelled the iframe');
        //               this.setState({finicityUrl: null, errors: ['You cancelled out of the Finicity Application. Please try again.']})
        //             },
        //             error: function(err){
        //               console.error('Some runtime error was generated during Finicity Connect', err);
        //               this.setState({finicityUrl: null, errors: ['There was an error attempting to get your records. Please try again.']})
        //             },
        //             loaded: function(){
        //               console.log('This gets called only once asfter the iframe has finished loading');
        //             },
        //         })
        //     );
        // });
    }

    render () {
        if (this.state.finicityUrl) {
            return <div className={finicityContainer} id="finicity-container"/>;
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
                <ActionButton onClick={this.openFinicityIframe} marginBottom="20px">
                    Link Bank Account
                </ActionButton>
                <Link to={ROUTES.MANUAL_INCOME_ENTRY} className={linkRoot}>Don't Want to Link?</Link>
            </Fragment>
        );
    }
}

export default withRelativeRoutes(ConnectBankPage, ROUTES.CONNECT_BANK);
