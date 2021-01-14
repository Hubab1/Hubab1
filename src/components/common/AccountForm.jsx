import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { css } from 'emotion';

import { ROUTES } from 'app/constants';
import { allValuesSet, nameValidationRegex, phoneNumberValidationRegex } from 'utils/formik';
import { formContent, LinkButton } from 'assets/styles';
import Checkbox from 'components/common/Checkbox';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import GenericFormMessage from 'components/common/GenericFormMessage';
import ActionButton from 'components/common/ActionButton/ActionButton';

const linkContainer = css`
    text-align: left !important;
    margin-bottom: 50px;
    margin-top: 10px;
`;

const MAX_DATE = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d;
})();

const MIN_BIRTHDAY_YEAR = 1901;

export const validationSchema = (withPassword) =>
    Yup.object().shape({
        first_name: Yup.string()
            .max(15, 'Exceeds 15 characters')
            .required('First Name is required')
            .matches(nameValidationRegex, 'Invalid name'),
        last_name: Yup.string()
            .max(25, 'Exceeds 25 characters')
            .required('Last Name is required')
            .matches(nameValidationRegex, 'Invalid name'),
        phone_number: Yup.string()
            .required('Phone Number is required')
            .matches(phoneNumberValidationRegex, 'Must be a valid US phone number'),
        email: Yup.string().email().required('Email is required'),
        birthday: Yup.date()
            .typeError('Enter a valid date')
            .max(MAX_DATE, 'Must be 18 or older')
            .test('test-birthday-min-date', 'Invalid birthdate', (value) => {
                const date = moment(value, 'MM/dd/yyyy');
                return date.year() >= MIN_BIRTHDAY_YEAR;
            })
            .required('required'),
        ...(withPassword && {
            password: Yup.string()
                .required('Password must be at least 8 characters')
                .min(8, 'Password must be at least 8 characters'),
        }),
    });

export function AccountForm({
    initialValues,
    status,
    withPassword,
    showConsentInput,
    submitText,
    onSubmit,
    resetPassword,
    configuration,
    canUpdatePersonalInfo = true,
}) {
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema(withPassword)} onSubmit={onSubmit}>
            {({
                values,
                errors,
                handleChange,
                submitCount,
                handleBlur,
                handleSubmit,
                isSubmitting,
                touched,
                dirty,
                setFieldValue,
            }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className={formContent}>
                        {status && <GenericFormMessage type={status.type} messages={status.detail} />}
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormTextInput
                                    label="First Name"
                                    name="first_name"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.first_name}
                                    value={values.first_name}
                                    disabled={!canUpdatePersonalInfo}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextInput
                                    label="Last Name"
                                    name="last_name"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.last_name}
                                    value={values.last_name}
                                    disabled={!canUpdatePersonalInfo}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextInput
                                    label="Email"
                                    name="email"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.email}
                                    value={values.email}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <PhoneNumberInput
                                    label="Phone Number"
                                    name="phone_number"
                                    value={values.phone_number}
                                    handleChange={handleChange}
                                    error={submitCount > 0 && !!errors.phone_number}
                                    helperText={submitCount > 0 ? errors.phone_number : null}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <KeyboardDatePicker
                                    id="birthday-picker"
                                    clearable
                                    disableFuture
                                    format="MM/dd/yyyy"
                                    placeholder="mm/dd/yyyy"
                                    label="Birthday"
                                    minDate={new Date(1901, 1, 1)}
                                    maxDate={MAX_DATE}
                                    error={submitCount > 0 && !!errors.birthday}
                                    helperText={submitCount === 0 ? 'Must be 18 or older' : errors.birthday} // preemptive helper text
                                    value={values.birthday || null}
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={(e) => setFieldValue('birthday', e)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    disabled={!canUpdatePersonalInfo}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {withPassword && (
                                    <FormTextInput
                                        label="Password"
                                        name="password"
                                        type="password"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.password}
                                        value={values.password}
                                        showValidationText
                                        touched={touched && touched.password}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        {showConsentInput && (
                            <Checkbox
                                name="sms_opt_in"
                                onChange={handleChange}
                                checked={values.sms_opt_in}
                                value={values.sms_opt_in}
                                error={errors.sms_opt_in}
                                label={
                                    <>
                                        By clicking this checkbox, you consent to receiving calls and texts on behalf of{' '}
                                        {configuration.community.company.name} via automatic dialing or other technology
                                        about apartment listings that may fit your needs. Your consent is not required
                                        to enter into a rental transaction or make any purchase. Reply STOP to cancel
                                        anytime.{' '}
                                        <Link target="_blank" to={ROUTES.PRIVACY_POLICY}>
                                            Privacy Policy
                                        </Link>
                                    </>
                                }
                            />
                        )}
                        {resetPassword && (
                            <div className={linkContainer}>
                                <LinkButton onClick={resetPassword}>Change Password</LinkButton>
                            </div>
                        )}
                        <ActionButton
                            disabled={!dirty || !allValuesSet(values, { exclude: ['sms_opt_in'] }) || isSubmitting}
                            marginTop={20}
                            marginBottom={20}
                        >
                            {submitText}
                        </ActionButton>
                    </div>
                </form>
            )}
        </Formik>
    );
}

AccountForm.propTypes = {
    initialValues: PropTypes.object.isRequired,
    submitText: PropTypes.string.isRequired,
    status: PropTypes.string,
    withPassword: PropTypes.bool,
    showConsentInput: PropTypes.bool,
    resetPassword: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    configuration: PropTypes.object.isRequired,
    maxDate: PropTypes.object,
    canUpdatePersonalInfo: PropTypes.bool,
};

export default AccountForm;
