import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { updateApplicant } from 'reducers/applicant';
import captureRoute from 'app/captureRoute';
import { H1, formContent } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PhoneNumberInput from 'components/common/PhoneNumberInput';
import GenericFormError from 'components/common/GenericFormError';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { allValuesSet } from 'utils/formik';
import { serializeDate, parseDateISOString } from 'utils/misc';
import AccountForm from 'components/common/AccountForm';


export class AccountPage extends React.Component {
    state = {errors: null}

    get initialValues () {
        const applicant = this.props.applicant;
        let birthday = applicant.birthday;
        if (birthday) {
            birthday = parseDateISOString(birthday);
        }
        return {
            first_name: applicant.first_name,
            last_name: applicant.last_name,
            phone_number: applicant.phone_number,
            email: applicant.email,
            birthday
        }
    }

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const stateUpdate = Object.assign({}, values);
        stateUpdate.birthday = serializeDate(stateUpdate.birthday);
        this.props.updateApplicant(stateUpdate, stateUpdate).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                
            }
            setSubmitting(false);
        });
    }

    render () {
        return (
            <>
                <H1>Your Account Details</H1>
                <AccountForm initialValues={this.initialValues} messages={this.state.errors} onSubmit={this.onSubmit} />
            </>
        );
    }
}

AccountPage.propTypes = {
    updateApplicant: PropTypes.func,
}

const mapStateToProps = (state) => ({
    applicant: state.applicant,
});

const mapDispatchToProps = { updateApplicant };

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(AccountPage, ROUTES.ACCOUNT));
