import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import { Banner, page, Link, subPage } from 'assets/emotion/styles';
import { nextScreen, selectors } from 'reducers/nav/reducer';
import { community } from 'constants.js';

export class Page extends React.Component {
    changeScreen = () => {
        this.props.nextScreen();
    }

    render () {
        return (
            <div className={page}>
                <Banner>{community.name}</Banner>
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