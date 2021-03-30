import React, { useMemo } from 'react';
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

    const { loading_applications, error_applications, applications } = hooks.useApplications(ERROR_MESSAGE);
    const { loading_invitations, error_invitations, invitations } = hooks.useInvitations(ERROR_MESSAGE);

    const loading = loading_applications || loading_invitations;
    const error = error_applications || error_invitations;

    const notification = error && {
        type: 'error',
        messages: error,
    };

    const [active, past] = useMemo(() => {
        return [
            applications.filter((application) => ACTIVE_APPLICATION_STATUSES.includes(application.status)),
            applications.filter((application) => PAST_APPLICATION_STATUSES.includes(application.status)),
        ];
    }, [applications]);

    // const [showActiveEmptyState, showPastEmptyState] = useMemo(() => {
    //     return [!error && active.length === 0, !error && past.length === 0];
    // }, [error, active, past]);

    const [showActiveEmptyState, showPastEmptyState] = useMemo(() => {
        return [!error && active.length === 0, !error && past.length === 0, !error && invitations.length === 0];
    }, [error, active, past, invitations]);

    return (
        <Page className={classes.root} title="My Applications" notification={notification} loading={loading}>
            <div data-testid="active-applications" className={classes.section}>
                <Typography variant="h3">Active Applications</Typography>

                {invitations.map((invitee) => {
                    console.log(invitee.application);
                    return (
                        <Application
                            key={invitee.id}
                            application={invitee.application}
                            invitee={{ id: invitee.id, role: invitee.role }}
                            isActive
                        />
                    );
                })}
                {active.map((application) => {
                    return <Application key={application.id} application={application} isActive />;
                })}
                {showActiveEmptyState && (
                    <Typography variant="h4">{`You don't have any active applications.`}</Typography>
                )}
            </div>
            <div data-testid="past-applications" className={classes.section}>
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
