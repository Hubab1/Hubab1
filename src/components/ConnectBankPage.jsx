import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { backLinkRoot } from 'components/common/BackLink';
import { H1, H3 } from 'assets/styles';
import { ROUTES } from 'app/constants';
import GenericFormError from 'components/common/GenericFormError';
import API from 'app/api';

const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
`

export class ConnectBankPage extends React.Component {
    state = {finicityUrl: null, errors: null}

    linkBankAccount = (data) => {
        API.createFinicityUrl(data).then(res => {
            this.setState({finicityUrl: res.finicity_url, errors: null});
        });
        console.log('do some stuff');
    }

    render () {
        if (this.state.finicityUrl) {
            window.finicityConnect.connectIFrame(this.state.finicityUrl, {
                selector: '.subPage',
                overlay: "rgba(255,255,255, 0)",
                // success: (data) => {
                //   if(data.reportId){
                //     console.log("Yay! We got reportId", data.reportId);

                //   } else{
                //       debugger;
                //      console.log('The user finished, but added no accounts, so no report id exists');
                //   }
                // },
                // ping: () => {
                //     debugger;
                // },
                // cancel: function(){
                //   console.log('The user cancelled the iframe');
                //   this.setState({finicityUrl: null, errors: ['You cancelled out of the Finicity Application. Please try again.']})
                // },
                // error: function(err){
                //   console.error('Some runtime error was generated during Finicity Connect', err);
                //   this.setState({finicityUrl: null, errors: ['There was an error attempting to get your records. Please try again.']})
                // },
                // loaded: function(){
                //   console.log('This gets called only once asfter the iframe has finished loading');
                // },
                // sessionExpired: () => {
                //     debugger;
                // }
            });
            return <Fragment/>;
        }
        return (
            <Fragment>
                <H1>Verify Your Income Instantly</H1>
                <SpacedH3>Confirm that you qualify for this apartment by linking your bank account.</SpacedH3>
                {!!this.state.errors && <GenericFormError errors={this.state.errors}/>}
                <ActionButton onClick={this.linkBankAccount} marginTop="20px" marginBottom="20px">
                    Link Bank Account
                </ActionButton>
                <Link to={ROUTES.MANUAL_INCOME_ENTRY} className={backLinkRoot}>Don't Want to Link?</Link>
            </Fragment>
        );
    }
}

export default ConnectBankPage;
