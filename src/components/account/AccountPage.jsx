import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import { ROUTES } from 'app/constants';
import auth from 'utils/auth';
import API from 'app/api';
import captureRoute from 'app/captureRoute';
import { updateApplicant } from 'reducers/applicant';
import { getApplicantSubmittedApplication } from 'selectors/applicant';
import { serializeDate, parseDateISOString } from 'utils/misc';
import { H1, blackLinkRoot, arrowIcon } from 'assets/styles';
import VerifyAccount from 'components/account/VerifyAccount';
import AccountForm from 'components/common/AccountForm';
import ChangePasswordForm from 'components/common/ChangePasswordForm';

export class AccountPage extends React.Component {
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
            setSubmitting(false);
        }
    };

    onChangePasswordSubmit = async (values, { setSubmitting }) => {
        const token = auth.getToken();

        try {
            const response = await API.passwordReset(values.password, token);
            if (response.errors) {
                return this.setState({
                    resetPasswordErrors: ['There was an error with resetting your password. Please try again.'],
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

        return (
            <>
                <H1>Your Account Details</H1>
                <AccountForm
                    submitText="Save Changes"
                    status={this.state.status}
                    disableTUFields={this.props.applicantSubmittedApplication}
                    initialValues={this.initialValues}
                    onSubmit={this.onAccountDetailsSubmit}
                    resetPassword={() => this.setState({ showChangePassword: true })}
                />
            </>
        );
    }
}

AccountPage.propTypes = {
    updateApplicant: PropTypes.func,
    communityId: PropTypes.string,
    applicant: PropTypes.object,
    applicantSubmittedApplication: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    communityId: state.siteConfig.basename,
    applicantSubmittedApplication: getApplicantSubmittedApplication(state),
});

const mapDispatchToProps = { updateApplicant };

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(AccountPage, ROUTES.ACCOUNT));
