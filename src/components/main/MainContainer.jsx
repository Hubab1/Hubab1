import React, { Component } from 'react';
import { connect } from 'react-redux';

import Terms from './Terms';
import { fetchRenterProfile } from '../../reducers/renterProfile/renterProfile';
import TalkAboutOptions from './TalkAboutOptions';


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
          this.setState({Page: Terms});
      } else if (profile.lets_talk_about.length === 0) {
          this.setState({Page: TalkAboutOptions});
      }
  }

  componentDidUpdate(prevProps) {
      if (!prevProps.profile && this.props.profile) {
        this.initializePage();
      }
  }
  
  render() {
      if (!this.state.Page) return null;
      return (
        <div>
            <div className="header"></div>
            <this.state.Page>
            </this.state.Page>
        </div>
      );
  }
};

const mapStateToProps = state => ({
    profile: state.renterProfile
});

export default connect(mapStateToProps,
    { fetchRenterProfile }
)(MainContainer);
