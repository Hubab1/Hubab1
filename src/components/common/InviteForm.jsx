
import React, { useState } from 'react';
import { css } from 'emotion';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardDatePicker } from '@material-ui/pickers';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import { formContent, LinkButton } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import FormHelperText from '@material-ui/core/FormHelperText';

import GenericFormMessage from 'components/common/GenericFormMessage';

const linkContainer = css`
    text-align: left !important
`


export const InviteForm = ({handleOnSubmit, onSubmitDependent, displayedErrors, initialValues={}}) => {
    const [isAdult, setIsAdult] = useState(null);
    // the only case where this should be set to false is when when we resend and the initial invite was sent with email
    const [sendToPhone, toggleSendToPhone] = useState(!initialValues.email);

    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required('First Name is required'),
        last_name: Yup.string().required('Last Name is required'),
        phone_number: Yup.string().nullable().when('email', {
            is: (val) => !val,
            then: Yup.string()
                .required('Phone Number is required')
                .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),
            otherwise: Yup.string()
        }),
        email: Yup.string().nullable().when('phone_number', {
            is: (val) => !val,
            then: Yup.string()
                .required('Email is required')
                .email('Email must be a valid email'),
            otherwise: Yup.string()
        })
    }, ['phone_number', 'email'])

    const handleToggleClick = (setFieldValue) => {
        toggleSendToPhone(!sendToPhone)

        if (!sendToPhone) {
            setFieldValue('email', null)
        } else {
            setFieldValue('phone_number', '');
        }
    }

    return (
        <>
            <FormHelperText id="service-animal">Is this person 18 or older?</FormHelperText>
                <RadioGroup
                    aria-label="is 18 or older"
                    name={'is_dependent'}
                    value={isAdult}
                    row={true}
                    default={true}
                    onChange={(val) =>
                        setIsAdult(val.target.value === 'true')
                    }
                >
                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio />} label="No"  />
                </RadioGroup>
            {isAdult === false &&
            <Formik
                validationSchema={Yup.object().shape({
                    first_name: Yup.string().required('First Name is required'),
                    last_name: Yup.string().required('Last Name is required'),
                })}
                initialValues={initialValues}
                onSubmit={onSubmitDependent}
            >
                {({
                    values,
                    errors,
                    handleChange,
                    submitCount,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                }) => {
                    return <form onSubmit={handleSubmit} autoComplete="off">
                        <FormTextInput
                            label="First Name"
                            name="first_name"
                            submitted={submitCount > 0}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            error={errors.first_name}
                            value={values.first_name}
                        />
                        <FormTextInput
                            label="Last Name"
                            name="last_name"
                            submitted={submitCount > 0}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            error={errors.last_name}
                            value={values.last_name}
                        />
                        <KeyboardDatePicker
                            id="birthday-picker"
                            clearable
                            disableFuture
                            format="MM/dd/yyyy"
                            placeholder="mm/dd/yyyy"
                            label="Birthday"
                            error={submitCount > 0 && !!errors.birthday}
                            value={values.birthday || null}
                            fullWidth
                            onBlur={handleBlur}
                            onChange={e => setFieldValue('birthday', e)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <ActionButton type="submit" disabled={ isSubmitting } marginTop={31} marginBottom={10}>Add Person</ActionButton>
                    </form>
                }}
            </Formik>
            }
            {
            isAdult === true &&
            <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={handleOnSubmit}
            >
                {({
                    values,
                    errors,
                    handleChange,
                    submitCount,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                }) => {
                    const formFilled = sendToPhone ?
                        !values.last_name || !values.first_name || !values.phone_number || values.phone_number === '(___) ___-____' :
                        !values.last_name || !values.first_name || !values.email
                    return (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className={formContent}>
                                { displayedErrors && <GenericFormMessage type="error" messages={displayedErrors}/> }
                                <FormTextInput
                                    label="First Name"
                                    name="first_name"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.first_name}
                                    value={values.first_name}
                                />
                                <FormTextInput
                                    label="Last Name"
                                    name="last_name"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.last_name}
                                    value={values.last_name}
                                />
                                { sendToPhone ?
                                    <PhoneNumberInput
                                        label="Phone Number"
                                        name="phone_number"
                                        value={values.phone_number}
                                        handleChange={handleChange}
                                        error={submitCount > 0 && !!errors.phone_number}
                                        helperText={submitCount > 0 ? errors.phone_number : null}
                                    /> :
                                    <FormTextInput
                                        label="Email"
                                        name="email"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.email}
                                        value={values.email}
                                    />
                                }
                                <div className={linkContainer}>
                                    <LinkButton type="reset" onClick={() => handleToggleClick(setFieldValue)}>
                                        { !!sendToPhone ? 'Use email instead' : 'Use phone instead' }
                                    </LinkButton>
                                </div>
                                <ActionButton disabled={ formFilled || isSubmitting} marginTop={31} marginBottom={10}>Add Person</ActionButton>
                            </div>
                        </form>
                    )
                }}
            </Formik>
            }
        </>
    );

}
