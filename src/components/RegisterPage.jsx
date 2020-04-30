import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { H1, P, link } from 'assets/styles';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { fetchApplicant } from 'reducers/applicant';
import { ROUTES, SMS_OPT_IN_MARKETING_ENABLED } from 'app/constants';
import auth from 'utils/auth';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import { serializeDate, parseDateISOString } from 'utils/misc';
import AccountForm from 'components/common/AccountForm';


export class RegisterPage extends React.Component {
    state = {errors: null}

    constructor(props) {
        super(props);
        const viewedTerms = localStorage.getItem(`accepted-terms-${props.leaseSettingsId}`);
        if (!viewedTerms) {
            props.history.push(ROUTES.TERMS);
        }
    }

    get applicantInfo () {
        const client = this.props.configuration.client;
        const invitee = this.props.configuration.invitee;
        const baseInitialValues = {first_name: '', last_name: '', phone_number: '', email: '', birthday: '', password: ''}

        if (client && client.person) {
            const { first_name, last_name, email, phone_1 } = client.person;
            let { date_of_birth } = client.person;
            // dates are tricky... https://stackoverflow.com/questions/33908299/javascript-parse-a-string-to-date-as-local-time-zone	
            if (date_of_birth) {	
                date_of_birth = parseDateISOString(date_of_birth);	
            }	
            return Object.assign({}, baseInitialValues, 
                {first_name, last_name, email, phone_number: phone_1, id: client.id, birthday: date_of_birth}
            );
        } else if (invitee && invitee.first_name) {
            const { first_name, last_name, phone_number, email } = invitee;
            return Object.assign({}, baseInitialValues, { first_name, last_name, phone_number, email });
        } else {
            return baseInitialValues;
        }
    }

    auth=auth
    onSubmit = (values, { setSubmitting }) => {
        const { history, hash } = this.props;

        const serialized = Object.assign({}, values);
        serialized.birthday = serializeDate(serialized.birthday);
        serialized.terms_of_service_acceptance =
            JSON.parse(localStorage.getItem(`accepted-terms-${this.props.leaseSettingsId}`));

        // TODO: add hash (and possibly initial values) to localStorage in case user refreshes
        // particularly need this for guarantor and co-applicant to associate with existing application
        return auth.register(serialized, this.props.leaseSettingsId, hash).then((res) => {
            auth.setSession(res.token, this.props.leaseSettingsId);
            setSubmitting(false);
            Promise.all([this.props.fetchRenterProfile(), this.props.fetchApplicant()]).then(() => {
                history.replace(this.props.initialPage);
            });
        }).catch((res) => {
            this.setState({errors: [res.errors.error]});
            setSubmitting(false);
        });
    }

    get status () {
        return this.state.errors ? {
            type: 'error',
            detail: this.state.errors
        } : null;
    }

    render () {
        if (!this.props.configuration) return;
        const optedIn = this.props.configuration.client?.sms_opted_in === SMS_OPT_IN_MARKETING_ENABLED;
        return (
            <UnauthenticatedPage>
                <H1>Start Your Rental Application by Creating an Account Below</H1>
                <AccountForm
                    submitText="Create Account"
                    withPassword status={this.status}
                    initialValues={this.applicantInfo}
                    messages={this.state.errors}
                    onSubmit={this.onSubmit}
                    showConsentInput={!optedIn}
                />
                <P className="already-have-account">Already have an account? <Link to={ROUTES.LOGIN} className={link}>Sign in here</Link></P>
            </UnauthenticatedPage>
        );
    }
}

RegisterPage.propTypes = {
    profile: PropTypes.object,
    fetchRenterProfile: PropTypes.func,
    leaseSettingsId: PropTypes.string,
    hash: PropTypes.string,
    configuration: PropTypes.object
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    initialPage: selectors.selectInitialPage(state),
    leaseSettingsId: state.siteConfig.basename,
    hash: state.siteConfig.hash,
    configuration: state.configuration
});

const mapDispatchToProps = { fetchRenterProfile, fetchApplicant };

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
