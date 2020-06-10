import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import * as Yup from 'yup';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import capitalize from 'lodash/capitalize';

import { allValuesSet } from 'utils/formik';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { Spacer } from 'assets/styles';
import { ASSET_TYPES, INCOME_TYPES, FINANCIAL_STREAM_ASSET } from 'app/constants';
import { Formik } from 'formik';

export default function AddFinancialSourceForm (props) {
    const financialTypeLabel = props.financialType === FINANCIAL_STREAM_ASSET ? 'asset' : 'income';
    const selectChoices = props.financialType === FINANCIAL_STREAM_ASSET ?
        ASSET_TYPES : INCOME_TYPES;

    function getInitialValues () {
        return Object.assign({
            income_or_asset_type: '',
            estimated_amount: ''
        }, props.initialValues);
    }
    return (
        <Formik
            validationSchema={
                Yup.object({
                    income_or_asset_type: Yup.number().required('Required'),
                    estimated_amount: Yup.string().required('Required')
                })
            }
            onSubmit={props.onSubmit}
            initialValues={getInitialValues()}
        >
            {
            ({
                values,
                handleChange,
                handleSubmit,
                errors,
                submitCount,
                isSubmitting
            }) => (
            <form onSubmit={handleSubmit}>
                <div className="align-left">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="income-or-asset-type">{financialTypeLabel} type</InputLabel>
                        <Select
                            error={!!errors.income_or_asset_type}
                            value={values.income_or_asset_type}
                            fullWidth
                            onChange={handleChange}
                            inputProps={{
                                name: 'income_or_asset_type',
                                id: 'income-or-asset-type',
                            }}
                        >
                            {selectChoices.map(incomeType => (
                                <MenuItem key={incomeType.value} value={incomeType.value}>{incomeType.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Spacer height={24}/>
                    {
                        values.income_or_asset_type &&
                        <CurrencyTextField
                            error={submitCount > 0 && !!errors.estimated_amount}
                            helperText={submitCount > 0 && errors.estimated_amount}
                            fullWidth
                            textAlign="left"
                            label={`Estimated ${financialTypeLabel} balance`}
                            minimumValue="0"
                            name="estimated_amount"
                            currencySymbol="$"
                            outputFormat="string"
                            onChange={handleChange}
                        />
                    }
                </div>
                <ActionButton disabled={!allValuesSet(values) || isSubmitting} marginTop={40} marginBottom={20}>
                    Add {capitalize(financialTypeLabel)} Source
                </ActionButton>
            </form>
            )}
        </Formik>
    )
}
