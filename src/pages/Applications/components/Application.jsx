import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import { isEmpty } from 'lodash';
import clsx from 'clsx';
import {
    makeStyles,
    Card,
    CardHeader,
    CardContent,
    Collapse,
    IconButton,
    Typography,
    Divider,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcone } from '@material-ui/icons';
import ErrorIcon from '@material-ui/icons/Error';

import API from 'api/api';
import {
    APPLICATION_STATUSES_LABELS,
    APPLICANT_ROLE_LABELS,
    APPLICATION_STATUSES_COLORS,
    APPLICATION_STATUS_DENIED,
} from 'constants/constants';
import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { actions as loaderActions } from 'reducers/loader';

import ActionButton from 'common-components/ActionButton/ActionButton';

export const ERROR_MESSAGE = 'Oops, something went wrong. Please try again later.';

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(2),
        '&:last-child': {
            marginBottom: 0,
        },
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    divider: {
        margin: theme.spacing(0, 2),
    },
    typography: {
        color: '#828796',
        marginBottom: theme.spacing(0.5),

        '& span': {
            color: 'black',
        },
    },
    title: {
        color: '#000',
    },
    applicationId: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    inviteeNotice: {
        display: 'flex',
        alignItems: 'center',
        color: '#f44336',
        '& span': {
            paddingLeft: '5px',
        },
    },
}));

export function Application({
    application = {},
    isActive = true,
    fetchRenterProfile,
    initialPage,
    history,
    invitee,
    toggleLoader,
    setError,
}) {
    const { id, status, lease_start_date, lease_term, fees_breakdown, role, unit, community } = application;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(isActive);
    const title = unit?.unit_number ? `${community.display_name}, #${unit.unit_number}` : community.display_name;

    const handleExpandClick = useCallback(() => {
        setExpanded(!expanded);
    }, [expanded]);

    const [appSelected, setAppSelected] = useState(false);

    useEffect(() => {
        if (initialPage && appSelected) {
            setAppSelected(false);
            history.push(initialPage);
        }
    }, [initialPage, appSelected, history]);

    const handleApplicationClick = async (applicationId) => {
        if (invitee) {
            try {
                toggleLoader(true);

                const response = await API.createApplicantRole(invitee.id);

                if (response?.errors) {
                    return setError(ERROR_MESSAGE);
                }

                await fetchRenterProfile(applicationId);
                setAppSelected(true);
            } catch {
                return setError(ERROR_MESSAGE);
            } finally {
                toggleLoader(false);
            }
        } else {
            await fetchRenterProfile(applicationId);
            setAppSelected(true);
        }
    };

    if (isEmpty(application)) {
        return null;
    }

    const showOpenApplicationButton = isActive || application.status === APPLICATION_STATUS_DENIED;
    const CTALabel = invitee ? 'Start Application' : 'Go To Application';
    const CTAVariant = invitee ? 'contained' : 'outlined';

    return (
        <Card className={classes.root} elevation={2}>
            <CardHeader
                data-testid="header"
                title={
                    <Typography className={clsx(classes.typography, classes.title)} variant="body1">
                        <b>{title}</b>
                    </Typography>
                }
                subheader={
                    <Typography className={classes.typography} variant="body1">
                        Application Status:{' '}
                        <span style={{ color: APPLICATION_STATUSES_COLORS[status] }}>
                            {APPLICATION_STATUSES_LABELS[status]}
                        </span>
                    </Typography>
                }
                action={
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                    >
                        <ExpandMoreIcone />
                    </IconButton>
                }
            />
            <Collapse in={expanded}>
                <Divider className={classes.divider} />
                <CardContent data-testid="content">
                    {invitee && (
                        <p className={classes.inviteeNotice}>
                            <ErrorIcon />
                            <span>You’ve been invited to apply for this unit.</span>
                        </p>
                    )}
                    <Typography className={classes.typography} variant="body1">
                        Move in Date:{' '}
                        <span>{lease_start_date ? moment(lease_start_date).format('MM/DD/YYYY') : '---'}</span>
                    </Typography>
                    <Typography className={classes.typography} variant="body1">
                        Lease Term: <span>{lease_term ? lease_term : '---'}</span>
                    </Typography>
                    <Typography className={classes.typography} variant="body1">
                        Monthly Rent:{' '}
                        <span>
                            {fees_breakdown?.monthly_fees?.total ? `$${fees_breakdown.monthly_fees.total}` : '---'}
                        </span>
                    </Typography>
                    <Typography className={classes.typography} variant="body1">
                        Role: <span>{`${APPLICANT_ROLE_LABELS[role || invitee.role]}`}</span>
                    </Typography>
                    <Typography className={classes.applicationId} variant="caption">
                        Application ID <span>{id}</span>
                    </Typography>
                    {showOpenApplicationButton && (
                        <ActionButton
                            variant={CTAVariant}
                            marginTop={20}
                            marginBottom={10}
                            onClick={() => handleApplicationClick(id)}
                        >
                            {CTALabel}
                        </ActionButton>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    );
}

Application.propTypes = {
    application: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        status: PropTypes.number.isRequired,
        lease_start_date: PropTypes.string,
        lease_term: PropTypes.number,
        fees_breakdown: PropTypes.object,
        role: PropTypes.number.isRequired,
        unit: PropTypes.object,
        community: PropTypes.object.isRequired,
    }),
    isActive: PropTypes.bool,
    invitee: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        role: PropTypes.number.isRequired,
    }),
    initialPage: PropTypes.string,
    communityId: PropTypes.number,
    history: PropTypes.object,
    fetchRenterProfile: PropTypes.func,
    setError: PropTypes.func,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    communityId: state.siteConfig.basename,
    initialPage: selectors.selectDefaultInitialPage(state),
});

const mapDispatchToProps = {
    fetchRenterProfile,
    toggleLoader: loaderActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Application));
