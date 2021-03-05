import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import { nameValidationRegex, phoneNumberValidationRegex } from 'utils/formik';
import FormTextInput from 'components/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/PhoneNumberInput/PhoneNumberInput';
import ActionButton from 'components/ActionButton/ActionButton';
import GenericFormMessage from 'components/GenericFormMessage/GenericFormMessage';
import { LinkButton, Spacer } from 'assets/styles';

const linkContainer = css`
    text-align: left !important;
`;

const MIN_DATE = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d;
})();

export const coApplicantsGuarantorsValidationSchema = Yup.object().shape(
    {
        first_name: Yup.string()
            .required('First Name is required')
            .matches(nameValidationRegex, 'Invalid first name')
            .max(15, 'Exceeds 15 characters'),
        last_name: Yup.string()
            .required('Last Name is required')
            .matches(nameValidationRegex, 'Invalid last name')
            .max(25, 'Exceeds 25 characters'),
        phone_number: Yup.string()
            .nullable()
            .when('email', {
                is: (val) => !val,
                then: Yup.string()
                    .required('Phone Number is required')
                    .matches(phoneNumberValidationRegex, 'Must be a valid US phone number'),
                otherwise: Yup.string(),
            }),
        email: Yup.string()
            .nullable()
            .when('phone_number', {
                is: (val) => !val,
                then: Yup.string().required('Email is required').email('Email must be a valid email'),
                otherwise: Yup.string(),
            }),
    },
    ['phone_number', 'email']
);

export const dependentValidationSchema = Yup.object().shape({
    first_name: Yup.string()
        .required('First Name is required')
        .matches(nameValidationRegex, 'Invalid first name')
        .max(15, 'Exceeds 15 characters'),
    last_name: Yup.string()
        .required('Last Name is required')
        .matches(nameValidationRegex, 'Invalid last name')
        .max(25, 'Exceeds 25 characters'),
    birthday: Yup.date()
        .typeError('Enter a valid date')
        .min(MIN_DATE, 'Looks like this person is over 18.')
        .required('required'),
});

export const InviteForm = ({
    handleOnSubmit,
    onSubmitDependent,
    displayedErrors,
    initialValues = {},
    initialIsDependent = false,
    disableTypeChange = false,
    buttonText = 'Add Person',
    isGuarantor = false,
}) => {
    const [isDependent, setIsDependent] = useState(initialIsDependent);
    // the only case where this should be set to false is when when we resend and the initial invite was sent with email
    const [sendToPhone, toggleSendToPhone] = useState(!initialValues.email);

    const handleToggleClick = (setFieldValue) => {
        toggleSendToPhone(!sendToPhone);
        if (!sendToPhone) {
            setFieldValue('email', null);
        } else {
            setFieldValue('phone_number', '');
        }
    };

    return (
        <>
            <Spacer height={35} />
            {!isGuarantor && (
                <>
                    <FormHelperText id="service-animal">Is this person 18 or older?</FormHelperText>
                    <RadioGroup
                        aria-label="is 18 or older"
                        name={'is_dependent'}
                        value={isDependent}
                        row={true}
                        default={true}
                        onChange={(val) => setIsDependent(val.target.value === 'true')}
                    >
                        <FormControlLabel value={false} control={<Radio />} label="Yes" disabled={disableTypeChange} />{' '}
                        {/* Note that Yes == false */}
                        <FormControlLabel value={true} control={<Radio />} label="No" disabled={disableTypeChange} />
                    </RadioGroup>
                </>
            )}
            {isDependent === null && (
                <ActionButton disabled={true} marginTop={170} marginBottom={20}>
                    Add Person
                </ActionButton>
            )}
            {isDependent === true && (
                <Formik
                    validationSchema={dependentValidationSchema}
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
                        setFieldValue,
                        dirty,
                    }) => {
                        return (
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <Spacer height={30} />
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
                                    minDate={MIN_DATE}
                                    helperText={submitCount > 0 && errors.birthday}
                                    value={values.birthday || null}
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={(e) => setFieldValue('birthday', e)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                                <ActionButton
                                    type="submit"
                                    disabled={
                                        isSubmitting ||
                                        !values.first_name ||
                                        !values.last_name ||
                                        !values.birthday ||
                                        !dirty
                                    }
                                    marginTop={50}
                                    marginBottom={20}
                                >
                                    {buttonText}
                                </ActionButton>
                            </form>
                        );
                    }}
                </Formik>
            )}
            {isDependent === false && (
                <Formik
                    validationSchema={coApplicantsGuarantorsValidationSchema}
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
                        setFieldValue,
                    }) => {
                        const formFilled = sendToPhone
                            ? !values.last_name ||
                              !values.first_name ||
                              !values.phone_number ||
                              values.phone_number === '(___) ___-____'
                            : !values.last_name || !values.first_name || !values.email;
                        return (
                            <form onSubmit={handleSubmit} autoComplete="off">
                                {displayedErrors && <GenericFormMessage type="error" messages={displayedErrors} />}
                                {!isGuarantor && (
                                    <>
                                        <div className="color-manatee align-left">
                                            We&apos;ll send them an invite to apply.
                                        </div>
                                        <Spacer height={30} />
                                    </>
                                )}
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
                                {sendToPhone ? (
                                    <PhoneNumberInput
                                        label="Phone Number"
                                        name="phone_number"
                                        value={values.phone_number}
                                        handleChange={handleChange}
                                        error={submitCount > 0 && !!errors.phone_number}
                                        helperText={submitCount > 0 ? errors.phone_number : null}
                                    />
                                ) : (
                                    <FormTextInput
                                        label="Email"
                                        name="email"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.email}
                                        value={values.email}
                                    />
                                )}
                                <div className={linkContainer}>
                                    <LinkButton type="reset" onClick={() => handleToggleClick(setFieldValue)}>
                                        {!!sendToPhone ? 'Use email instead' : 'Use phone instead'}
                                    </LinkButton>
                                </div>
                                <ActionButton disabled={formFilled || isSubmitting} marginTop={50} marginBottom={20}>
                                    Send Invite
                                </ActionButton>
                            </form>
                        );
                    }}
                </Formik>
            )}
        </>
    );
};

InviteForm.propTypes = {
    handleOnSubmit: PropTypes.func,
    onSubmitDependent: PropTypes.func,
    displayedErrors: PropTypes.array,
    initialValues: PropTypes.object,
    initialIsDependent: PropTypes.bool,
    disableTypeChange: PropTypes.bool,
    buttonText: PropTypes.string,
    isGuarantor: PropTypes.bool,
};

export default InviteForm;
