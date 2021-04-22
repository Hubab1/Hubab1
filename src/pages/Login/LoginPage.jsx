import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import auth from 'utils/auth';
import { prettyFormatPhoneNumber } from 'utils/misc';
import * as routingHelpers from 'utils/routingHelpers';

import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { fetchApplicant } from 'reducers/applicant';
import { actions as loaderActions } from 'reducers/loader';

import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';
import LoginForm from 'common-components/LoginForm/LoginForm';
import UnauthenticatedPage from 'pages/Unauthenticated';
import { H1, SpacedH3 } from 'assets/styles';
import welcome from 'assets/images/welcome.jpeg';

const BAD_CREDENTIALS_ERROR = 'The email and password you entered do not match our records. Please try again.';
const GENERIC_ERROR = 'Oops, something has gone wrong.';

const getNoApplicationError = (phone) =>
    `Oops, there is no longer an application associated with this account. Please call us at ${phone} if you have any questions.`;

export class LoginPage extends Component {
    state = { errors: null };

    auth = auth;

    get errors() {
        if (this.state.errors) {
            return this.state.errors;
        }
        if (this.props.location.state?.errors) {
            return this.props.location.state.errors;
        }
        return null;
    }

    get_error_message(error) {
        switch (error) {
            case 'Invalid credentials':
                return BAD_CREDENTIALS_ERROR;
            case 'Application does not exist':
                return getNoApplicationError(prettyFormatPhoneNumber(this.props.community.contact_phone));
            default:
                return GENERIC_ERROR;
        }
    }

    onSubmit = (values, { setSubmitting }) => {
        this.setState({ errors: null });
        this.props.toggleLoader(true);

        const { history } = this.props;
        return auth
            .login(values.email, values.password, this.props.communityId)
            .then(async (res) => {
                auth.setSession(res.token, this.props.communityId);

                const applicant = await this.props.fetchApplicant();
                const applicationId =
                    routingHelpers.getApplicationIdFromUrl() ||
                    this.props?.configuration?.application_id ||
                    this.props?.applicant?.application;
                const application = await this.props.fetchRenterProfile(applicationId);
                const initialRoute = routingHelpers.getInitialRoute(
                    applicant,
                    application,
                    this.props.configuration,
                    this.props.accessedAppByInvitationOrWebsite,
                    this.props.initialPage
                );

                history.replace(initialRoute);
            })
            .catch((res) => {
                const error = res.errors?.error;
                this.setState({ errors: [this.get_error_message(error)] });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    render() {
        return (
            <UnauthenticatedPage>
                <H1>Welcome Back</H1>
                <SpacedH3>
                    {this.props.invitee?.is_registered
                        ? `Looks like you've applied to ${this.props.community?.company.name} community before. Sign in to get started on your application.`
                        : `Sign in to continue with your application.`}
                </SpacedH3>
                <GenericFormMessage type="error" messages={this.errors} />
                <img src={welcome} alt="welcome sign" width="118" height="94" />
                <LoginForm handleOnSubmit={this.onSubmit} includeRegister={true} buttonText="Sign In" />
            </UnauthenticatedPage>
        );
    }
}

LoginPage.propTypes = {
    fetchRenterProfile: PropTypes.func,
    profile: PropTypes.object,
    initialPage: PropTypes.string,
    communityId: PropTypes.string,
    community: PropTypes.object,
    applicant: PropTypes.object,
    invitee: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    accessedAppByInvitationOrWebsite: PropTypes.bool,
    fetchApplicant: PropTypes.func,
    configuration: PropTypes.object.isRequired,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    initialPage: selectors.selectInitialPage(state),
    communityId: state.siteConfig.basename,
    configuration: state.configuration,
    community: state.configuration?.community,
    invitee: state.configuration?.invitee,
    applicant: state.applicant,
    accessedAppByInvitationOrWebsite: Boolean(state.siteConfig.hash),
});

const mapDispatchToProps = {
    fetchRenterProfile,
    fetchApplicant,
    toggleLoader: loaderActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
