import './assets/index';

import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';

import store from './reducers/store';
import MainContainer from './components/main/MainContainer';
import ProfileContainer from './components/profile/ProfileContainer';
import LoginContainer from './components/login/LoginContainer';
import history from './history';
import createTheme from 'assets/createTheme';


class App extends Component {
  state = {}
  componentDidMount () {
      this.setState({theme: createTheme()});
      const isLoggedIn = false;
      if (!isLoggedIn) {
          history.push('/login');
      }
  }
  
  render() {
      if (!this.state.theme) return null;
      const routes = (
        <Switch>
            <Route exact path="/" component={MainContainer} />
            <Route path="/profile" component={ProfileContainer} />
            <Route path="/login" component={LoginContainer} />
        </Switch>
    );

    return (
      <Provider store={store}>
        <MuiThemeProvider theme={this.state.theme}>
            <div className="App">
                <Router history={history}>
                    {routes}
                </Router>
            </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
