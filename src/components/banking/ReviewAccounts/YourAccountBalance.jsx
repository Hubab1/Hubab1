import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { formatCurrency } from 'utils/misc';
import { Card, CardSection, totalContainer } from './styles';


function YourAccountBalance (props) {
    return (
        <Card>
            <CardSection>
                <P bold>Your Account Balance</P>
                <P margin="20px 0">
                    Your total balance is shown below. It will be used to determine your eligibility to rent.
                </P>
                <div className={totalContainer}>
                    <P bold>Total Account Balance</P>
                    <P bold>{formatCurrency(props.assetsBalance)}</P>
                </div>
            </CardSection>
        </Card>
    );
}

YourAccountBalance.propTypes = {
    assetsBalance: PropTypes.number,
}

export default YourAccountBalance;

