import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import { Banner, BlueButton, page, Link, subPage } from 'assets/index';
import { nextScreen, selectors } from 'reducers/nav/reducer';

export class Page extends React.Component {
    changeScreen = () => {
        this.props.nextScreen();
    }

    render () {
        return (
            <div className={page}>
                <Banner>555 Waverly</Banner>
                <div className={subPage}>
                    {this.props.children}
                    <Button onClick={this.changeScreen} variant="contained" color="primary" type="submit" fullWidth>
                        {this.props.buttonText}
                    </Button>
                    <br/>
                    <br/>
                    <Link>Go Back</Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    buttonText: selectors.getCurrentScreen(state).buttonText
});

export default connect(mapStateToProps, {nextScreen})(Page);