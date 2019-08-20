import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { ROUTES } from 'app/constants';
import { selectors } from 'reducers/renter-profile';
import { actions } from 'reducers/store';

const useStyles = makeStyles(theme => ({
    root: {
        width: '90%',
    },
}));

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

    function logout () {
        localStorage.clear();
        props.logout();
        props.history.push(ROUTES.LOGIN)
    }

    const activeStep = getStepperIndex(props.navRoutes, props.currentRoute);
    const firstUncompletedStep = getStepperIndex(props.navRoutes, props.initialPage);
    function onClickRoute (e, route, i) {
        e.stopPropagation();
        if (i <= firstUncompletedStep) {
            props.history.push(route.value);
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {props.navRoutes.map((route, i) => (
                    <Step key={route.name} onClick={(e) => onClickRoute(e, route, i)}>
                        <StepLabel completed={i < firstUncompletedStep}>{route.name}</StepLabel>
                        <StepContent>
                            {
                                !!route.subRoutes && (
                                    <List>
                                        {
                                            route.subRoutes.map(subRoute => (
                                                <ListItem button key={subRoute.value} onClick={(e)=>onClickRoute(e, subRoute, i)}>
                                                    <ListItemText primary={subRoute.name} />
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                )
                            }
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            <ListItem button onClick={logout}>
                <ListItemText primary="Logout" />
            </ListItem>
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
    renterProfile: state.renterProfile
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VerticalLinearStepper));
