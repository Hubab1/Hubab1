import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import history from 'app/history';
import InputMask from 'react-input-mask';


import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { formContent, H1, H3, GoBack } from 'assets/styles';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';


export class ForgotPasswordPage extends React.Component {
    state = {phone: null}

    handleChange = (values) => {
        this.setState({phone: values.phone})
    }

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
                            .length(10, 'Must be 10 digits')
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
                                    <InputMask 
                                        mask="(999) 999-9999" 
                                        value={values.phone}
                                        onChange={() => this.handleChange(values.phone)}
                                    >
                                        {() =>
                                            <FormTextInput
                                                label="Phone Number"
                                                name="phone"
                                                ref="phone"
                                                submitted={submitCount > 0}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                error={errors.phone}
                                                touched={touched.phone}
                                                value={values.phone}
                                            /> 
                                        }
                                    </InputMask>
                                </div>
                                <ActionButton disabled={isSubmitting} marginTop="30px" marginBottom="10px">
                                    Send Text
                                </ActionButton>
                                {/* eslint-disable-next-line */}
                                <br/>
                                <GoBack onClick={() => history.push(ROUTES.LOGIN)}>Go Back</GoBack>
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
