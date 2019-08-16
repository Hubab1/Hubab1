import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { NAV_ROUTES } from 'app/constants';

const useStyles = makeStyles(theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

export function VerticalLinearStepper(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    function onClickRoute (e, route, i) {
        e.stopPropagation();
        props.history.push(route.value)
        if (i != null) {
            setActiveStep(i);
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {NAV_ROUTES.map((route, i) => (
                    <Step key={route.name} onClick={(e) => onClickRoute(e, route, i)}>
                        <StepLabel>{route.name}</StepLabel>
                        <StepContent>
                            {
                                !!route.subRoutes && (
                                    <List>
                                        {
                                            route.subRoutes.map((subRoute) => (
                                                <ListItem button key={subRoute.value} onClick={(e)=>onClickRoute(e, subRoute)}>
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
        </div>
    );
}

export default withRouter(VerticalLinearStepper)
