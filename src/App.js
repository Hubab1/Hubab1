import 'assets/emotion/styles';

import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { MuiThemeProvider, withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import MainContainer from 'components/main/MainContainer';
import WelcomePage from 'components/welcome/WelcomePage';
import ProfileContainer from 'components/profile/ProfileContainer';
import LoginContainer from 'components/login/LoginContainer';
import Page from 'components/common/Page';
import history from 'history.js';
import createTheme from 'assets/createTheme';
import auth from 'utils/auth';
import { initializePage } from 'utils/initializePage';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchLeaseSettings } from 'reducers/lease-settings';



export class App extends Component {
    state = {}

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
                <Page>
                    <Route path="/profile" component={ProfileContainer} />
                    <Route path="/login" component={LoginContainer} />
                    <Route path="/" component={MainContainer} />
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

const mapStateToProps = state => ({
    profile: state.renterProfile,
});

const mapDispatchToProps = {fetchRenterProfile, fetchLeaseSettings};


export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(App));
