import React from 'react';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { css } from 'emotion';
import Checkbox from 'components/common/Checkbox';

import { formContent, LinkButton } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import GenericFormMessage from 'components/common/GenericFormMessage';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { allValuesSet } from 'utils/formik';
import { ROUTES } from 'app/constants';

const linkContainer = css`
    text-align: left !important;
    margin-bottom: 50px;
    margin-top: 10px;
`;

// TODO: Avoid anon func
/* eslint-disable react/prop-types */
export default ({ initialValues, onSubmit, status, withPassword, submitText, resetPassword, showConsentInput }) => {
    const MAX_DATE = (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d;
    })();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
                first_name: Yup.string().required('First Name is required'),
                last_name: Yup.string().required('Last Name is required'),
                phone_number: Yup.string()
                    .required('Phone Number is required')
                    .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),
                email: Yup.string().email().required('Email is required'),
                birthday: Yup.date()
                    .typeError('Enter a valid date')
                    .max(MAX_DATE, 'Must be 18 or older')
                    .required('required'),
                ...(withPassword && {
                    password: Yup.string()
                        .required('Password must be at least 8 characters')
                        .min(8, 'Password must be at least 8 characters'),
                }),
            })}
            onSubmit={onSubmit}
        >
            {({
                values,
                errors,
                handleChange,
                submitCount,
                handleBlur,
                handleSubmit,
                isSubmitting,
                touched,
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
                                    maxDate={MAX_DATE}
                                    error={submitCount > 0 && !!errors.birthday}
                                    helperText={
                                        submitCount === 0
                                            ? 'Must be 18 or older'
                                            : errors.birthday ?? 'Must be 18 or older'
                                    } // preemptive helper text
                                    value={values.birthday || null}
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={(e) => setFieldValue('birthday', e)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
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
                                        Opt in to SMS communication regarding this application. Your information will
                                        not be shared with anyone.{' '}
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
                            disabled={!allValuesSet(values, { exclude: ['sms_opt_in'] }) || isSubmitting}
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
};
