import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchRenterProfile } from '../../reducers/renterProfile/reducer';
import { changeScreen } from '../../reducers/nav/reducer';
import mapScreenName from '../../mapScreenName';


class MainContainer extends Component {
  constructor () {
      super();
      this.state = {};
  }
  
  componentDidMount() {
      // if islogged in
      this.props.fetchRenterProfile().then(this.initializePage);
  }

  initializePage = () => {
      const profile = this.props.profile;
      if (!profile) return;
      if (!profile.completed_terms_and_conditions) {
          this.props.changeScreen('Terms');
      } else if (profile.lets_talk_about.length === 0) {
          this.props.changeScreen('RenterProfileOptions');
      }
  }

  componentDidUpdate(prevProps) {
      if (!prevProps.profile && this.props.profile) {
        this.initializePage();
      }
  }
  
  render() {
      if (!this.props.screen) return null;
      const Screen = mapScreenName[this.props.screen];
      return (
          <Screen />
      );
  }
};

const mapStateToProps = state => ({
    profile: state.renterProfile,
    screen: state.nav.screen
});

export default connect(mapStateToProps,
    { fetchRenterProfile, changeScreen }
)(MainContainer);
