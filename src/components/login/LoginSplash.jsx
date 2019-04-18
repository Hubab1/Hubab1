import React, { Component } from 'react';

import { Bold, H1, BlueButton, agentBlock, agentTitle } from 'assets/index';
import Page from 'components/login/Page';

class LoginSplash extends Component {
  render() {
      return (
          <Page>
              <div className={agentBlock}>
                  <div>Jane Morgan</div>
                  <br/>
                  <br/>
                  <div className={agentTitle}>
                      <div>Leasing Agent</div>
                      <div>Sky Residencies</div>
                  </div>
              </div>
              <div style={{textAlign: 'left', padding: 25}}>
                  <H1>Hi Sam,</H1>
                  <div>Your magically simple rental application starts here.</div>
                  <br/>
                  <div>Your new home awaits at <Bold>555 Waverly 605 W 11th St, New York, Unit 3F</Bold> awaits.</div>
                  <br/>
                  <br/>
                  <BlueButton onClick={this.props.nextPage} style={{width: '100%'}}>Click here</BlueButton>
              </div>
          </Page>
      );
  }
};

export default LoginSplash;
