import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';


import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { formContent, H1, H3, P } from 'assets/styles';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';

export class ForgotPasswordPage extends React.Component {
    onSubmit = (values, { setSubmitting }) => {
        console.log(values);
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
                        phone_number: Yup.string()
                            .required('Phone Number is required')
                            .matches(/^[0-9]*$/, 'Phone Number must be only numbers')
                            .length(10, 'Phone Number must be 10 digits')
                    })}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        submitCount,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className={formContent}>
                                <div>
                                    <FormTextInput
                                        label="Phone Number"
                                        name="phone_number"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.phone_number}
                                        touched={touched.phone_number}
                                        value={values.phone_number}
                                    />
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
