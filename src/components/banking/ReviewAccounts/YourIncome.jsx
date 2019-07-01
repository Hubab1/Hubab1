import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import uuidv4 from 'uuid/v4';

import { formatCurrency } from 'utils/misc';
import AddAnotherButton from 'components/common/AddAnotherButton';
import lightbulb from 'assets/images/lightbulb.png';

import { Card, CardSection, totalContainer, incomeEntry } from './styles'
import { P } from 'assets/styles'

const Bulb = styled.img`
    width: 50px;
    height: 46px;
`

export const getRequirementText = props => {
    const {config, profile} = props;
    if (profile.unit) {
        // use applicant endpoint data for this in the future
        if (profile.selected_rental_options && profile.selected_rental_options.includes('guarantor')) {
            return `The total income required for a guarantor on the application is ${config.guarantor_income_requirement_multiplier}x the rent: ${formatCurrency(config.guarantor_income_requirement_multiplier * profile.unit.price)}`;
        } else {
            return `The total income required for all members of the application is ${config.applicant_income_requirements}x the rent: ${formatCurrency(config.applicant_income_requirements * profile.unit.price)}`;
        }
    } else {
        if (profile.selected_rental_options && profile.selected_rental_options.includes('guarantor')) {
            return `The total income required for all members of the application is ${config.guarantor_income_requirement_multiplier}x the rent`;
        } else {
            return `The total income required for a guarantor on the application is ${config.applicant_income_requirements}x the rent`;
        }
    }
}

const getIncomeEntriesAndTotal = incomeData => {
    const incomeDataObj = {'entries': [], 'total': 0}
    incomeData.forEach(bank => {
        return bank.accounts.forEach(account => {
            return account.incomeStreams.forEach((income) => {
                incomeDataObj['entries'].push(
                    <IncomeEntry 
                        name={income.name}
                        income={income.projectedGrossAnnual} 
                        key={income.id}
                    />
                );
                return incomeDataObj['total'] = incomeDataObj['total'] + income.projectedGrossAnnual
            })
        })
    })
    return incomeDataObj;
}

function YourIncome (props) {
    if (!props.profile || !props.config) return null;
    const incomeDataObj = getIncomeEntriesAndTotal(props.incomeData);
    return (
        <Card>
            <CardSection>
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
            </CardSection>
            <CardSection>
                <Grid container spacing={1} alignItems="flex-start">
                    <Grid item>
                        <Bulb alt="light bulb" src={lightbulb} />
                    </Grid>
                    <Grid item xs>
                        <P>{getRequirementText(props)}</P>
                        <AddAnotherButton>Add a guarantor</AddAnotherButton>
                    </Grid>
                </Grid>
            </CardSection>
        </Card>
    );
}

const mapStateToProps = state => ({
    config: state.configuration,
    profile: state.renterProfile,
})
export default connect(mapStateToProps)(YourIncome);

YourIncome.propTypes = {
    incomeData: PropTypes.object,
}


const IncomeEntry = (props) => {
    return (
        <div className={incomeEntry}>
            <TextField
                label="Employer Name"
                name="employer_name"
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

