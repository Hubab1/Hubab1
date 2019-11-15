import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { currentRouteReceived } from 'reducers/site-config';

export default function captureRoute(WrappedComponent, route) {
    class Component extends React.Component {
        constructor (props) {
            super(props);
            props.currentRouteReceived(route);
        }
        render() {
            return <WrappedComponent {...this.props} />;
        }
    };

    Component.propTypes = {
        currentRouteReceived: PropTypes.func
    }

    return connect(null, {currentRouteReceived})(Component);
}