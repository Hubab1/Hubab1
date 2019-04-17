import './assets/index';

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './reducers/store';
import MainContainer from './components/main/MainContainer';
import ProfileContainer from './components/profile/ProfileContainer';


class App extends Component {
  render() {
      const routes = (
        <Switch>
            <Route exact path="/" component={MainContainer} />
            <Route path="/profile" component={ProfileContainer} />
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
