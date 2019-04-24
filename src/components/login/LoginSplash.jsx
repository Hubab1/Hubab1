import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';

import { Bold, H1, agentBlock, agentTitle } from 'assets/index';

class LoginSplash extends Component {
  render() {
      return (
          <Fragment>
              <div className={agentBlock}>
                  <div>Jane Morgan</div>
                  <span aria-label="agent-avatar" role="img" style={{fontSize: 60, lineHeight: '80px'}}>👩</span>
                  <div className={agentTitle}>
                      <div>Leasing Agent</div>
                      <div>Sky Residencies</div>
                  </div>
              </div>
              <div style={{textAlign: 'left', padding: 25}}>
                  <H1>Hi Sam, YOU HAVE AN APPLICATION AND ARE HERE TO CONTINUE IT!!!!</H1>
                  <div>Your magically simple rental application starts here.</div>
                  <br/>
                  <div>Your new home awaits at <Bold>555 Waverly 605 W 11th St, New York, Unit 3F</Bold> awaits.</div>
                  <br/>
                  <br/>
                  <Button onClick={this.props.nextPage} variant="contained" color="primary" type="submit" fullWidth>
                        Click here
                  </Button>
              </div>
          </Fragment>
      );
  }
};

export default LoginSplash;
