import React, { Component } from 'react';

import Terms from './Terms';
import TalkAboutOptions from './TalkAboutOptions';


class MainContainer extends Component {
  constructor () {
      super();
      this.state = {};
  }
  
  componentDidMount() {
      // fetch renter profile
      const renter_profile = {
          completed_terms_and_conditions: false,
          lets_talk_about: [],
          roommates: [],
          pets: [],
          guarantor: {}
      };
      if (!renter_profile.completed_terms_and_conditions) {
          this.setState({Page: Terms});
      } else if (renter_profile.lets_talk_about.length == 0) {
          this.setState({Page: TalkAboutOptions});
      }
  }
  
  render() {
      if (!this.state.Page) return null;
      return (
        <this.state.Page>
        </this.state.Page>
      );
  }
};

export default MainContainer;
