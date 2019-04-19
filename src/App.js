import './assets/index';

import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import store from './reducers/store';
import MainContainer from './components/main/MainContainer';
import ProfileContainer from './components/profile/ProfileContainer';
import LoginContainer from './components/login/LoginContainer';
import history from './history';


const theme = createMuiTheme({
  palette: {
    primary: {
        main: '#2B44FF'
    },
    secondary: {
        main: '#2B44FF'
      }
    }
  },
)


class App extends Component {
  componentDidMount () {
      const isLoggedIn = false;
      if (!isLoggedIn) {
          history.push('/login');
      }
  }
  
  render() {
      const routes = (
        <Switch>
            <Route exact path="/" component={MainContainer} />
            <Route path="/profile" component={ProfileContainer} />
            <Route path="/login" component={LoginContainer} />
        </Switch>
    );

    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
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
