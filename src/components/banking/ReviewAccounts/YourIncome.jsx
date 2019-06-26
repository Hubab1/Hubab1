import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import AddCircle from '@material-ui/icons/AddCircle'

import { SpacedP, BoldP, cardContainer, addLink, iconRoot, total, incomeEntry, BottomAlignedP } from './styles'


function YourIncome (props) {
    return (
        <div className={cardContainer}>
            <BoldP>Your Income</BoldP>
            <SpacedP>You may edit the employer’s name. The income values shown here are estimates.</SpacedP>
            <IncomeEntry/>
            <div className={addLink}>
                <AddCircle classes={{root: iconRoot}}/> Add another income source manually 
            </div>
            <div className={total}>
                <BoldP>Total Income</BoldP>
                <BoldP>$82,838</BoldP>
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
            <BottomAlignedP>$38,934</BottomAlignedP>
        </div>
    )
}
