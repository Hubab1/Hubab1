import './assets/index';

import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';


import MainContainer from 'components/main/MainContainer';
import ProfileContainer from 'components/profile/ProfileContainer';
import LoginContainer from 'components/login/LoginContainer';
import Page from 'components/common/Page';
import history from 'history.js';
import createTheme from 'assets/createTheme';
import auth from 'utils/auth';
import { initializePage } from 'utils/initializePage';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchLeaseSettings } from 'reducers/lease-settings';



class App extends Component {
    state = {}
    componentDidMount () {
        const { fetchRenterProfile, fetchLeaseSettings, profile } = this.props;
        fetchLeaseSettings().then((leaseSettings) => {

            const primaryColor = leaseSettings.community_branding.primary_color;
            const secondaryColor = leaseSettings.community_branding.secondary_color;
            this.setState({theme: createTheme(primaryColor, secondaryColor)});

            if (!auth.isAuthenticated()) {
                if (leaseSettings.client && !leaseSettings.client.has_application) {
                    history.push('/welcome');
                }
                history.push('/login');
            } else {
                this.props.fetchRenterProfile().then(
                    initializePage(profile)
                );
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.profile && this.props.profile) {
            initializePage(this.props.profile);
        }
    }


    render() {
        if (!this.state.theme) return null;
        const routes = (
            <Switch>
                <Route path="/profile" component={ProfileContainer} />
                <Route path="/login" component={LoginContainer} />
                <Route path="/" component={MainContainer} />
            </Switch>
        );

        return (
            <MuiThemeProvider theme={this.state.theme}>
                <div className="App">
                    <Router history={history}>
                        <Page>
                            {routes}
                        </Page>
                    </Router>
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    leaseSettings: state.leaseSettings,
});

const mapDispatchToProps = {fetchRenterProfile, fetchLeaseSettings};


export default connect(mapStateToProps, mapDispatchToProps)(App);
