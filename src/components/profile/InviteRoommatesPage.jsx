import React, { Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import get from 'lodash/get';


import { H1, H3, formContent } from 'assets/styles';
import roommatesImage from 'assets/images/roommates.png';
import inviteConfirm from 'assets/images/invite-confirm.png';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import BackLink from 'components/common/BackLink';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import GenericFormError from 'components/common/GenericFormError';
import { ROUTES } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import withRelativeRoutes from 'app/withRelativeRoutes';
import API from '../../app/api';


const SpacedH3 = styled(H3)`
    margin: 20px 15% 20px 15%;s
`

export class InviteRoommatesPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const existingRoommateId = get(this.props.history, 'state.initialValues.id');

        if (existingRoommateId) { 
            API.updateApplicant(values).then(res => this.setState({confirmSent: true}));
        } else {
            this.props.updateRenterProfile({co_applicants: [values]}).then((res) => {
                if (res.errors) {
                    const coApplicantsErrorsObj = get(res, 'errors.co_applicants');
                    const coApplicantErrors = coApplicantsErrorsObj && Object.values(coApplicantsErrorsObj)[0]
                    coApplicantErrors ? setErrors(coApplicantErrors) : this.setState({errors: ['There was an error sending your roommate an invite. Please Try again.']})
                } else {
                    this.setState({confirmSent: true})
                }
                setSubmitting(false);
            }).catch((res) => {
                this.setState({errors: [res.errors]});
                setSubmitting(false);
            });
        }
    }

    render () {
        const initialValues = this.props.history.location.state && this.props.history.location.state.initialValues;
        const confirmationPagePrimarybuttonClick = initialValues ? this.props.history.push(ROUTES.APP_STATUS) : this.props._nextRoute;
        const confirmationPageSecondarybuttonClick = initialValues ? null : () => this.setState({confirmSent: false});
        if (this.state.confirmSent) {
            return <ConfirmationPage 
                successMessage="Invite Sent!"
                secondarySuccessMessage="You’ll be able to check in on your roommate’s progress once you complete your application."
                buttonClick={confirmationPagePrimarybuttonClick}
                buttonText="Continue"
                secondaryButtonClick={confirmationPageSecondarybuttonClick}
                secondaryButtonText={!initialValues && "Add Another Roommate"}
                confirmationImage={inviteConfirm}
            />
        } 
        return (
            <Fragment>
                <H1>Invite Your Roommates</H1>
                <SpacedH3>Tell us the basics and we’ll send them an invite to tell us the rest.</SpacedH3>
                <img src={roommatesImage} alt="hand with smartphone in it"/>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required('First Name is required'),
                        last_name: Yup.string().required('Last Name is required'),
                        phone_number: Yup.string()
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
                            <BackLink to={this.props._prev}/>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
})

export default connect(mapStateToProps, {updateRenterProfile})(withRelativeRoutes(InviteRoommatesPage, ROUTES.CO_APPLICANTS));
