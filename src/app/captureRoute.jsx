import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors } from 'reducers/renter-profile';
import { currentRouteReceived } from 'reducers/site-config';

export default function captureRoute(WrappedComponent, route) {
    class Component extends React.Component {
        constructor (props) {
            super(props);
            props.currentRouteReceived(route);
        }
        render() {
            return <WrappedComponent {...this.props}
                _nextRoute={()=>this.props.history.push(this.props._next)}
                _prevRoute={()=>this.props.history.push(this.props._prev)} 
            />;
        }
    };

    Component.propTypes = {
        history: PropTypes.object
    }

    const mapStateToProps = state => ({
        _next: selectors.selectNextRoute(state),
        _prev: selectors.selectPrevRoute(state),
    });

    return connect(mapStateToProps, {currentRouteReceived})(Component);
}