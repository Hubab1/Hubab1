import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { currentRouteReceived } from 'reducers/site-config';

import { MOCKY } from 'app/api';
import { fetchApplicant } from 'reducers/applicant';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { ROUTES } from 'app/constants';

// Second param is deprecated in favor of static param 'route'
export default function captureRoute(WrappedComponent, route) {
    // Make sure route is a top level page route! or else you will break relative routing.
    route = WrappedComponent.route || route;
    class Component extends React.Component {
        constructor (props) {
            super(props);
            props.currentRouteReceived(route);
        }
        render() {
            return (
                <WrappedComponent
                    _navigate={
                        async (route) => {
                            if (!MOCKY) {
                                this.props.fetchApplicant();
                                await this.props.fetchRenterProfile();
                            }
                            if (this.props.unitAvailable === false) {
                                return this.props.history.push(ROUTES.UNIT_UNAVAILABLE);
                            } else {
                                return this.props.history.push(route);
                            }
                        }
                    }
                    {...this.props}
                />);
        }
    }

    Component.propTypes = {
        currentRouteReceived: PropTypes.func,
        fetchApplicant: PropTypes.func,
        fetchRenterProfile: PropTypes.func,
        history: PropTypes.object,
    };

    return connect(
        null,
        {currentRouteReceived, fetchApplicant, fetchRenterProfile})
    (Component);
}
