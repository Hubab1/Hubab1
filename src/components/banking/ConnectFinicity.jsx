import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Link } from 'react-router-dom';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';

import safeImage from 'assets/images/connect-bank/safe.png';
import padlockImage from 'assets/images/connect-bank/padlock.png';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, H3, P, Bold, blackLinkRoot } from 'assets/styles';
import { ROUTES } from 'app/constants';
import GenericFormError from 'components/common/GenericFormError';  

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

const ConnectFinicity = props => {
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
            {!!props.errors && <GenericFormError errors={props.errors}/>}
            <ActionButton disabled={props.loadingFinicityIframe} onClick={props.openFinicityIframe} marginBottom="20px">
                Link Bank Account
            </ActionButton>
            <Link to={ROUTES.MANUAL_INCOME_ENTRY} className={blackLinkRoot}>Don't Want to Link?</Link>
        </Fragment>
    );
}

export default ConnectFinicity;
