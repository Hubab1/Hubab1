import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePath, withRouter } from 'react-router-dom';
import { css } from 'emotion';
import clsx from 'clsx';
import { makeStyles, Stepper, Step, StepLabel } from '@material-ui/core';
import {
    ROUTES,
    MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED,
    MILESTONE_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED,
    MILESTONE_FINANCIAL_STREAM_INCOMPLETE,
} from 'constants/constants';
import { MOCKY } from 'config';

import { NavBlockedCompletedStep, NavBlockedInProgressStep } from 'common-components/NavDrawer/NavBlockedStep';
import { selectors } from 'reducers/renter-profile';
import { actions } from 'reducers/store';

const useStyles = makeStyles(() => ({
    root: {
        padding: 0,
    },
}));

const active = css`
    .MuiStepLabel-active {
        font-weight: bold !important;
    }
`;

const accessible = css`
    cursor: pointer !important;
    .Mui-disabled {
        cursor: pointer !important;
    }
`;

export function getStepperIndex(routes, currentRoute, application) {
    if (!application) return -1;
    if (!routes || routes.length === 0) return -1;

    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (generatePath(route.value, { application_id: application.id }) === currentRoute) {
            return i;
        }
    }
    return -1;
}

export function VerticalLinearStepper(props) {
    const classes = useStyles();

    const activeStep = getStepperIndex(props.navRoutes, props.currentRoute, props.renterProfile);
    const firstUncompletedStep = getStepperIndex(props.navRoutes, props.defaultInitialPage, props.renterProfile);
    const unitUnavailable = props.renterProfile?.unit_available === false;
    const outstandingBalance = props.initialPage === ROUTES.OUTSTANDING_BALANCE;
    const holdingDepositAgreementSignatureRequested = props.initialPage === ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT;
    const additionalDocumentsRequested = props.renterProfile?.events?.find(({ event }) =>
        [
            MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED,
            MILESTONE_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED,
            MILESTONE_FINANCIAL_STREAM_INCOMPLETE,
        ].includes(event)
    );

    function onClickRoute(e, route, i) {
        e.stopPropagation();
        if (i <= firstUncompletedStep || MOCKY) {
            props.history.push(generatePath(route.value, { application_id: props.renterProfile.id }));
        }
    }

    const isNavigationBlocked =
        props.applicantStillFinishingApplication === false ||
        props.guarantorRequested ||
        unitUnavailable ||
        outstandingBalance ||
        holdingDepositAgreementSignatureRequested ||
        additionalDocumentsRequested;

    function renderBlockedStep() {
        if (unitUnavailable && !props.guarantorRequested) {
            return (
                <NavBlockedInProgressStep
                    text={`We've placed your application on hold for now, since the apartment you were interested in is no longer available.`}
                    callUsText={'so we can discuss some other options.'}
                />
            );
        }

        if (holdingDepositAgreementSignatureRequested) {
            return (
                <NavBlockedInProgressStep
                    text={`We’ll need you to agree to the new holding deposit terms.`}
                    handleDrawerClose={props.handleDrawerClose}
                />
            );
        }

        if (props.guarantorRequested) {
            return (
                <NavBlockedInProgressStep
                    text={`We’re waiting for you to add a guarantor.`}
                    callUsText={'if you have any questions or if you are unable or unwilling to add a guarantor.'}
                />
            );
        }

        if (additionalDocumentsRequested) {
            return <NavBlockedInProgressStep text={`We’re requesting additional info to verify your income/assets.`} />;
        }

        if (outstandingBalance) {
            return (
                <NavBlockedInProgressStep
                    text={`You'll be able to move forward with your application once all outstanding balances have been paid.`}
                    handleDrawerClose={props.handleDrawerClose}
                />
            );
        }

        if (props.applicantStillFinishingApplication === false) {
            return (
                <NavBlockedCompletedStep
                    text={'Your application has been completed and submitted.'}
                    handleDrawerClose={props.handleDrawerClose}
                />
            );
        }
    }

    return (
        <Stepper className={classes.root} activeStep={activeStep} orientation="vertical">
            {isNavigationBlocked
                ? renderBlockedStep()
                : props.navRoutes.map((route, i) => (
                      <Step
                          classes={{
                              root: clsx({
                                  [active]: activeStep === i,
                                  [accessible]: i <= firstUncompletedStep,
                              }),
                          }}
                          key={route.name}
                          onClick={(e) => onClickRoute(e, route, i)}
                          active={i === activeStep || i === firstUncompletedStep}
                      >
                          <StepLabel icon={' '} completed={i < firstUncompletedStep}>
                              {route.name}
                          </StepLabel>
                      </Step>
                  ))}
        </Stepper>
    );
}

VerticalLinearStepper.propTypes = {
    navRoutes: PropTypes.array,
    currentRoute: PropTypes.string,
    initialPage: PropTypes.string,
    defaultInitialPage: PropTypes.string,
    renterProfile: PropTypes.object,
    history: PropTypes.object,
    config: PropTypes.object,
    applicantStillFinishingApplication: PropTypes.bool,
    guarantorRequested: PropTypes.bool,
    handleDrawerClose: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    logout: actions.logout,
};

const mapStateToProps = (state) => ({
    navRoutes: selectors.selectNav(state),
    currentRoute: state.siteConfig.currentRoute,
    initialPage: selectors.selectInitialPage(state),
    defaultInitialPage: selectors.selectDefaultInitialPage(state),
    applicantStillFinishingApplication: selectors.selectApplicantStillFinishingApplication(state),
    guarantorRequested: selectors.selectGuarantorRequested(state),
    renterProfile: state.renterProfile,
    config: state.configuration,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VerticalLinearStepper));
