import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { cardContainer, totalContainer } from './styles';


function YourAccountBalance (props) {
    debugger;
    return (
        <div className={cardContainer}>
            <P bold>Your Account Balance</P>
            <P margin="20px 0">
                Your total balance is shown below. It will be used to determine your eligibility to rent.
            </P>
            <div className={totalContainer}>
                <P bold>Total Account Balance</P>
                <P bold>{props.assetsBalance}</P>
            </div>
        </div>
    );
}

YourAccountBalance.propTypes = {
    assetsBalance: PropTypes.object,
}

export default YourAccountBalance;

