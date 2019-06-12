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

const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
`

const bodyContainer = css`
    margin: 40px 0;
    display: flex;
`

const bodyRow = css`
    display: flex;
    justify-content: center;
`


export class ConnectBankPage extends React.Component {

    linkBankAccount = () => {
        console.log('do some stuff');
    }

    render () {
        return (
            <Fragment>
                <H1>Verify Your Income Instantly</H1>
                <SpacedH3>Confirm that you qualify for this apartment by linking your bank account.</SpacedH3>
                <img src={safeImage} alt="valult"/>
                <div className={bodyContainer}>
                    <div className={bodyRow}>
                        <img src={padlockImage} alt="padlock"/>
                        <P><Bold>Your data is safe.</Bold> Bank level encryption is used to connect and your credentials are never stored.</P>
                    </div>
                    <div className={bodyRow}>
                        <DoneRoundedIcon style={{color:'#00CAB1', width:'18px'}}/>
                        <P><Bold>Your money is safe.</Bold> This does not authorize any transactions from your account.</P>
                    </div>
                </div>
                <ActionButton onClick={this.linkBankAccount} marginTop="20px" marginBottom="20px">
                    Link Bank Account
                </ActionButton>
                <Link to={ROUTES.MANUAL_INCOME_ENTRY} className={linkRoot}>Don't Want to Link?</Link>
            </Fragment>
        );
    }
}

export default ConnectBankPage;
