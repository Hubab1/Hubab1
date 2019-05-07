import { connect } from 'react-redux';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Main from './Main';
import BadRoute from 'components/common/BadRoute';
import { basenameReceived } from 'reducers/site-config';

export class App extends Component {
    componentDidMount () {
        const basename = window.location.pathname.split('/')[1];
        console.log(basename)
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

const mapStateToProps = state => ({basename: state.siteConfig.basename});
const mapDispatchToProps = {basenameReceived};
export default connect(mapStateToProps,mapDispatchToProps)(App);
