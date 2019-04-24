import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { H1, Subtitle, Disclaimer, Bold, loginContent } from 'assets/emotion/styles';

import { fetchRenterProfile } from 'reducers/renterProfile/reducer';
import { initializePage } from 'utils/initializePage';

import auth from 'utils/auth';

export class LoginPage extends React.Component {
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
                <H1 style={{color: 'black', fontWeight: 500}}>Hello, Sam!</H1>
                <Subtitle>Create a password to get started.</Subtitle>

                <Formik
                    initialValues={{ password: '' }}
                    validate={values => {
                        let errors = {};
                        if (!values.password) {
                            errors.password = 'Required';
                        } else if (values.password.length < 6) {
                            errors.password = 'Password too short.';
                        }
                        return errors;
                    }}
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
                            <span aria-label="clipboard" role="img" style={{fontSize: 60}}>📋</span>
                            <div>
                                <TextField
                                    error={errors.password && touched.password && !!errors.password}
                                    helperText={errors.password}
                                    label="Password"
                                    type="password"
                                    name="password"
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                />
                            </div>
                            <Disclaimer>By tapping continue, you confirm you have read, understand and accept the <Bold>Privacy Policy</Bold> and <Bold>Terms of Use.</Bold></Disclaimer>
                            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting} fullWidth>
                                Let's Go!
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
