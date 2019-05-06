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
import { fetchConfiguration } from 'reducers/configuration';



export class App extends Component {
    constructor () {
        super();
        window.updateTheme = this.updateTheme;
    }

    updateTheme = (primaryColor, secondaryColor) => {
        this.setState({theme: createTheme(primaryColor, secondaryColor)});
    }

    state = {theme: null}

    mountNavigation(isAuthenticated, configuration) {
        const { fetchRenterProfile } = this.props;
        if (!isAuthenticated) {
            if (configuration.client && configuration.client.application_id) {
                history.push('/login');
            } else {
                history.push('/welcome');
            }
        } else {
            fetchRenterProfile();
        }
    }

    componentDidMount () {
        const { fetchConfiguration } = this.props;
        fetchConfiguration().then((configuration) => {
            const primaryColor = configuration.primary_color;
            const secondaryColor = configuration.secondary_color;
            this.setState({theme: createTheme(primaryColor, secondaryColor)});

            const isAuthenticated = auth.isAuthenticated();

            this.mountNavigation(isAuthenticated, configuration);
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
                <Page logo={this.props.configuration.logo}>
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
    configuration: PropTypes.object,
    fetchRenterProfile: PropTypes.func,
    fetchConfiguration: PropTypes.func,
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

const mapDispatchToProps = {fetchRenterProfile, fetchConfiguration};


export default connect(mapStateToProps, mapDispatchToProps)(App);
