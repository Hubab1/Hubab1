import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

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
      <div className="App">
          {routes}
      </div>
    );
  }
}

export default App;
