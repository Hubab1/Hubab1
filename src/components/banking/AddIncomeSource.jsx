import React from 'react';
import styled from '@emotion/styled';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import * as Yup from 'yup';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import { allValuesSet } from 'utils/formik';
import { BackLink } from 'components/common/BackLink';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, H3, Spacer } from 'assets/styles';
import finance from 'assets/images/finance.png';
import captureRoute from 'app/captureRoute';
import { ROUTES, INCOME_TYPES } from 'app/constants';
import { Formik } from 'formik';
const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export function AddIncomeSource (props) {
    function getInitialValues () {
        return Object.assign({
            income_type: '',
            estimated_amount: ''
        }, props.initialValues);
    }
    const onSubmit = values => {
        // TODO: submit handling
        props.history.push(ROUTES.MANUAL_INCOME_VERIFICATION);
    }
    return (
        <>
            <SkinnyH1>Add an Income Source</SkinnyH1>
            <SpacedH3>Fill in the details below to add your income source.</SpacedH3>
            <img alt="coin" src={finance}></img>
            <Spacer height={30}/>
            <Formik
                validationSchema={
                    Yup.object({
                        income_type: Yup.number().required('Required'),
                        estimated_amount: Yup.string().required('Required')
                    })
                }
                onSubmit={onSubmit}
                initialValues={getInitialValues()}
            >
                {
                ({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    submitCount,
                    setFieldValue
                }) => (
                <form onSubmit={handleSubmit}>
                    <div className="align-left">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="income-type">Income Type</InputLabel>
                            <Select
                                value={values.income_type}
                                fullWidth
                                onChange={handleChange}
                                inputProps={{
                                    name: 'income_type',
                                    id: 'income-type',
                                }}
                            >
                                {INCOME_TYPES.map(incomeType => (
                                    <MenuItem key={incomeType.value} value={incomeType.value}>{incomeType.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Spacer height={24}/>
                        {
                            values.income_type &&
                            <CurrencyTextField
                                fullWidth
                                textAlign="left"
                                label="Estimated annual income"
                                minimumValue="0"
                                name="estimated_amount"
                                currencySymbol="$"
                                outputFormat="string"
                                onChange={handleChange}
                            />
                        }
                    </div>
                    <ActionButton disabled={!allValuesSet(values)} marginTop={40} marginBottom={20}>
                        Add Income Source
                    </ActionButton>
                </form>
                )}
            </Formik>
            <BackLink to={ROUTES.MANUAL_INCOME_VERIFICATION}/>
        </>
    );
}
AddIncomeSource.route = ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME;

export default captureRoute(AddIncomeSource);
