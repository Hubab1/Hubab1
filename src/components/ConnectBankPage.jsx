import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { backLinkRoot } from 'components/common/BackLink';
import { H1, H3 } from 'assets/styles';
import { ROUTES } from 'app/constants';

const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
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
                <ActionButton onClick={this.linkBankAccount} marginTop="20px" marginBottom="10px">
                    Link Bank Account
                </ActionButton>
                <Link to={ROUTES.PROFILE_OPTIONS} className={backLinkRoot}>Don't Want to Link</Link>
            </Fragment>
        );
    }
}

export default ConnectBankPage;
