import React from 'react';
import PropTypes from 'prop-types';

import { BoldP, SpacedP, Card, CardSection, total } from './styles';


function YourAccountBalance (props) {
    return (
        <Card>
            <CardSection>
                <BoldP>Your Account Balance</BoldP>
                <SpacedP>
                    Your total balance is shown below. It will be used to determine your eligibility to rent.
                </SpacedP>
                <div className={total}>
                    <BoldP>Total Account Balance</BoldP>
                    <BoldP>$82,838</BoldP>
                </div>
            </CardSection>
        </Card>
    );
}

YourAccountBalance.propTypes = {
    assetsData: PropTypes.object,
}

export default YourAccountBalance;

