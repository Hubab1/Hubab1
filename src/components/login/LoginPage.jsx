import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';

import { H1, Subtitle, BlueButton } from '../../assets/index';
import { nextScreen } from '../../reducers/nav/reducer';
import Page from './Page';

export class LoginPage extends React.Component {

    render () {
        return (
            <Page>
                <H1>Hello, Sam!</H1>
                <Subtitle>Create a password to get started.</Subtitle>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={values => {
                        let errors = {};
                        if (!values.email) {
                        errors.email = 'Required';
                        } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                        errors.email = 'Invalid email address';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                        }, 400);
                    }}
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
                        <div>
                            <TextField name="email" value={values.email} onBlur={handleBlur} onChange={handleChange}/>
                            <div>{errors.email && touched.email && errors.email}</div>
                        </div>
                        <div>
                            <TextField
                                type="password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                            <div>{errors.password && touched.password && errors.password}</div>
                        </div>
                        <BlueButton type="submit" disabled={isSubmitting}>
                            Submit
                        </BlueButton>
                    </form>
                )}
                </Formik>
            </Page>
        );
    }
}

export default connect(null, {nextScreen})(LoginPage);