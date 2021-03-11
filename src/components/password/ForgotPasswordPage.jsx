import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';

import API from 'app/api';
import { ROUTES } from 'app/constants';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import PhoneNumberInput from 'components/common/PhoneNumberInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import BackLink from 'components/common/BackLink';
import GenericFormMessage from 'components/common/GenericFormMessage';
import forgotPassword from 'assets/images/forgot-password.png';
import { formContent, H1, H3 } from 'assets/styles';

const SpacedH3 = styled(H3)`
    margin: 20px 15% 25px 15%;
`;

const validationSchema = Yup.object().shape({
    phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number'),
});

const initialValues = {
    phone: '',
};

export class ForgotPasswordPage extends Component {
    state = { errors: null };

    onSubmit = (values, { setSubmitting }) => {
        const { communityId } = this.props;

        this.props.toggleLoader(true);

        API.passwordResetRequest(values.phone, communityId)
            .then((res) => {
                if (res.errors) {
                    this.setState({ errors: ['Applicant does not exist'] });
                } else {
                    this.props.history.push({
                        pathname: ROUTES.VERIFY_PASSWORD_CODE,
                        state: { phoneNumber: values.phone },
                    });
                }
            })
            .catch(() => {
                this.setState({ errors: ['Applicant does not exist'] });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    render() {
        return (
            <>
                <H1>Forgot Your Password?</H1>
                <SpacedH3>Don’t worry! We’ll send you a text message with a code to reset your password.</SpacedH3>
                <img src={forgotPassword} alt="hand with smartphone in it" />
                <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={this.onSubmit}>
                    {({ values, errors, handleChange, submitCount, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className={formContent}>
                                {!!this.state.errors && (
                                    <GenericFormMessage type="error" messages={this.state.errors} />
                                )}
                                <PhoneNumberInput
                                    label="Phone Number"
                                    name="phone"
                                    value={values.phone}
                                    handleChange={handleChange}
                                    error={submitCount > 0 && !!errors.phone}
                                    helperText={submitCount > 0 ? errors.phone : null}
                                />
                                <ActionButton disabled={isSubmitting} marginTop={31} marginBottom={20}>
                                    Send Text
                                </ActionButton>
                                <BackLink to={ROUTES.LOGIN} />
                            </div>
                        </form>
                    )}
                </Formik>
            </>
        );
    }
}

ForgotPasswordPage.propTypes = {
    profile: PropTypes.object,
    communityId: PropTypes.string,
    history: PropTypes.object,
    fetchRenterProfile: PropTypes.func,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    communityId: state.siteConfig.basename,
});

const mapDispatchToProps = {
    fetchRenterProfile,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage);
