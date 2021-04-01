import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import { ROUTES } from 'constants/constants';
import API from 'api/api';
import captureRoute from 'utils/captureRoute';
import { serializeDate, parseDateISOString, prettyFormatPhoneNumber } from 'utils/misc';

import { updateApplicant } from 'reducers/applicant';
import { getApplicantSubmittedApplication } from 'selectors/applicant';
import { actions as modalActions } from 'reducers/loader';

import AccountForm from 'common-components/AccountForm/AccountForm';
import ChangePasswordForm from 'common-components/ChangePasswordForm/ChangePasswordForm';
import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';
import VerifyAccount from 'pages/Account/components/VerifyAccount';
import { H1, blackLinkRoot, arrowIcon } from 'assets/styles';

export class AccountPage extends Component {
    state = { status: null, verified: false, showChangePassword: false, resetPasswordErrors: null };

    get initialValues() {
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
            birthday,
        };
    }

    onAccountDetailsSubmit = async (values, { setSubmitting, setErrors }) => {
        const data = {
            ...values,
            birthday: serializeDate(values.birthday),
        };

        this.props.toggleLoader(true);

        try {
            const response = await this.props.updateApplicant(data, data);
            if (response.errors) {
                return setErrors(response.errors);
            }

            this.setState({
                status: {
                    type: 'success',
                    detail: 'Changes saved',
                },
            });
        } catch {
            this.setState({
                status: {
                    type: 'error',
                    detail: "We couldn't save your information. Please try again.",
                },
            });
        } finally {
            this.props.toggleLoader(false);
            setSubmitting(false);
        }
    };

    onChangePasswordSubmit = async (values, { setSubmitting }) => {
        this.props.toggleLoader(true);

        try {
            const response = await API.passwordChange(values.password);
            if (response.errors) {
                return this.setState({
                    resetPasswordErrors: [response.errors],
                });
            }

            this.setState({
                status: {
                    type: 'success',
                    detail: 'Password successfully changed',
                },
                showChangePassword: false,
                resetPasswordErrors: null,
            });
        } catch {
            this.setState({
                resetPasswordErrors: ['There was an error with resetting your password. Please try again.'],
            });
        } finally {
            this.props.toggleLoader(false);
            setSubmitting(false);
        }
    };

    render() {
        if (!this.state.verified) {
            return (
                <VerifyAccount
                    communityId={this.props.communityId}
                    setVerified={() => this.setState({ verified: true })}
                    email={this.initialValues.email}
                />
            );
        }

        if (this.state.showChangePassword) {
            return (
                <>
                    <H1>Change Password</H1>
                    <ChangePasswordForm
                        onSubmit={this.onChangePasswordSubmit}
                        errors={this.state.resetPasswordErrors}
                    />
                    <span className={blackLinkRoot} onClick={() => this.setState({ showChangePassword: false })}>
                        <ArrowBackIos classes={{ root: arrowIcon }} /> Go Back
                    </span>
                </>
            );
        }

        const phoneNumber = prettyFormatPhoneNumber(this.props.configuration.community.contact_phone);
        const canUpdatePersonalInfo = !this.props.applicantSubmittedApplication;

        return (
            <>
                <H1>Your Account Details</H1>
                {!canUpdatePersonalInfo && (
                    <GenericFormMessage
                        type="error"
                        messages={`Please call us at ${phoneNumber} if you'd like to make any changes to your name or date of birth.`}
                    />
                )}
                <AccountForm
                    submitText="Save Changes"
                    status={this.state.status}
                    canUpdatePersonalInfo={canUpdatePersonalInfo}
                    initialValues={this.initialValues}
                    onSubmit={this.onAccountDetailsSubmit}
                    resetPassword={() => this.setState({ showChangePassword: true })}
                />
            </>
        );
    }
}

AccountPage.propTypes = {
    communityId: PropTypes.string,
    configuration: PropTypes.object,
    applicant: PropTypes.object,
    applicantSubmittedApplication: PropTypes.bool,
    updateApplicant: PropTypes.func,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    communityId: state.siteConfig.basename,
    configuration: state.configuration,
    applicantSubmittedApplication: getApplicantSubmittedApplication(state),
});

const mapDispatchToProps = {
    updateApplicant,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(AccountPage, ROUTES.ACCOUNT));
