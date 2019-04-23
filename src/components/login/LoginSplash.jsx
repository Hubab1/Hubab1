import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import { Bold, PageHeader, agentBlock, agentTitle } from 'assets/index';
import Page from 'components/login/Page';

class LoginSplash extends Component {
  render() {
      return (
          <Page>
              <div className={agentBlock}>
                  <div>Jane Morgan</div>
                  <span aria-label="agent-avatar" role="img" style={{fontSize: 60, lineHeight: '80px'}}>👩</span>
                  <div className={agentTitle}>
                      <div>Leasing Agent</div>
                      <div>Sky Residencies</div>
                  </div>
              </div>
              <div style={{textAlign: 'left', padding: 25}}>
                  <PageHeader>Hi Sam,</PageHeader>
                  <div>Your magically simple rental application starts here.</div>
                  <br/>
                  <div>Your new home awaits at <Bold>555 Waverly 605 W 11th St, New York, Unit 3F</Bold> awaits.</div>
                  <br/>
                  <br/>
                  <Button onClick={this.props.nextPage} variant="contained" color="primary" type="submit" fullWidth>
                        Click here
                  </Button>
              </div>
          </Page>
      );
  }
};

export default LoginSplash;
