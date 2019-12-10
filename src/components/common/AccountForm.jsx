import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { css } from 'emotion';

import { formContent, LinkButton } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import GenericFormMessage from 'components/common/GenericFormMessage';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { allValuesSet } from 'utils/formik';

const linkContainer = css`
    text-align: left !important;
    margin-bottom: 50px;
    margin-top: 10px;
`

export default ({
    initialValues,
    onSubmit,
    status,
    withPassword,
    submitText,
    resetPassword,
}) => (
        <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
            first_name: Yup.string().required('First Name is required'),
            last_name: Yup.string().required('Last Name is required'),
            phone_number: Yup.string()
                .required('Phone Number is required')
                .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),
            email: Yup.string()
                .email()
                .required('Email is required'),
            birthday: Yup.string()	
                .required('required'),
            ...(withPassword && {password: Yup.string()
                .required('Password must be at least 8 characters')
                .min(8, 'Password must be at least 8 characters')})
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
                    { status && <GenericFormMessage type={status.type} messages={status.detail}/> }
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
                                value={values.birthday || null}	
                                fullWidth	
                                onBlur={handleBlur}	
                                onChange={e => setFieldValue('birthday', e)}	
                                KeyboardButtonProps={{	
                                    'aria-label': 'change date',	
                                }}	
                            />	
                        </Grid>
                        <Grid item xs={12}>
                            {
                                withPassword &&
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
                            }
                        </Grid>
                    </Grid>
                    { resetPassword &&
                        <div className={linkContainer}>
                            <LinkButton  onClick={resetPassword}>
                                Change Password
                            </LinkButton>
                        </div>
                    }
                    <ActionButton disabled={!allValuesSet(values) || isSubmitting} marginTop={20} marginBottom={20}>{submitText}</ActionButton>
                </div>
            </form>
        )}
    </Formik>
)