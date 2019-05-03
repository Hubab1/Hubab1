import 'assets/styles';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Main from './Main';
import BadRoute from 'components/common/BadRoute';
import { basenameReceived } from 'reducers/site-config';

export class App extends Component {
    componentDidMount () {
        let basename;
        if (window.location.pathname === '/') {
            basename = window.location.pathname;
        } else {
            basename = window.location.pathname.split('/').filter(token => !!token)[0];
        }
        this.props.basenameReceived(basename);

    }
    
    render() {
        if (!this.props.basename || this.props.basename === '/') return <BadRoute/>;
        return (
            <div className="App">
                <BrowserRouter basename={this.props.basename}>
                    <Main/>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(state => ({basename: state.siteConfig.basename}),{basenameReceived})(App);