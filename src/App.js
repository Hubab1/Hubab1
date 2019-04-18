import './assets/index';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './reducers/store';
import MainContainer from './components/main/MainContainer';
import ProfileContainer from './components/profile/ProfileContainer';
import LoginContainer from './components/profile/LoginContainer';


class App extends Component {
  componentDidMount () {
      const isLoggedIn = false;
      if (!isLoggedIn) {
          window.history.pushState(null, null, '/login')
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
        <div className="App">
            {routes}
        </div>
      </Provider>
    );
  }
}

export default App;
