import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateApplicant } from 'reducers/applicant';
import captureRoute from 'app/captureRoute';
import { H1 } from 'assets/styles';
import { ROUTES } from 'app/constants';
import { serializeDate, parseDateISOString } from 'utils/misc';
import AccountForm from 'components/common/AccountForm';
import VerifyAccount from 'components/account/VerifyAccount';


export class AccountPage extends React.Component {
    state = {status: null, verified: false}

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

    onAccountDetailsSubmit = (values, { setSubmitting, setErrors }) => {
        const stateUpdate = Object.assign({}, values);
        stateUpdate.birthday = serializeDate(stateUpdate.birthday);
        this.props.updateApplicant(stateUpdate, stateUpdate).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                this.setState({
                    status: {
                        type: 'success',
                        detail: 'Changes saved'
                    }
                });
            }
            setSubmitting(false);
        }).catch(() => {
            this.setState({
                status: {
                    type: 'error',
                    detail: "We couldn't save your information. Please try again."
                }
            });
            setSubmitting(false);
        });
    }

    render () {
        if (!this.state.verified) {
            return <VerifyAccount
                communityId={this.props.communityId}
                setVerified={() => this.setState({verified: true})}
                email={this.initialValues.email}
            />
        }
        return (
            <>
                <H1>Your Account Details</H1>
                <AccountForm
                    submitText="Save Changes"
                    initialValues={this.initialValues}
                    status={this.state.status}
                    onSubmit={this.onAccountDetailsSubmit}
                />
            </>
        );
    }
}

AccountPage.propTypes = {
    updateApplicant: PropTypes.func,
    communityId: PropTypes.string,
    applicant: PropTypes.object,
}

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    communityId: state.siteConfig.basename,
});

const mapDispatchToProps = { updateApplicant };

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(AccountPage, ROUTES.ACCOUNT));
