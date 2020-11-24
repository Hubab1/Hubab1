import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import * as Yup from 'yup';
import { filter, find, sortBy, flow } from 'lodash/fp';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import capitalize from 'lodash/capitalize';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';

import { allValuesSet } from 'utils/formik';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { Spacer } from 'assets/styles';
import { FINANCIAL_STREAM_ASSET, ALL_INCOME_OR_ASSET_TYPES, INCOME_TYPE_OTHER, ASSET_TYPE_OTHER } from 'app/constants';
import { Formik } from 'formik';
import UploadDocuments from './UploadDocuments';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import { connect } from 'react-redux';

export function AddFinancialSourceForm(props) {
    const isAsset = props.financialType === FINANCIAL_STREAM_ASSET;
    const financialTypeLabel = isAsset ? 'asset' : 'income';

    const filterByType = filter({ stream_type: props.financialType });
    const sortByType = sortBy(['income_or_asset_type']);
    const selectChoices = flow(filterByType, sortByType)(props.financial_documents_validations);

    function getInitialValues() {
        return Object.assign(
            {
                income_or_asset_type: '',
                estimated_amount: '',
                uploadedDocuments: {},
            },
            props.initialValues
        );
    }
    function onChangeSelect(e, handleChange, setFieldValue) {
        handleChange(e);
        // clear other if other field becomes hidden
        setFieldValue('other', null);
        setFieldValue('uploadedDocuments', {});
    }

    const uploadedAllDocuments = (uploadedDocuments, type) => {
        const config = props.config.financial_documents_validations;
        const requirement = config.find((doc) => doc.income_or_asset_type === type);

        if (!requirement) return true;

        const requireAll = requirement?.require_all ?? true;

        const metMinimumRequired = (doc) => {
            const countUploaded = uploadedDocuments[String(doc.id)]
                ? uploadedDocuments[String(doc.id)].files.length
                : 0;
            return countUploaded >= doc.min_required;
        };

        if (requireAll) return requirement.proof_documents.every(metMinimumRequired);
        return requirement.proof_documents.some(metMinimumRequired);
    };

    const getSubmitButtonText = (isSubmitting) => {
        if (props.isEditing) {
            return isSubmitting ? 'Saving Changes...' : 'Save Changes';
        }

        if (isAsset) {
            return isSubmitting ? 'Adding Asset...' : 'Add Asset';
        }

        return isSubmitting ? 'Adding Income Source...' : 'Add Income Source';
    };

    return (
        <Formik
            validationSchema={Yup.object({
                income_or_asset_type: Yup.number().required('Required'),
                estimated_amount: Yup.string().required('Required'),
                other: Yup.string().when('income_or_asset_type', {
                    is: (value) => [INCOME_TYPE_OTHER, ASSET_TYPE_OTHER].includes(value),
                    then: Yup.string().nullable().required('Required'),
                    otherwise: Yup.string().nullable().notRequired(),
                }),
            })}
            onSubmit={props.onSubmit}
            initialValues={getInitialValues()}
        >
            {({ values, handleChange, handleSubmit, errors, submitCount, isSubmitting, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <div className="align-left">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="income-or-asset-type">
                                {capitalize(financialTypeLabel)} type
                            </InputLabel>
                            <Select
                                disabled={props.isEditing}
                                error={!!errors.income_or_asset_type}
                                value={values.income_or_asset_type}
                                fullWidth
                                onChange={(e) => onChangeSelect(e, handleChange, setFieldValue)}
                                inputProps={{
                                    name: 'income_or_asset_type',
                                    id: 'income-or-asset-type',
                                }}
                            >
                                {selectChoices.map((choice) => (
                                    <MenuItem key={choice.income_or_asset_type} value={choice.income_or_asset_type}>
                                        {find({ value: choice.income_or_asset_type })(ALL_INCOME_OR_ASSET_TYPES).label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {[INCOME_TYPE_OTHER, ASSET_TYPE_OTHER].includes(values.income_or_asset_type) && (
                            <>
                                <Spacer height={24} />
                                <FormTextInput
                                    label="Description"
                                    name="other"
                                    inputProps={{ maxLength: 255 }}
                                    value={values.other}
                                    handleChange={handleChange}
                                    error={errors.other}
                                    submitted={submitCount > 0}
                                />
                            </>
                        )}
                        <Spacer height={24} />
                        {values.income_or_asset_type && (
                            <>
                                <CurrencyTextField
                                    error={submitCount > 0 && !!errors.estimated_amount}
                                    helperText={submitCount > 0 && errors.estimated_amount}
                                    fullWidth
                                    textAlign="left"
                                    label={isAsset ? 'Estimated asset balance' : 'Estimated annual income'}
                                    minimumValue="0"
                                    name="estimated_amount"
                                    currencySymbol="$"
                                    onChange={(event, value) => setFieldValue('estimated_amount', value)}
                                    outputFormat="string"
                                    value={values.estimated_amount}
                                    inputProps={{ autoComplete: 'off' }}
                                />
                                <UploadDocuments
                                    removeFile={(docId, fileId) => {
                                        values.uploadedDocuments[docId].files = values.uploadedDocuments[
                                            docId
                                        ].files.filter((f) => f.id !== fileId);
                                        if (values.uploadedDocuments[docId].files.length === 0) {
                                            delete values.uploadedDocuments[docId];
                                        }
                                        setFieldValue('uploadedDocuments', values.uploadedDocuments);
                                    }}
                                    removeAll={(docId) => {
                                        const uploadedDocuments = omit(values.uploadedDocuments, [docId]);
                                        setFieldValue('uploadedDocuments', uploadedDocuments);
                                    }}
                                    incomeOrAssetType={values.income_or_asset_type}
                                    streamType={props.financialType}
                                    uploadedDocuments={values.uploadedDocuments}
                                    loadDocument={(e) => setFieldValue('uploadedDocuments', e)}
                                    setError={(err) => props.setError(err)}
                                />
                            </>
                        )}
                    </div>
                    <ActionButton
                        disabled={
                            (!props.isEditing && !allValuesSet(values, { exclude: ['other'] })) ||
                            isSubmitting ||
                            !uploadedAllDocuments(values.uploadedDocuments, values.income_or_asset_type)
                        }
                        marginTop={68}
                        marginBottom={20}
                    >
                        {getSubmitButtonText(isSubmitting)}
                    </ActionButton>
                </form>
            )}
        </Formik>
    );
}

AddFinancialSourceForm.propTypes = {
    initialValues: PropTypes.object,
    config: PropTypes.object,
    onSubmit: PropTypes.func,
    setError: PropTypes.func,
    financialType: PropTypes.number,
    isEditing: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
    financial_documents_validations: state.configuration.financial_documents_validations,
});

export default connect(mapStateToProps)(AddFinancialSourceForm);
