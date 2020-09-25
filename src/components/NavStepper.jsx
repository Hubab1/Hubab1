import React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import ErrorIcon from '@material-ui/icons/Error';

import { MOCKY } from 'app/api';
import { selectors } from 'reducers/renter-profile';
import { actions } from 'reducers/store';
import { prettyFormatPhoneNumber } from 'utils/misc';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
    },
}));

const iconRoot = css`
    align-items: flex-start !important;
    .appCompletedMsg {
        color: #828796;
    }
`;

const active = css`
    .MuiStepLabel-active {
        font-weight: bold !important;
    }
`

const accessible = css`
    cursor: pointer !important;
    .Mui-disabled {
        cursor: pointer !important;
    }
`;

const viewProgress = css`
    width: 192px;
    border-radius: 30px !important;
    text-transform: none !important;
    font-size: 16px !important;
    margin: 30px auto !important;
    display: block !important;
`;

export function getStepperIndex(routes, currentRoute) {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.value === currentRoute) return i;
    }
    return -1;
}

export function VerticalLinearStepper(props) {
    const classes = useStyles();

    const activeStep = getStepperIndex(props.navRoutes, props.currentRoute);
    const firstUncompletedStep = getStepperIndex(props.navRoutes, props.initialPage);
    const unitUnavailable = (props.renterProfile?.unit_available === false);
    function onClickRoute (e, route, i) {
        e.stopPropagation();
        if (i <= firstUncompletedStep || MOCKY) {
            props.history.push(route.value);
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {unitUnavailable && !props.guarantorRequested &&
                    <Step active>
                        <StepLabel StepIconComponent={()=><ErrorIcon color='primary'/>} active classes={{root: iconRoot}}>
                            <span className="unitUnavailableMsg">
                                {`We've placed your application on hold for now, since the apartment you were interested in is no longer available. Please call us at `}
                                <a href={`tel:${props.config.community.contact_phone}`}>
                                    {prettyFormatPhoneNumber(props.config.community.contact_phone)}
                                </a> so we can discuss some other options.
                            </span>
                        </StepLabel>
                        <Button
                            variant="outlined"
                            color="default"
                            id="viewProgressButton"
                            classes={{
                                root: viewProgress
                            }}
                            disabled={false}
                            onClick={() => props.history.push(props.initialPage)}
                        >View Progress</Button>
                    </Step>
                }
                {props.applicantStillFinishingApplication && !unitUnavailable && !props.guarantorRequested && props.navRoutes.map((route, i) => (
                    <Step classes={{
                        root: clsx({
                            [active]: activeStep === i,
                            [accessible]: i <= firstUncompletedStep,
                        })}}
                        key={route.name}
                        onClick={(e) => onClickRoute(e, route, i)}
                        active={i === activeStep || i === firstUncompletedStep}
                    >
                        <StepLabel icon={' '} completed={i < firstUncompletedStep}>{route.name}</StepLabel>
                    </Step>
                ))}
                {props.guarantorRequested &&
                    <Step active>
                        <StepLabel
                            StepIconComponent={()=><ErrorIcon color="primary"/>}
                            active
                            classes={{root: iconRoot}}
                        >
                            <span className="appCompletedMsg">We’re waiting for you to add a guarantor. Please call us at&nbsp;
                                <a href={`tel:${props.config.community.contact_phone}`}>
                                    {prettyFormatPhoneNumber(props.config.community.contact_phone)}
                                </a> if you have any questions or if you are unable or unwilling to add a guarantor.
                            </span>
                        </StepLabel>
                        <Button
                            variant="outlined"
                            color="primary"
                            id="viewProgressButton"
                            classes={{
                                root: viewProgress
                            }}
                            disabled={false}
                            onClick={() => props.history.push(props.initialPage)}
                        >View Progress</Button>
                    </Step>
                }
                {!props.applicantStillFinishingApplication && !props.guarantorRequested &&
                    <Step active>
                        <StepLabel completed classes={{root: iconRoot}}>
                            <span className="appCompletedMsg">Your application has been completed and submitted. Please call us at&nbsp;
                                <a href={`tel:${props.config.community.contact_phone}`}>
                                    {prettyFormatPhoneNumber(props.config.community.contact_phone)}
                                </a> if you have any questions.
                            </span>
                        </StepLabel>
                        <Button
                            variant="outlined"
                            color="primary"
                            id="viewProgressButton"
                            classes={{
                                root: viewProgress
                            }}
                            disabled={false}
                            onClick={() => props.history.push(props.initialPage)}
                        >View Progress</Button>
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
    guarantorRequested: selectors.selectGuarantorRequested(state),
    renterProfile: state.renterProfile,
    config: state.configuration,
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VerticalLinearStepper));
