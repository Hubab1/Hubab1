import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import AddAnotherButton from 'components/common/AddAnotherButton';
import { P } from 'assets/styles';
import { cardContainer, totalContainer, incomeEntry } from './styles'


function YourIncome (props) {
    return (
        <div className={cardContainer}>
            <P bold>Your Income</P>
            <P margin="20px 0">You may edit the employer’s name. The income values shown here are estimates.</P>
            <IncomeEntry/>
            <AddAnotherButton
                thing="income source manually"
                onClick={() => console.log('clickety-clack')}
            />
            <div className={totalContainer}>
                <P bold>Total Income</P>
                <P bold>$82,838</P>
            </div>
        </div>
    );
}

YourIncome.propTypes = {
    incomeData: PropTypes.object,
}

export default YourIncome;


const IncomeEntry = (props) => {
    return (
        <div className={incomeEntry}>
            <TextField
                label="Employer One"
                name="employer_one"
                value="World Industries"
            />
            <P bottomAligned>$38,934</P>
        </div>
    )
}
