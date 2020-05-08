import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import { prettyCurrency, getIncomeRequirementText } from 'utils/misc';
import AddAnotherButton from 'components/common/AddAnotherButton';
import Tip from 'components/common/Tip';

import {  totalContainer, incomeEntry } from './styles'
import { Card, CardSection, P } from 'assets/styles'

export function YourIncome (props) {
    if (!props.profile || !props.config || !props.applicant) return null;
    return (
        <Card>
            <CardSection>
                <P bold>Your Income</P>
                <P margin="20px 0">You may edit the employer's name. The income values shown here are estimates.</P>
                {
                    props.incomeEntries.map( entry => {
                        return <IncomeEntry 
                            income={entry.income} 
                            key={entry.id}
                            id={entry.id}
                            value={props.values[entry.id]}
                            handleChange={props.handleChange}
                            handleBlur={props.handleBlur}
                        />  
                    })
                }
                <AddAnotherButton
                    thing="income source manually"
                    onClick={() => console.log('clickety-clack')}
                />
                <div className={totalContainer}>
                    <P bold>Total Income</P>
                    <P bold>{prettyCurrency(props.incomeTotal)}</P>
                </div>
            </CardSection>
            <CardSection>
                <Tip
                    text={
                        <><P>{getIncomeRequirementText(props)}</P>
                        <AddAnotherButton>Add a guarantor</AddAnotherButton></>
                    }
                />
            </CardSection>
        </Card>
    );
}

const mapStateToProps = state => ({
    config: state.configuration,
    profile: state.renterProfile,
    applicant: state.applicant,
})
export default connect(mapStateToProps)(YourIncome);

YourIncome.propTypes = {
    incomeEntries: PropTypes.array,
    incomeTotal: PropTypes.number,
    values: PropTypes.object,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
}


export const IncomeEntry = (props) => {
    return (
        <div className={incomeEntry}>
            <TextField
                label="Employer Name"
                name={props.id}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.value}
            />
            <P bottomAligned>{prettyCurrency(props.income)}</P>
        </div>
    )
}

YourIncome.propTypes = {
    id: PropTypes.string,
    values: PropTypes.object,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
}

