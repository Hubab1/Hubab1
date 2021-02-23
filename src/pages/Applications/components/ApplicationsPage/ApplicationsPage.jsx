import React, { useMemo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES } from 'app/constants';
import { useApplications } from 'hooks';
import Page from 'components/common/Page/Page';
import Application from '../Application/Application';

export const ERROR_MESSAGE = "Oops, we're having trouble obtaining your applications. Please try again later.";

const useStyles = makeStyles(() => ({
    root: {
        textAlign: 'left',
    },
    section: {
        marginBottom: 32,

        '& h3': {
            marginBottom: 16,
            fontSize: 18,
            color: '#454B57',
        },
        '& h4': {
            fontSize: 16,
            color: '#828796',
        },
    },
}));

const byLastActivitySorter = (a, b) => {
    return new Date(b.lastActivity) - new Date(a.lastActivity);
};

export function ApplicationsPage() {
    const classes = useStyles();
    const { loading, error, applications } = useApplications();
    const notification = error && {
        type: 'error',
        messages: ERROR_MESSAGE,
    };

    const [active, past] = useMemo(() => {
        return [
            applications
                .filter((application) => ACTIVE_APPLICATION_STATUSES.includes(application.status))
                .sort(byLastActivitySorter),
            applications
                .filter((application) => PAST_APPLICATION_STATUSES.includes(application.status))
                .sort(byLastActivitySorter),
        ];
    }, [applications]);

    const [showActiveEmptyState, showPastEmptyState] = useMemo(() => {
        return [!error && active.length === 0, !error && past.length === 0];
    }, [error, active, past]);

    return (
        <Page className={classes.root} title="My Applications" notification={notification} loading={loading}>
            <div className={classes.section}>
                <Typography variant="h3">Active Applications</Typography>
                {active.map((application) => {
                    return <Application key={application.id} application={application} isActive />;
                })}
                {showActiveEmptyState && (
                    <Typography variant="h4">{`You don't have any active applications.`}</Typography>
                )}
            </div>
            <div className={classes.section}>
                <Typography variant="h3">Past Applications</Typography>
                {past.map((application) => {
                    return <Application key={application.id} application={application} isActive={false} />;
                })}
                {showPastEmptyState && <Typography variant="h4">{`You don't have any past applications.`}</Typography>}
            </div>
        </Page>
    );
}

export default ApplicationsPage;
