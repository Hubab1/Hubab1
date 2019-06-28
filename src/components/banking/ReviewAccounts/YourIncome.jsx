import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import uuidv4 from 'uuid/v4';

import { formatCurrency } from 'utils/misc';
import AddAnotherButton from 'components/common/AddAnotherButton';
import { P } from 'assets/styles';
import { cardContainer, totalContainer, incomeEntry } from './styles'


const getIncomeEntriesAndTotal = incomeData => {
    const incomeDataObj = {'entries': [], 'total': 0}
    incomeData.map(bank => {
        return bank.accounts.map(account => {
            return account.incomeStreams.map((income) => {
                incomeDataObj['entries'].push(
                    <IncomeEntry 
                        name={income.name}
                        income={income.projectedGrossAnnual} 
                        key={uuidv4()}
                    />
                );
                incomeDataObj['total'] = incomeDataObj['total'] + income.projectedGrossAnnual
            })
        })
    })
    return incomeDataObj;
}

function YourIncome (props) {
    const incomeDataObj = getIncomeEntriesAndTotal(props.incomeData);
    return (
        <div className={cardContainer}>
            <P bold>Your Income</P>
            <P margin="20px 0">You may edit the employer’s name. The income values shown here are estimates.</P>
            {incomeDataObj['entries']}
            <AddAnotherButton
                thing="income source manually"
                onClick={() => console.log('clickety-clack')}
            />
            <div className={totalContainer}>
                <P bold>Total Income</P>
                <P bold>{formatCurrency(incomeDataObj['total'])}</P>
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
                value={props.name}
            />
            <P bottomAligned>{formatCurrency(props.income)}</P>
        </div>
    )
}

YourIncome.propTypes = {
    name: PropTypes.string,
    income: PropTypes.number,
}

