import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardSection, P, infoIconRoot } from 'assets/styles';
import { prettyCurrency } from 'utils/misc';
import { totalContainer } from './styles';
import Info from '@material-ui/icons/Info';
import SimplePopover from 'components/common/SimplePopover';


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
                    <SimplePopover>
                        <Info classes={{root: infoIconRoot}} style={{color:'#828796',width:16}}/>
                    </SimplePopover>
                </P>
                <div className={totalContainer}>
                    <P bold>Total Account Balance</P>
                    <P bold margin="10px 0">{prettyCurrency(props.assetsBalance)}</P>
                </div>
            </CardSection>
        </Card>
    );
}

YourAccountBalance.propTypes = {
    assetsBalance: PropTypes.number,
}

export default YourAccountBalance;

