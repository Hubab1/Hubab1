import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MOCKY } from 'config';
import { ROUTES, ROUTES_TOP_LEVEL } from 'constants/constants';
import { setSentryUser } from 'utils/sentry';

import { fetchApplicant } from 'reducers/applicant';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { selectors } from 'reducers/renter-profile';
import { currentRouteReceived } from 'reducers/site-config';
import { generatePath } from 'react-router';

// Second param is deprecated in favor of static param 'route'
export default function withRelativeRoutes(WrappedComponent, route) {
    // Make sure route is a top level page route! or else you will break relative routing.
    if (!ROUTES_TOP_LEVEL.includes(route)) {
        throw Error(`${route} is invalid. Route must be a top level route! Did you mean to use captureRoute?`);
    }
    route = WrappedComponent.route || route;
    console.log({ route });
    class Component extends React.Component {
        constructor(props) {
            super(props);
            // if applicant is done with application, make most routes inaccessible
            this.stayOrPushRoute();
        }

        stayOrPushRoute = () => {
            console.log({ route });
            console.log(' 1 STAY OR PUSH');

            const props = this.props;
            const routeWithApplication =
                props.application && generatePath(route, { application_id: this.props.application.id });

            if (!props.initialPage) {
                console.log('Block render');
                this.blockRender = true;
            } else if (
                props.selectApplicantStillFinishingApplication === false &&
                routeWithApplication !== props.initialPage
            ) {
                console.log('!!!!!Pushing initial page!');
                this.blockRender = true;
                this.props.history.push(props.initialPage);
            } else {
                console.log('----------------currentRouteReceived');
                console.log({ route, routeWithApplication });
                this.blockRender = false;
                props.currentRouteReceived(routeWithApplication);
            }
        };

        componentDidUpdate(prevProps) {
            const props = this.props;
            if (!prevProps.initialPage && props.initialPage) {
                console.log(' 2 STAY OR PUSH');
                this.stayOrPushRoute();
            }

            if (prevProps.applicant !== props.applicant && props.applicant.email && props.applicant.id) {
                setSentryUser(props.applicant);
            }
        }
        render() {
            if (this.blockRender) return null;
            return (
                <WrappedComponent
                    {...this.props}
                    _nextRoute={async () => {
                        if (!MOCKY) {
                            this.props.fetchApplicant();
                            await this.props.fetchRenterProfile();
                        }
                        if (this.props.unitAvailable === false) {
                            return this.props.history.push(ROUTES.UNIT_UNAVAILABLE);
                        } else {
                            return this.props.history.push(this.props._next);
                        }
                    }}
                    _prevRoute={() => this.props.history.push(this.props._prev)}
                />
            );
        }
    }

    Component.propTypes = {
        history: PropTypes.object,
        _next: PropTypes.string,
        _prev: PropTypes.string,
        initialPage: PropTypes.string,
        unitAvailable: PropTypes.bool,
        applicant: PropTypes.object,
        selectApplicantStillFinishingApplication: PropTypes.bool,
        fetchApplicant: PropTypes.func,
        fetchRenterProfile: PropTypes.func,
        currentRouteReceived: PropTypes.func,
    };

    const mapStateToProps = (state) => ({
        _next: selectors.selectNextRoute(state),
        _prev: selectors.selectPrevRoute(state),
        initialPage: selectors.selectInitialPage(state),
        unitAvailable: state.renterProfile?.unit_available,
        applicant: state.applicant,
        selectApplicantStillFinishingApplication: selectors.selectApplicantStillFinishingApplication(state),
        application: state.renterProfile,
    });

    return connect(mapStateToProps, { currentRouteReceived, fetchApplicant, fetchRenterProfile })(Component);
}
