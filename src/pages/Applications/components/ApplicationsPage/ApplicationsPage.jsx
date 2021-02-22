import React, { useMemo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { ACTIVE_APPLICATION_STATUSES, PAST_APPLICATION_STATUSES } from 'app/constants';
import { useApplicationRoles } from 'hooks';
import Page from 'components/common/Page/Page';
import Application from '../Application/Application';
import { H3 } from 'assets/styles';

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

    sectionSubTitle: {},
}));

export function ApplicationsPage() {
    const classes = useStyles();
    const { error, applicationRoles } = useApplicationRoles();
    const notification = error && {
        type: 'error',
        messages: ERROR_MESSAGE,
    };

    const [active, past] = useMemo(() => {
        return [
            applicationRoles.filter(({ application }) => ACTIVE_APPLICATION_STATUSES.includes(application.status)),
            applicationRoles.filter(({ application }) => PAST_APPLICATION_STATUSES.includes(application.status)),
        ];
    }, [applicationRoles]);

    const [showActiveEmptyState, showPastEmptyState] = useMemo(() => {
        return [!error && active.length === 0, !error && past.length === 0];
    }, [error, active, past]);

    console.log({
        error,
        applicationRoles,
        active,
        past,
    });

    return (
        <Page className={classes.root} title="My Applications" notification={notification}>
            <div className={classes.section}>
                <Typography variant="h3">Active Applications</Typography>
                {active.map((applicationRole, i) => {
                    return (
                        <Application
                            key={i}
                            application={applicationRole.application}
                            role={applicationRole.role}
                            isActive
                        />
                    );
                })}
                {showActiveEmptyState && (
                    <Typography variant="h4">{`You don't have any active applications.`}</Typography>
                )}
            </div>
            <div className={classes.section}>
                <H3>Past Applications</H3>
                {past.map((applicationRole, i) => {
                    return (
                        <Application
                            key={i}
                            application={applicationRole.application}
                            role={applicationRole.role}
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
