import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { currentRouteReceived } from 'reducers/site-config';

import { fetchApplicant } from 'reducers/applicant';
import { fetchRenterProfile } from 'reducers/renter-profile';

// Second param is deprecated in favor of static param 'route'
export default function captureRoute(WrappedComponent, route) {
    // Make sure route is a top level page route! or else you will break relative routing.
    route = WrappedComponent.route || route;
    class Component extends React.Component {
        constructor(props) {
            super(props);
            props.currentRouteReceived(route);
        }
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    Component.propTypes = {
        currentRouteReceived: PropTypes.func,
        fetchApplicant: PropTypes.func,
        fetchRenterProfile: PropTypes.func,
        history: PropTypes.object,
        unitAvailable: PropTypes.bool,
    };

    return connect(null, { currentRouteReceived, fetchApplicant, fetchRenterProfile })(Component);
}
