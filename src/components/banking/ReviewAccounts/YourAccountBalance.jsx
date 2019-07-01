import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { formatCurrency } from 'utils/misc';
import { Card, CardSection, totalContainer } from './styles';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';


function YourAccountBalance (props) {
    return (
        <Card>
            <CardSection>
                <P bold>Your Account Balance</P>
                <P>
                    Your total balance is shown below. It will be used to determine your eligibility to rent.
                </P>
                <P fontSize={14}>
                    How did we get this number?
                    <Tooltip
                        enterTouchDelay={100}
                        placement="top-end"
                        title="Lorem ipsum"
                    >
                        <Info style={{color:'#828796',width:14}}/>
                    </Tooltip>
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

