import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Router } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import WelcomePage from 'components/welcome/WelcomePage';
import ProfileContainer from 'components/profile/ProfileContainer';
import LoginPage from 'components/login/LoginPage';
import SignupPage from 'components/SignupPage';
import TermsPage from 'components/TermsPage';
import Page from 'components/common/Page/Page';
import history from 'history.js';
import createTheme from 'assets/createTheme';
import auth from 'utils/auth';
import { initializePage } from 'utils/initializePage';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchLeaseSettings } from 'reducers/lease-settings';



export class App extends Component {
    constructor () {
        super();
        window.updateTheme = this.updateTheme;
    }

    updateTheme = (primaryColor, secondaryColor) => {
        this.setState({theme: createTheme(primaryColor, secondaryColor)});
    }

    state = {theme: null}

    mountNavigation(isAuthenticated, leaseSettings) {
        const { fetchRenterProfile } = this.props;
        if (!isAuthenticated) {
            if (leaseSettings.client && leaseSettings.client.application_id) {
                history.push('/login');
            } else {
                history.push('/welcome');
            }
        } else {
            fetchRenterProfile();
        }
    }

    componentDidMount () {
        const { fetchLeaseSettings } = this.props;
        fetchLeaseSettings().then((leaseSettings) => {
            const primaryColor = leaseSettings.primary_color;
            const secondaryColor = leaseSettings.secondary_color;
            this.setState({theme: createTheme(primaryColor, secondaryColor)});

            const isAuthenticated = auth.isAuthenticated();

            this.mountNavigation(isAuthenticated, leaseSettings);
        })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.profile && this.props.profile) {
            initializePage(this.props.profile);
        }
    }

    render() {
        const theme = this.state.theme;
        if (!theme) return null;
        const routes = (
            <Switch>
                <Route path="/welcome" component={WelcomePage}/>
                <Page logo={this.props.leaseSettings.logo}>
                    <Route path="/profile" component={ProfileContainer} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/signup" component={SignupPage} />
                    <Route path="/terms" component={TermsPage}/>
                </Page>
            </Switch>
        );
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <Router history={history}>
                        {routes}
                    </Router>
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    profile: PropTypes.object,
    leaseSettings: PropTypes.object,
    fetchRenterProfile: PropTypes.func,
    fetchLeaseSettings: PropTypes.func,
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    leaseSettings: state.leaseSettings,
});

const mapDispatchToProps = {fetchRenterProfile, fetchLeaseSettings};


export default connect(mapStateToProps, mapDispatchToProps)(App);
