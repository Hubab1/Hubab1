import React from 'react';
import { connect } from 'react-redux';

import { Banner, BlueButton, page, Link } from '../../assets/index';
import { nextScreen, selectors } from '../../reducers/nav/reducer';

export class Page extends React.Component {
    changeScreen = () => {
        this.props.nextScreen();
    }

    render () {
        return (
            <div className={page}>
                <Banner>555 Waverly</Banner>
                {this.props.children}
                <BlueButton onClick={this.changeScreen}>{this.props.buttonText}</BlueButton>
                <br/>
                <br/>
                <Link>Go Back</Link>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    buttonText: selectors.getCurrentScreen(state).buttonText
});

export default connect(mapStateToProps, {nextScreen})(Page);