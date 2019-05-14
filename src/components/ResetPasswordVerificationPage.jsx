import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import { formContent, H1, H3, P } from 'assets/styles';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';

export class ResetPasswordVerificationPage extends React.Component {
    state = {reset_code: null}

    componentDidMount() {
        !this.props.history.location.state && this.props.history.push(ROUTES.FORGOT_PASSWORD);
    }

    onSubmit = (values, { setSubmitting }) => {
        const reset_code = this.state.reset_code;
        setSubmitting(false);
        this.props.history.push(ROUTES.RESET_PASSWORD);
    }

    handleCodeChange = (event) => {
        this.setState({reset_code:event.target.value}, () => this.form.submitForm());
    }

    render () {
        if (!this.props.history.location.state) return <div></div>;
        const phone_number = this.props.history.location.state.phone_number;
        return (
            <Fragment>
                <H1>
                    Enter Verification Code 
                </H1>
                <H3>
                We sent a text message to <strong>{phone_number}</strong> with a 6 digit code to reset your password.
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
                        const wrappedHandleChange = (event) => {
                            if (event.target.value.length === 6) {
                                this.handleCodeChange(event);
                            }
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
                                            value={values.reset_code}
                                        />
                                    </div>
                                </div>
                            </form>
                        )

                    }}
                </Formik>
                <P>Didn't Receive a text? <a href='' role="button" onClick={() => console.log('you clict')}>Resend Here</a></P>
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
