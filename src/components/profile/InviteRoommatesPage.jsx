import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { H1, P, formContent, ErrorDetail } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import ConfirmationPage from 'components/common/ConfirmationPage';
import { ROUTES } from 'app/constants';
import API from 'app/api';

export class InviteRoommatesPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        API.inviteRoommate(values).then((res) => {
            setSubmitting(false);
            this.setState({confirmSent: true})
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        if (this.state.confirmReset) {
            return <ConfirmationPage 
                successMessage="Invite Sent!"
                secondarySuccessMessage="You’ll be able to check in on your roommate’s progress once you complete your application."
                buttonClick={() => this.props.history.push(ROUTES.LOGIN)}
                buttonText="Continue"
                secondaryButtonClick={() => console.log('clickers magoo')}
                secondaryButtonText="Add Another Rooommate"
            />
        } 
        return (
            <Fragment>
                <H1>Let's Invite Your Rooommates</H1>
                <P>Tell us the basics and we’ll send them an invite to tell us the rest.</P>
                <Formik
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required('First Name is required'),
                        last_name: Yup.string().required('Last Name is required'),
                        phone_1: Yup.string().required('Phone Number is required'),
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
                                <FormTextInput
                                    label="Phone Number"
                                    name="phone_1"
                                    submitted={submitCount > 0}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.phone_1}
                                    value={values.phone_1}
                                />
                                <div>
                                    {!!this.state.errors && <ErrorDetail>{this.state.errors.error}</ErrorDetail>}
                                </div>
                                <ActionButton disabled={isSubmitting} marginTop="76px">Send Invite</ActionButton>
                            </div>
                            <Link to={ROUTES.PROFILE_OPTIONS}>Go Back</Link>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

InviteRoommatesPage.propTypes = {
    profile: PropTypes.object,
    fetchRenterProfile: PropTypes.func
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    communityId: state.siteConfig.basename
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(InviteRoommatesPage);
