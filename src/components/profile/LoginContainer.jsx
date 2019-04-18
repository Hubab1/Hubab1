import React, { Component } from 'react';

import { Bold, H1, BlueButton } from 'assets/index';
import Page from 'components/login/Page';

class LoginContainer extends Component {
  render() {
      return (
          <Page>
              <div>
                  <div>Jane Morgan</div>
                  <div></div>
                  <div>Leasing Agent</div>
                  <div>Sky Residencies</div>
              </div>
              <div>
                  <H1>Hi Sam,</H1>
                  <br/>
                  <br/>
                  <div>Your magically simple rental application starts here.</div>
                  <br/>
                  <div>Your new home awaits at <Bold>555 Waverly 605 W 11th St, New York, Unit 3F</Bold> awaits.</div>
                  <BlueButton>Click here</BlueButton>
              </div>
          </Page>
      );
  }
};

export default LoginContainer;
