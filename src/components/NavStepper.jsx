import React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { MOCKY } from 'app/api';
import { selectors } from 'reducers/renter-profile';
import { actions } from 'reducers/store';
import { prettyFormatPhoneNumber } from 'utils/misc';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
}));
const iconRoot = css`
    align-items: flex-start !important;
    .appCompletedMsg {
        color: #828796;
    }
`

const viewProgress = css`
    margin-top: 30px !important;
    width: 192px;
    border-radius: 30px !important;
    text-transform: none !important;
    font-size: 16px !important;
`

export function getStepperIndex(routes, currentRoute) {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.value === currentRoute) return i;
        if (route.subRoutes && getStepperIndex(route.subRoutes, currentRoute) !== -1) return i;
    }
    return -1;
}

export function VerticalLinearStepper(props) {
    const classes = useStyles();

    const activeStep = getStepperIndex(props.navRoutes, props.currentRoute);
    const firstUncompletedStep = getStepperIndex(props.navRoutes, props.initialPage);
    function onClickRoute (e, route, i) {
        e.stopPropagation();
        if (i <= firstUncompletedStep || MOCKY) {
            props.history.push(route.value);
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {props.applicantStillFinishingApplication && props.navRoutes.map((route, i) => (
                    <Step key={route.name} onClick={(e) => onClickRoute(e, route, i)} active={!!route.subRoutes || activeStep === i}>
                        <StepLabel completed={i < firstUncompletedStep}>{route.name}</StepLabel>
                    </Step>
                ))}
                {!props.applicantStillFinishingApplication &&
                    <Step active>
                        <StepLabel completed classes={{root: iconRoot}}>
                            <span className="appCompletedMsg">Your application has been completed and submitted. Please call us at&nbsp;
                                <a href={`tel:${props.config.community.contact_phone}`}>
                                    {prettyFormatPhoneNumber(props.config.community.contact_phone)}
                                </a> if you have any questions.
                            </span>
                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                classes={{
                                    root: viewProgress
                                }}
                                onClick={() => props.history.push(props.initialPage)}
                            >View Progress</Button>
                        </StepLabel>

                    </Step>
                }
            </Stepper>
        </div>
    );
}

const mapDispatchToProps = {
    logout: actions.logout
};

const mapStateToProps = state => ({
    navRoutes: selectors.selectNav(state),
    currentRoute: state.siteConfig.currentRoute,
    initialPage: selectors.selectInitialPage(state),
    applicantStillFinishingApplication: selectors.selectApplicantStillFinishingApplication(state),
    renterProfile: state.renterProfile,
    config: state.configuration,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VerticalLinearStepper));
