import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import FormTextInput from 'components/common/FormTextInput';
import Button from '@material-ui/core/Button';
import * as Yup from 'yup';

import { SubtitleTwo, loginContent } from 'assets/emotion/styles';

import { fetchRenterProfile } from 'reducers/renter-profile';
import { initializePage } from 'utils/initializePage';

import auth from 'utils/auth';

export class SignupPage extends React.Component {
    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        return auth.login(values.username, values.password).then((res) => {
            auth.setSession(res.token);
            setSubmitting(false);
            this.props.fetchRenterProfile().then(
                initializePage(this.props.profile)
            );
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        return (
            <Fragment>
                <SubtitleTwo>To get started on your rental application, create an account below</SubtitleTwo>
                <Formik
                    initialValues={{ password: '' }}
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().required(),
                        last_name: Yup.string().required(),
                        phone_number: Yup.string().required(),
                        email: Yup.string()
                          .email()
                          .required('Required'),
                        password: Yup.string()
                            .min(6)
                            .required()
                    })}
                    onSubmit={this.onSubmit}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className={loginContent}>
                            <FormTextInput
                                label="First Name"
                                name="first_name"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.first_name}
                                touched={touched.first_name}
                                value={values.first_name}
                            />
                            <FormTextInput
                                label="Last Name"
                                name="last_name"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.last_name}
                                touched={touched.last_name}
                                value={values.last_name}
                            />
                            <FormTextInput
                                label="Email"
                                name="email"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.email}
                                touched={touched.email}
                                value={values.email}
                            />
                            <FormTextInput
                                label="Phone Number"
                                name="phone_number"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.phone_number}
                                touched={touched.phone_number}
                                value={values.phone_number}
                            />
                            <FormTextInput
                                label="Password"
                                name="password"
                                type="password"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.password}
                                touched={touched.password}
                                value={values.password}
                            />
                            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting} fullWidth>
                                Start Application
                            </Button>
                        </div>
                    </form>
                )}
                </Formik>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
});

const mapDispatchToProps = { fetchRenterProfile };

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
