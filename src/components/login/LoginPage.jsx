import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import auth from 'utils/auth';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { actions as loaderActions } from 'reducers/loader';
import { fetchApplicant } from 'reducers/applicant';
import { prettyFormatPhoneNumber } from 'utils/misc';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import LoginForm from 'components/common/LoginForm';
import GenericFormMessage from 'components/common/GenericFormMessage';
import welcome from 'assets/images/welcome.jpeg';
import { H1, SpacedH3 } from 'assets/styles';

const BAD_CREDENTIALS_ERROR = 'The email and password you entered do not match our records. Please try again.';
const NO_APPLICATION_ERROR = (phone) =>
    `Oops, there is no longer an application associated with this account. Please call us at ${phone} if you have any questions.`;
const GENERIC_ERROR = 'Oops, something has gone wrong.';

export class LoginPage extends React.Component {
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
                return NO_APPLICATION_ERROR(prettyFormatPhoneNumber(this.props.community.contact_phone));
            default:
                return GENERIC_ERROR;
        }
    }

    onSubmit = (values, { setSubmitting }) => {
        this.props.toggleLoader(true);

        const { history } = this.props;
        return auth
            .login(values.email, values.password, this.props.communityId)
            .then((res) => {
                auth.setSession(res.token, this.props.communityId);
                if (this.state.errors) this.setState({ errors: null });
                Promise.all([this.props.fetchRenterProfile(), this.props.fetchApplicant()]).then(() => {
                    history.replace(this.props.initialPage);
                });
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
    location: PropTypes.object,
    history: PropTypes.object,
    fetchApplicant: PropTypes.func,
    configuration: PropTypes.object.isRequired,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    initialPage: selectors.selectInitialPage(state),
    communityId: state.siteConfig.basename,
    community: state.configuration && state.configuration.community,
    invitee: state.configuration && state.configuration.invitee,
});

const mapDispatchToProps = {
    fetchRenterProfile,
    fetchApplicant,
    toggleLoader: loaderActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
