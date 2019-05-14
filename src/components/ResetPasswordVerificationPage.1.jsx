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

export class ResetPasswordVerificationPage extends React.Component {

    onSubmit = (values, { setSubmitting }) => {
        // const cleanedPhoneNumber = values.phone.replace(/\D/g,'')
        setSubmitting(false);
    }

    handleCodeChange = (values) => {
        if (values.length === 6) {
            this.form.submitForm();
        }
    }

    render () {
        return (
            <Fragment>
                <H1>
                    Enter Verification Code 
                </H1>
                <H3>
                We sent a text message to <strong>(609) 213-5221</strong> with a 6 digitcode to reset your password.
                </H3>

                <Formik
                    validationSchema={Yup.object().shape({
                        reset_code: Yup.string()
                            .length(6, 'Invalid code')
                    })}
                    ref={node => (this.form = node)}
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
                    }) => {
                        const wrappedHandleChange = (values) => {
                            this.handleCodeChange(values);
                            handleChange();
                        }
                        return (
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <div className={formContent}>
                                    <div>
                                        <FormTextInput
                                            label="Enter Code"
                                            name="reset_code"
                                            submitted={submitCount > 0}
                                            handleChange={wrappedHandleChange}
                                            handleBlur={handleBlur}
                                            error={errors.reset_code}
                                            touched={touched.reset_code }
                                            value={values.email}
                                        />
                                    </div>
                                </div>
                            </form>
                        )

                    })}
                </Formik>
            </Fragment>
        );
    }
}

ResetPasswordVerificationPage.propTypes = {
    fetchRenterProfile: PropTypes.func,
    profile: PropTypes.object
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    communityId: state.siteConfig.basename
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordVerificationPage);
