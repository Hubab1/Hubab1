import React, { Component } from 'react';

import LoginSplash from './LoginSplash';
import LoginPage from './LoginPage';

const pages = [LoginSplash, LoginPage];

class LoginContainer extends Component {
    state = {screen: 0}
    nextPage = () => {
        if (this.state.screen < pages.length) {
            this.setState({screen: this.state.screen + 1});
        }
    }
    
    render() {
        const Page = pages[this.state.screen];
        return (
            <div>
                <Page nextPage={this.nextPage}/>
            </div>
        );
    }
};

export default LoginContainer;
