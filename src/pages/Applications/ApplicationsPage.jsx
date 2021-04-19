import React, { useMemo, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES } from 'constants/constants';
import * as hooks from './hooks';
import Page from 'common-components/Page/Page';
import Application from './components/Application';

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

export function ApplicationsPage() {
    const classes = useStyles();
    const [error, setError] = useState(undefined);

    const apps = hooks.useApplications(ERROR_MESSAGE);
    const invitees = hooks.useInvitations(ERROR_MESSAGE);

    const loading = apps.loading || invitees.loading;
    const notificationError = error || apps.error || invitees.error;

    const notification = notificationError && {
        type: 'error',
        messages: notificationError,
    };

    const [active, past] = useMemo(() => {
        return [
            apps.data.filter((application) => ACTIVE_APPLICATION_STATUSES.includes(application.status)),
            apps.data.filter((application) => PAST_APPLICATION_STATUSES.includes(application.status)),
        ];
    }, [apps.data]);

    const [showActiveEmptyState, showPastEmptyState] = useMemo(() => {
        return [!error && active.length === 0, !error && past.length === 0, !error && invitees.data.length === 0];
    }, [error, active, past, invitees.data]);

    return (
        <Page className={classes.root} title="My Applications" notification={notification} loading={loading}>
            <div data-testid="active-applications" className={classes.section}>
                <Typography variant="h3">Active Applications</Typography>
                {invitees.data.map((invitee) => {
                    return (
                        <Application
                            key={invitee.id}
                            application={invitee.application}
                            invitee={{ id: invitee.id, role: invitee.role }}
                            isActive
                            setError={setError}
                        />
                    );
                })}
                {active.map((application) => {
                    return (
                        <Application
                            key={application.id}
                            application={application}
                            setError={setError}
                            isActive
                        />
                    );
                })}
                {showActiveEmptyState && (
                    <Typography variant="h4">{`You don't have any active applications.`}</Typography>
                )}
            </div>
            <div data-testid="past-applications" className={classes.section}>
                <Typography variant="h3">Past Applications</Typography>
                {past.map((application) => {
                    return (
                        <Application
                            key={application.id}
                            application={application}
                            setError={setError}
                            isActive={false}
                        />
                    );
                })}
                {showPastEmptyState && <Typography variant="h4">{`You don't have any past applications.`}</Typography>}
            </div>
        </Page>
    );
}

export default ApplicationsPage;
