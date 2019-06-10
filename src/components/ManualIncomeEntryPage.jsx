import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import { H1, H3, P } from 'assets/styles';
import { ROUTES } from 'app/constants';

const SpacedH3 = styled(H3)`
    margin: 10px 10% 25px 10%;
`

export class ManualIncomeEntryPage extends React.Component {

    linkBankAccount = () => {
        console.log('do some stuff');
    }

    render () {
        return (
            <Fragment>
                <H1>Provide Proof of Income</H1>
                <SpacedH3>(Verification may take several days)</SpacedH3>
                <P>
                    Enter income and employment information and upload required documents. 
                    This method is preferred if you freelance or have an irregular income stream.
                </P>
                <ActionButton onClick={this.linkBankAccount} marginTop="30px" marginBottom="20px">
                    Enter Info Manually
                </ActionButton>
                <BackLink to={ROUTES.CONNECT_BANK}/>
            </Fragment>
        );
    }
}

export default ManualIncomeEntryPage;