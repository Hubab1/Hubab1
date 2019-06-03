import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { H1, Subtitle, formContent, ErrorDetail } from 'assets/styles';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import BackButton from 'components/common/BackButton';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import { ROUTES } from 'app/constants';
import { selectors, updateRenterProfile } from 'reducers/renter-profile';
import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';

export class GuarantorPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        API.inviteGuarantor(values).then((res) => {
            setSubmitting(false);
            this.setState({confirmSent: true})
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        if (this.state.confirmSent) {
            return <ConfirmationPage
                successMessage="Invite Sent!"
                secondarySuccessMessage="You’ll be able to check in on your guarantor's progress once you complete your application."
                buttonClick={this.props._nextRoute}
                buttonText="Continue"
            />
        }
        return (
            <Fragment>
                <H1>Let's Invite a Guarantor</H1>
                <br/>
                <Subtitle>Plain and simple, a lease guarantor is someone who guarantees payment on the lease if it couldn’t be paid for some reason.</Subtitle>
                <Formik
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required('First Name is required'),
                        last_name: Yup.string().required('Last Name is required'),
                        phone: Yup.string()
                            .required('Phone Number is required')
                            .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),

                    })}
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
                                    name="phone"
                                    value={values.phone}
                                    handleChange={handleChange}
                                    error={submitCount > 0 && !!errors.phone}
                                    helperText={submitCount > 0 ? errors.phone : null}
                                />
                                <div>
                                    {!!this.state.errors && <ErrorDetail>{this.state.errors.error}</ErrorDetail>}
                                </div>
                                <ActionButton disabled={!values.last_name || !values.first_name || !values.phone || values.phone === '(___) ___-____' || isSubmitting} marginTop="31px" marginBottom="10px">Send Invite</ActionButton>
                            </div>
                            <BackButton onClick={() => this.props.history.push(this.props._prev)}/>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

export default connect((state) => ({routes: selectors.selectOrderedRoutes(state)}), {updateRenterProfile})(withRelativeRoutes(GuarantorPage, ROUTES.GUARANTOR));