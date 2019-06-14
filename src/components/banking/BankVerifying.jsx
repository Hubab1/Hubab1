import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import { H1, H3 } from 'assets/styles';

const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
`

function BankVerifying () {
    return (
        <Fragment>
            <H1>One Moment Please</H1>
            <SpacedH3>We are verifying your information and should be done shortly.</SpacedH3>
            {/**
                put animated piggy bank here
            */}
        </Fragment>
    );
}

export default BankVerifying;