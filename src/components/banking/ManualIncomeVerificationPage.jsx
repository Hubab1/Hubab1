import React from 'react';
import styled from '@emotion/styled';

import { BackButton } from 'components/common/BackLink';
import ActionButton from 'components/common/ActionButton/ActionButton';
import Capsule from 'components/common/Capsule/Capsule';
import { H1, H3 } from 'assets/styles';
import finance from 'assets/images/finance.png';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export default function ManualIncomeVerificationPage (props) {
    return (
        <>
            <SkinnyH1>Income and Asset Verification</SkinnyH1>
            <SpacedH3>Add at least one income source or asset below.</SpacedH3>
            <Capsule
                prefix={<img alt="coin" src={finance}></img>}
                label="Income"
                buttonLabel="Add an Income Source"
                tip="TBD"
            />
            <ActionButton marginTop={40} marginBottom={20}>
                Continue
            </ActionButton>
            <BackButton onClick={props.goBack} />
        </>
    );
}
