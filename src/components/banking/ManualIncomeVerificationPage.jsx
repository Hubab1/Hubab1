import React from 'react';
import styled from '@emotion/styled';

import { BackLink } from 'components/common/BackLink';
import ActionButton from 'components/common/ActionButton/ActionButton';
import Capsule from 'components/common/Capsule/Capsule';
import { H1, H3 } from 'assets/styles';
import finance from 'assets/images/finance.png';
import piggyBank from 'assets/images/piggy-bank.png';
import captureRoute from 'app/captureRoute';
import { ROUTES } from 'app/constants';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export function ManualIncomeVerificationPage (props) {
    return (
        <>
            <SkinnyH1>Income and Asset Verification</SkinnyH1>
            <SpacedH3>Add at least one income source or asset below.</SpacedH3>
            <Capsule
                prefix={<img alt="coin" src={finance}></img>}
                label="Income"
                buttonLabel="Add an Income Source"
                tip="TBD"
                route={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME}
            />
            <Capsule
                prefix={<img alt="piggy bank" src={piggyBank}></img>}
                label="Assets"
                buttonLabel="Add an Asset"
                tip="TBD"
                route={ROUTES.MANUAL_ASSET_ENTRY_ADD_INCOME}
            />
            <ActionButton marginTop={40} marginBottom={20}>
                Continue
            </ActionButton>
            <BackLink to={ROUTES.INCOME_AND_EMPLOYMENT} />
        </>
    );
}

ManualIncomeVerificationPage.route = ROUTES.MANUAL_INCOME_VERIFICATION;

export default captureRoute(ManualIncomeVerificationPage)
