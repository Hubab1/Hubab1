import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import welcome from 'assets/images/welcome.jpeg';
import { H1, SpacedH3 } from 'assets/styles';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { fetchApplicant } from 'reducers/applicant';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import LoginForm from 'components/common/LoginForm';

import auth from 'utils/auth';

export class LoginPage extends React.Component {
    state = {errors: null}

    auth=auth

    get errors() {
        if (this.state.errors) {
            return this.state.errors;
        }
        if (this.props.location.state?.errors) {
            return this.props.location.state.errors;
        }
    }
    onSubmit = (values, { setSubmitting }) => {
        const { history } = this.props;
        return auth.login(values.email, values.password, this.props.communityId).then((res) => {
            auth.setSession(res.token, this.props.communityId);
            setSubmitting(false);
            if (this.state.errors) this.setState({errors: null});
            Promise.all([this.props.fetchRenterProfile(), this.props.fetchApplicant()]).then(() => {
                history.replace(this.props.initialPage);
            });
        }).catch((res) => {
            const errorMessage = 'The email and password you entered do not match our records. Please try again.';
            this.setState({errors: [errorMessage]});
            setSubmitting(false);
        });
    }

    render () {
        return (
            <UnauthenticatedPage>
                <H1>
                    Welcome Back
                </H1>
                <SpacedH3>
                    Sign in to continue with your application.
                </SpacedH3>
                <img src={welcome} alt="welcome sign" width="118" height="94"/>
                <LoginForm
                    handleOnSubmit={this.onSubmit}
                    includeRegister={true}
                    buttonText="Sign In"
                    formErrors={this.errors}
                />
            </UnauthenticatedPage>
        );
    }
}

LoginPage.propTypes = {
    fetchRenterProfile: PropTypes.func,
    profile: PropTypes.object,
    initialPage: PropTypes.string,
    communityId: PropTypes.string,
}

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    initialPage: selectors.selectInitialPage(state),
    communityId: state.siteConfig.basename
});

const mapDispatchToProps = { fetchRenterProfile, fetchApplicant };

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
