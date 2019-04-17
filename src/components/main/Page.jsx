import React from 'react';
import { connect } from 'react-redux';

import { Banner, BlueButton, page, Link } from '../../assets/index';
import { nextScreen } from '../../reducers/nav/reducer';

export class Page extends React.Component {
    changeScreen = () => {
        this.props.nextScreen();
    }

    render () {
        return (
            <div className={page}>
                <Banner>555 Waverly</Banner>
                {this.props.children}
                <BlueButton onClick={this.changeScreen}>I Agree to the Terms & Conditions</BlueButton>
                <br/>
                <br/>
                <Link>Go Back</Link>
            </div>
        );
    }
}

export default connect(null, {nextScreen})(Page);