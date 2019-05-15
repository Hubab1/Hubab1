import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import TextField from '@material-ui/core/TextField';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { formContent, H1, H3, P } from 'assets/styles';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';

export class ForgotPasswordPage extends React.Component {
    onSubmit = (values, { setSubmitting }) => {
        // const cleanedPhoneNumber = values.phone.replace(/\D/g,'')
        this.props.history.push({
            pathname: ROUTES.VERIFY_PASSWORD_CODE, 
            state: {phoneNumber: values.phone}
        });
        setSubmitting(false);
    }

    render () {
        return (
            <Fragment>
                <H1>
                    Forgot your password?
                </H1>
                <H3>
                    Don’t worry! We’ll send you a text message with a code to reset your password.
                </H3>

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
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className={formContent}>
                                <div>
                                    <InputMask 
                                        mask="(999) 999-9999"
                                        label="Phone Number"
                                        name="phone"
                                        id="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        handleBlur={handleBlur}
                                    >
                                        {(inputProps) => 
                                            <TextField
                                                {...inputProps}
                                                error={submitCount > 0 && !!errors.phone}
                                                helperText={submitCount > 0 && errors.phone}
                                                fullWidth
                                            /> 
                                        }
                                    </InputMask>
                                </div>
                                <ActionButton disabled={isSubmitting} marginTop="31px" marginBottom="10px">
                                    Send Text
                                </ActionButton>
                                <P><Link to={ROUTES.LOGIN}>Go Back</Link></P>
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
