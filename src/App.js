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
import { fetchRenterProfile } from 'reducers/renterProfile/reducer';



class App extends Component {
    state = {}
    componentDidMount () {
        this.setState({theme: createTheme()});
        if (!auth.isAuthenticated()) {
            history.push('/login');
        } else {
            this.props.fetchRenterProfile().then(initializePage(this.props.profile));
        }
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
});

const mapDispatchToProps = {fetchRenterProfile};


export default connect(mapStateToProps, mapDispatchToProps)(App);
