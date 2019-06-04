import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';

import PhoneNumberInput from 'components/common/PhoneNumberInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import BackLink from 'components/common/BackLink';
import GenericFormError from 'components/common/GenericFormError';
import forgotPassword from 'assets/images/forgot-password.png';
import { formContent, H1, H3 } from 'assets/styles';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';
import API from 'app/api';

const SpacedH3 = styled(H3)`
    margin: 20px 15% 25px 15%;
`

export class ForgotPasswordPage extends React.Component {
    state = {errors: null}

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const { communityId } = this.props;
        
        API.passwordResetRequest(values.phone, communityId).then( (res) => {
            if (res.errors) {
                this.setState({errors: ["Applicant does not exist"]})
            } else {
                this.props.history.push({
                    pathname: ROUTES.VERIFY_PASSWORD_CODE, 
                    state: {phoneNumber: values.phone}
                });
            }
            setSubmitting(false);
        }).catch( () => {
            this.setState({errors: ["Applicant does not exist"]})
            setSubmitting(false);
        })
    }

    render () {
        return (
            <Fragment>
                <H1>
                    Forgot your password?
                </H1>
                <SpacedH3>
                    Don’t worry! We’ll send you a text message with a code to reset your password.
                </SpacedH3>
                <img src={forgotPassword} alt="hand with smartphone in it"/>
                {!!this.state.errors && <GenericFormError errors={this.state.errors}/>}
                <Formik
                    validationSchema={Yup.object().shape({
                        phone: Yup.string()
                            .required('Phone Number is required')
                            .matches(/^\(\d{3}\)\s\d{3}-\d{4}/, 'Must be a valid US phone number')
                    })}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        submitCount,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className={formContent}>
                                <PhoneNumberInput 
                                    label="Phone Number"
                                    name="phone"
                                    value={values.phone}
                                    handleChange={handleChange}
                                    error={submitCount > 0 && !!errors.phone}
                                    helperText={submitCount > 0 ? errors.phone : null}
                                />
                                <ActionButton disabled={isSubmitting} marginTop="31px" marginBottom="20px">
                                    Send Text
                                </ActionButton>
                                <BackLink to={ROUTES.LOGIN}/>
                            </div>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

ForgotPasswordPage.propTypes = {
    fetchRenterProfile: PropTypes.func,
    profile: PropTypes.object
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    communityId: state.siteConfig.basename
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage);
