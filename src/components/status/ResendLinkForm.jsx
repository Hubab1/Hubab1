import React, { Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import coin from 'assets/images/coin.png';
import { H1, formContent, SpacedH3 } from 'assets/styles';

import styled from '@emotion/styled';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import BackLink from 'components/common/BackLink';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import GenericFormError from 'components/common/GenericFormError';
import { ROUTES } from 'app/constants';
import API from 'app/api';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 90px;
        max-width: 90px;
    }
`

export class ResendLinkForm extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        API.updateAppliant(values).then((res) => {
            setSubmitting(false);
            this.setState({confirmSent: true})
        }).catch((res) => {
            this.setState({errors: [res.errors]});
            setSubmitting(false);
        });
    }

    render () {
        if (this.state.confirmSent) {
            return <ConfirmationPage
                successMessage="Invite Sent!"
                secondarySuccessMessage="OH YEAH!!!!"
                buttonClick={() => this.props.handleConfirmationClick(null)}
                buttonText="Continue"
            />
        }
        return (
            <Fragment>
                <H1>Let’s Try This Again</H1>
                <SpacedH3>Double check all the information below and let’s resend the invite</SpacedH3>
                <ImageContainer>
                    <img src={coin} alt="coin"/>
                </ImageContainer>
                <Formik
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required('First Name is required'),
                        last_name: Yup.string().required('Last Name is required'),
                        phone_number: Yup.string()
                            .required('Phone Number is required')
                            .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),

                    })}
                    initialValues={this.props.initialValues}
                    onSubmit={this.onSubmit}
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
                                { this.state.errors && <GenericFormError errors={this.state.errors}/> }
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
                                <PhoneNumberInput 
                                    label="Phone Number"
                                    name="phone_number"
                                    value={values.phone_number}
                                    handleChange={handleChange}
                                    error={submitCount > 0 && !!errors.phone_number}
                                    helperText={submitCount > 0 ? errors.phone_number : null}
                                />
                                <ActionButton disabled={!values.last_name || !values.first_name || !values.phone_number || values.phone_number === '(___) ___-____' || isSubmitting} marginTop={31} marginBottom={10}>Send Invite</ActionButton>
                            </div>
                            <BackLink to={ROUTES.APP_STATUS}/>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

export default ResendLinkForm;