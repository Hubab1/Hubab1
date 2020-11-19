import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import API from 'app/api';
import captureRoute from 'app/captureRoute';
import { H1, blackLinkRoot, arrowIcon } from 'assets/styles';
import VerifyAccount from 'components/account/VerifyAccount';
import AccountForm from 'components/common/AccountForm';
import ChangePasswordForm from 'components/common/ChangePasswordForm';
import { ROUTES } from 'app/constants';
import { updateApplicant } from 'reducers/applicant';
import auth from 'utils/auth';
import { serializeDate, parseDateISOString } from 'utils/misc';

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

    onAccountDetailsSubmit = (values, { setSubmitting, setErrors }) => {
        const stateUpdate = Object.assign({}, values);
        stateUpdate.birthday = serializeDate(stateUpdate.birthday);
        this.props
            .updateApplicant(stateUpdate, stateUpdate)
            .then((res) => {
                if (res.errors) {
                    setErrors(res.errors);
                } else {
                    this.setState({
                        status: {
                            type: 'success',
                            detail: 'Changes saved',
                        },
                    });
                }
                setSubmitting(false);
            })
            .catch(() => {
                this.setState({
                    status: {
                        type: 'error',
                        detail: "We couldn't save your information. Please try again.",
                    },
                });
                setSubmitting(false);
            });
    };

    onChangePasswordSubmit = (values, { setSubmitting }) => {
        const token = auth.getToken();

        return API.passwordReset(values.password, token)
            .then((res) => {
                if (res.errors) {
                    this.setState({
                        resetPasswordErrors: ['There was an error with resetting your password. Please try again.'],
                    });
                } else {
                    this.setState({
                        status: {
                            type: 'success',
                            detail: 'Password successfully changed',
                        },
                        showChangePassword: false,
                        resetPasswordErrors: null,
                    });
                }
                setSubmitting(false);
            })
            .catch(() => {
                this.setState({
                    resetPasswordErrors: ['There was an error with resetting your password. Please try again.'],
                });
                setSubmitting(false);
            });
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
                    initialValues={this.initialValues}
                    status={this.state.status}
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
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    communityId: state.siteConfig.basename,
});

const mapDispatchToProps = { updateApplicant };

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(AccountPage, ROUTES.ACCOUNT));
