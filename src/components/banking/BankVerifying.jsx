import React, { Fragment } from 'react';

import { H1, Subtitle } from 'assets/styles';


function BankVerifying () {
    return (
        <Fragment>
            <H1>One Moment Please</H1>
            <br/>
            <Subtitle>We are verifying your information and should be done shortly.</Subtitle>
            {/**
                put animated piggy bank here
            */}
        </Fragment>
    );
}

export default BankVerifying;