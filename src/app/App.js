import { connect } from 'react-redux';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';

import Main from 'app/Main';
import BadRoute from 'components/common/BadRoute';
import { basenameReceived } from 'reducers/site-config';
import { DOES_NOT_EXIST } from './constants';

export class App extends Component {
    componentDidMount() {
        const basename = window.location.pathname.split('/')[1];
        const siteConfig = {};
        siteConfig.basename = basename;

        const params = queryString.parse(window.location.search);
        siteConfig.hash = params.v;

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
        if (this.badRoute()) return <BadRoute />;
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
    basenameReceived: PropTypes.func.isRequired,
    basename: PropTypes.string.isRequired,
    configuration: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ basename: state.siteConfig.basename, configuration: state.configuration });
const mapDispatchToProps = { basenameReceived };
export default connect(mapStateToProps, mapDispatchToProps)(App);
