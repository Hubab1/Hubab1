import React, { Component } from 'react';
import { connect } from 'react-redux';

import Terms from './Terms';
import { fetchRenterProfile } from '../../reducers/renterProfile/reducer';
import { changeScreen } from '../../reducers/nav/reducer';
import Customize from './Customize';

const mapScreenName = {
    'Terms': Terms,
    'Customize': Customize
}


class MainContainer extends Component {
  constructor () {
      super();
      this.state = {};
  }
  
  componentDidMount() {
      this.props.fetchRenterProfile();
  }

  initializePage () {
      const profile = this.props.profile;
      if (!profile.completed_terms_and_conditions) {
          this.props.changeScreen('Terms');
      } else if (profile.lets_talk_about.length === 0) {
          this.props.changeScreen(Customize);
      }
  }

  componentDidUpdate(prevProps) {
      if (!prevProps.profile && this.props.profile) {
        this.initializePage();
      }
  }
  
  render() {
      if (!this.props.screen) return null;
      const Component = mapScreenName[this.props.screen];
      return (
        <div>
            <div className="header"></div>
            <Component>
            </Component>
        </div>
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
