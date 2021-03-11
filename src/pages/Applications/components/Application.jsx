import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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

import { APPLICATION_STATUSES_LABELS, APPLICANT_ROLE_LABELS, APPLICATION_STATUSES_COLORS } from 'app/constants';

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
        color: '#828796',
        display: 'block',
        marginTop: theme.spacing(2),
    },
}));

export function Application({ application = {}, isActive = true }) {
    const { id, status, lease_start_date, lease_term, fees_breakdown, role, unit, community } = application;
    const classes = useStyles();
    const [expaneded, setExpanded] = useState(isActive);
    const title = unit?.unit_number ? `${community.display_name}, #${unit.unit_number}` : community.display_name;

    const handleExpandClick = useCallback(() => {
        setExpanded(!expaneded);
    }, [expaneded]);

    if (isEmpty(application)) {
        return null;
    }

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
                            [classes.expandOpen]: expaneded,
                        })}
                        onClick={handleExpandClick}
                    >
                        <ExpandMoreIcone />
                    </IconButton>
                }
            />
            <Collapse in={expaneded}>
                <Divider className={classes.divider} />
                <CardContent data-testid="content">
                    <Typography className={classes.typography} variant="body1">
                        Move in Date:{' '}
                        <span>{lease_start_date ? moment(lease_start_date).format('MM/DD/YYYY') : '-'}</span>
                    </Typography>
                    <Typography className={classes.typography} variant="body1">
                        Lease Term: <span>{lease_term ? lease_term : '-'}</span>
                    </Typography>
                    <Typography className={classes.typography} variant="body1">
                        Monthly Rent:{' '}
                        <span>
                            {fees_breakdown?.monthly_fees?.total ? `$${fees_breakdown.monthly_fees.total}` : '-'}
                        </span>
                    </Typography>
                    <Typography className={classes.typography} variant="body1">
                        Role: <span>{`${APPLICANT_ROLE_LABELS[role]}`}</span>
                    </Typography>
                    <Typography className={classes.applicationId} variant="caption">
                        Application ID <span>{id}</span>
                    </Typography>
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
};

export default Application;
