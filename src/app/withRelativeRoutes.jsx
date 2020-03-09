import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MOCKY } from 'app/api';
import { fetchApplicant } from 'reducers/applicant';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { selectors } from 'reducers/renter-profile';
import { currentRouteReceived } from 'reducers/site-config';

export default function withRelativeRoutes(WrappedComponent, route) {
    class Component extends React.Component {
        constructor (props) {
            super(props);
            // if applicant is done with application, make most routes inaccessible
            this.stayOrPushRoute();
        }
        stayOrPushRoute = () => {
            const props = this.props;
            if (!props.initialPage) {
                this.blockRender = true;
            } else if (!props.selectApplicantStillFinishingApplication && route !== props.initialPage) {
                this.blockRender = true;
                this.props.history.push(props.initialPage);
            } else {
                this.blockRender = false;
                props.currentRouteReceived(route);
            }
        }
        componentDidUpdate(prevProps) {
            const props = this.props;
            if (!prevProps.initialPage && props.initialPage) {
                this.stayOrPushRoute();
            }
        }
        render() {
            if (this.blockRender) return null;
            return <WrappedComponent {...this.props}
                _nextRoute={()=>{
                    if (!MOCKY) {
                        this.props.fetchApplicant();
                        this.props.fetchRenterProfile();
                    }
                    return this.props.history.push(this.props._next)
                }}
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
        initialPage: selectors.selectInitialPage(state),
        selectApplicantStillFinishingApplication: selectors.selectApplicantStillFinishingApplication(state),
    });

    return connect(mapStateToProps, {currentRouteReceived, fetchApplicant,  fetchRenterProfile})(Component);
}
