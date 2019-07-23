import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardSection, P } from 'assets/styles';
import { formatCurrency } from 'utils/misc';
import { totalContainer, infoIconRoot } from './styles';
import Info from '@material-ui/icons/Info';
import MouseOverPopover from 'components/common/MouseOverPopover';


function YourAccountBalance (props) {
    return (
        <Card>
            <CardSection>
                <P bold>Your Account Balance</P>
                <P>
                    Your total balance is shown below. It will be used to determine your eligibility to rent.
                </P>
                <P fontSize={14}>
                    How did we get this number?&nbsp;
                    <MouseOverPopover>
                        <Info classes={{root: infoIconRoot}} style={{color:'#828796',width:16}}/>
                    </MouseOverPopover>
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

