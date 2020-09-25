import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import { H1, H3 } from 'assets/styles';
import piggybank from 'assets/images/piggybank.gif';

const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
`;

const Piggy = styled.img`
    max-width: 300px;
    max-height: 300px;
`;

function BankVerifying () {
    return (
        <Fragment>
            <H1>One Moment Please</H1>
            <SpacedH3>We are verifying your information and should be done shortly.</SpacedH3>
            <Piggy alt="piggy bank" src={piggybank} />
        </Fragment>
    );
}

export default BankVerifying;
