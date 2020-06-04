import React from 'react';
import styled from '@emotion/styled';

import { BackLink } from 'components/common/BackLink';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, H3 } from 'assets/styles';
import finance from 'assets/images/finance.png';
import captureRoute from 'app/captureRoute';
import { ROUTES } from 'app/constants';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export function AddIncomeSource (props) {
    return (
        <>
            <SkinnyH1>Add an Income Source</SkinnyH1>
            <SpacedH3>Fill in the details below to add your income source.</SpacedH3>
            <img alt="coin" src={finance}></img>
            <ActionButton marginTop={40} marginBottom={20}>
                Continue
            </ActionButton>
            <BackLink to={ROUTES.MANUAL_INCOME_VERIFICATION}/>
        </>
    );
}
AddIncomeSource.route = ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME;

export default captureRoute(AddIncomeSource);
