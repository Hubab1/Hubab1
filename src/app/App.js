import { connect } from 'react-redux';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import Main from 'app/Main';
import BadRoute from 'components/common/BadRoute';
import { basenameReceived } from 'reducers/site-config';

export class App extends Component {
    componentDidMount() {
        const basename = window.location.pathname.split('/')[1];
        const siteConfig = {};
        siteConfig.basename = basename;

        const params = queryString.parse(window.location.search);
        siteConfig.hash = params.v;

        this.props.basenameReceived(siteConfig);
    }

    render() {
        if (!this.props.basename || this.props.basename === '/') return <BadRoute />;
        return (
            <div className="App">
                <BrowserRouter basename={this.props.basename}>
                    <Main />
                </BrowserRouter>
            </div>
        );
    }
}

App.propTypes = {
    basenameReceived: PropTypes.func,
    basename: PropTypes.func,
};

const mapStateToProps = (state) => ({ basename: state.siteConfig.basename });
const mapDispatchToProps = { basenameReceived };
export default connect(mapStateToProps, mapDispatchToProps)(App);
