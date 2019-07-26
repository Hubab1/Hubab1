
import React, { useState } from 'react';
import { css } from 'emotion';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { formContent, LinkButton } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import ActionButton from 'components/common/ActionButton/ActionButton';

import GenericFormError from 'components/common/GenericFormError';

const linkContainer = css`
    text-align: left !important
`


export const InviteForm = ({handleOnSubmit, displayedErrors, initialValues}) => {

    const [sendToPhone, toggleSendToPhone] = useState(true);

    const validationSchema = sendToPhone ? 
        Yup.object().shape({
            first_name: Yup.string().required('First Name is required'),
            last_name: Yup.string().required('Last Name is required'),
            phone_number: Yup.string()
                .required('Phone Number is required')
                .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),
        }) :
        Yup.object().shape({
            first_name: Yup.string().required('First Name is required'),
            last_name: Yup.string().required('Last Name is required'),
            email: Yup.string()
                .required('Email is required')
                .email()
        })


    return <Formik
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
            isSubmitting
        }) => (
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className={formContent}>
                    { displayedErrors && <GenericFormError errors={displayedErrors}/> }
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
                        <LinkButton onClick={() => toggleSendToPhone(!sendToPhone)}>
                            { !!sendToPhone ? 'Use email instead' : 'Use phone instead' }
                        </LinkButton>
                    </div>
                    <ActionButton disabled={!values.last_name || !values.first_name || !values.phone_number || values.phone_number === '(___) ___-____' || !values.email || isSubmitting} marginTop={31} marginBottom={10}>Send Invite</ActionButton>
                </div>
            </form>
        )}
    </Formik>

}