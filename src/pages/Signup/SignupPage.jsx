import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ROUTES, SMS_OPT_IN_MARKETING_ENABLED } from 'constants/constants';
import auth from 'utils/auth';
import { serializeDate, parseDateISOString } from 'utils/misc';

import { getMultipleAppsV2LoginAndNavigation } from 'selectors/launchDarkly';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { fetchApplicant } from 'reducers/applicant';
import { actions as modalActions } from 'reducers/loader';

import UnauthenticatedPage from 'common-components/Pages/UnauthenticatedPage/UnauthenticatedPage';
import AccountForm from 'common-components/Forms/AccountForm/AccountForm';
import { H1, P, link } from 'assets/styles';

export class SignupPage extends Component {
    state = { errors: null };

    constructor(props) {
        super(props);
        const viewedTerms = localStorage?.getItem(`accepted-platform-terms-${props.leaseSettingsId}`);
        if (!viewedTerms) {
            props.history.push(ROUTES.TERMS);
        }
    }

    get applicantInfo() {
        const { person, invitee, client } = this.props.configuration;
        const baseInitialValues = {
            first_name: '',
            last_name: '',
            phone_number: '',
            email: '',
            birthday: '',
            password: '',
            sms_opt_in: false,
        };

        if (person) {
            const { first_name, last_name, email, phone_1 } = person;
            let { date_of_birth } = person;
            // dates are tricky... https://stackoverflow.com/questions/33908299/javascript-parse-a-string-to-date-as-local-time-zone
            if (date_of_birth) {
                date_of_birth = parseDateISOString(date_of_birth);
            }
            const personValues = Object.assign({}, baseInitialValues, {
                first_name,
                last_name,
                email,
                phone_number: phone_1,
                birthday: date_of_birth,
            });
            if (client) {
                personValues.id = client.id;
            }
            return personValues;
        } else if (invitee && invitee.first_name) {
            const { first_name, last_name, phone_number, email } = invitee;
            return Object.assign({}, baseInitialValues, { first_name, last_name, phone_number, email });
        } else {
            return baseInitialValues;
        }
    }

    auth = auth;
    onSubmit = (values, { setSubmitting }) => {
        const { history, hash } = this.props;

        const serialized = Object.assign({}, values);
        serialized.birthday = serializeDate(serialized.birthday);
        serialized.terms_of_service_acceptance = JSON.parse(
            localStorage?.getItem(`accepted-platform-terms-${this.props.leaseSettingsId}`)
        );
        serialized.electronic_signature_acceptance = JSON.parse(
            localStorage?.getItem(`accepted-electronic-signature-terms-${this.props.leaseSettingsId}`)
        );

        this.props.toggleLoader(true);

        // particularly need this for guarantor and co-applicant to associate with existing application
        return auth
            .register(serialized, this.props.leaseSettingsId, hash)
            .then((res) => {
                auth.setSession(res.token, this.props.leaseSettingsId);
                Promise.all([this.props.fetchRenterProfile(), this.props.fetchApplicant()]).then(() => {
                    history.replace(this.props.initialPage);
                });
            })
            .catch((res) => {
                const error = res?.errors?.error;
                if (error) {
                    if (this.props.multipleAppsV2LoginAndNavigation && error.message && error.sign_in_url) {
                        const { message, sign_in_url } = res.errors.error;
                        const html = (
                            <span>
                                {message} <a href={sign_in_url}>Sign In</a>
                            </span>
                        );
                        this.setState({ errors: [html] });
                    } else {
                        this.setState({ errors: [error] });
                    }
                } else {
                    this.setState({ errors: ['Oops, something went wrong. Try again.'] });
                }
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    get status() {
        return this.state.errors
            ? {
                  type: 'error',
                  detail: this.state.errors,
              }
            : null;
    }

    render() {
        if (!this.props.configuration) return;
        const optedIn = this.props.configuration.client?.sms_opted_in === SMS_OPT_IN_MARKETING_ENABLED;
        return (
            <UnauthenticatedPage>
                <H1>Start Your Rental Application by Creating an Account Below</H1>
                <AccountForm
                    submitText="Create Account"
                    withPassword
                    status={this.status}
                    initialValues={this.applicantInfo}
                    onSubmit={this.onSubmit}
                    showConsentInput={!optedIn && !this.props.configuration.invitee}
                    configuration={this.props.configuration}
                />
                <P className="already-have-account" fontSize={14}>
                    Already have an account?{' '}
                    <Link to={ROUTES.LOGIN} className={link}>
                        Sign in here
                    </Link>
                </P>
            </UnauthenticatedPage>
        );
    }
}

SignupPage.propTypes = {
    profile: PropTypes.object,
    leaseSettingsId: PropTypes.string,
    hash: PropTypes.string,
    configuration: PropTypes.object,
    history: PropTypes.object,
    initialPage: PropTypes.string,
    multipleAppsV2LoginAndNavigation: PropTypes.bool,
    fetchRenterProfile: PropTypes.func,
    fetchApplicant: PropTypes.func,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    initialPage: selectors.selectInitialPage(state),
    leaseSettingsId: state.siteConfig.basename,
    hash: state.siteConfig.hash,
    configuration: state.configuration,
    multipleAppsV2LoginAndNavigation: getMultipleAppsV2LoginAndNavigation(state),
});

const mapDispatchToProps = {
    fetchRenterProfile,
    fetchApplicant,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
