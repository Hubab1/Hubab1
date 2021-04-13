import { connect } from 'react-redux';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';

import { DOES_NOT_EXIST } from 'constants/constants';
import { basenameReceived } from 'reducers/site-config';

import Main from './Main';
import ScrollToTop from 'common-components/ScrollToTop/ScrollToTop';
import NotFoundPage from 'pages/NotFound';

export class App extends Component {
    componentDidMount() {
        const basename = window.location.pathname.split('/')[1];
        const siteConfig = {};
        siteConfig.basename = basename;

        const params = queryString.parse(window.location.search);
        siteConfig.hash = params.v;

        console.log({
            'window.location.pathname: ': window.location.pathname,
            basename
        })

        this.props.basenameReceived(siteConfig);
    }

    badRoute() {
        return (
            !this.props.basename ||
            this.props.basename === '/' ||
            this.props.configuration.error_type === DOES_NOT_EXIST
        );
    }

    render() {
        if (this.badRoute()) return <NotFoundPage />;

        return (
            <div className="App">
                <BrowserRouter basename={this.props.basename}>
                    <ScrollToTop />
                    <Main />
                </BrowserRouter>
            </div>
        );
    }
}

App.propTypes = {
    basenameReceived: PropTypes.func.isRequired,
    basename: PropTypes.string.isRequired,
    configuration: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ basename: state.siteConfig.basename, configuration: state.configuration });
const mapDispatchToProps = { basenameReceived };
export default connect(mapStateToProps, mapDispatchToProps)(App);
