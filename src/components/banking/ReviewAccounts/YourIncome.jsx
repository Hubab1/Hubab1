import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formatCurrency } from 'utils/misc';
import AddAnotherButton from 'components/common/AddAnotherButton';
import lightbulb from 'assets/images/lightbulb.png';
import TextField from '@material-ui/core/TextField';
import AddCircle from '@material-ui/icons/AddCircle'

import { SpacedP, BoldP, Card, CardSection, addLink, iconRoot, total, incomeEntry, BottomAlignedP } from './styles'
import { P } from 'assets/styles'

const Bulb = styled.img`
    width: 50px;
    height: 46px;
`

export const getRequirementText = props => {
    const {config, profile} = this.props;
    if (profile.unit) {
        // use applicant endpoint data for this in the future
        if (profile.selected_rental_options && profile.selected_rental_options.includes('guarantor')) {
            return `The total income required for a guarantor on the application is ${config.guarantor_income_requirement_multiplier}x the rent: ${formatCurrency(192000)}`;
        } else {
            return `The total income required for all members of the application is ${config.applicant_income_requirements}x the rent: ${formatCurrency(96000)}`;
        }
    } else {
        if (profile.selected_rental_options && profile.selected_rental_options.includes('guarantor')) {
            return `The total income required for all members of the application is ${config.guarantor_income_requirement_multiplier}x the rent`;
        } else {
            return `The total income required for a guarantor on the application is ${config.applicant_income_requirements}x the rent`;
        }
    }
}

function YourIncome (props) {
    return (
        <Card>
            <CardSection>
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
                label="Employer One"
                name="employer_one"
                value="World Industries"
            />
            <BottomAlignedP>$38,934</BottomAlignedP>
        </div>
    )
}
