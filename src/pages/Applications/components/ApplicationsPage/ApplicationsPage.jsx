import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';

import {
    ACTIVE_APPLICATION_STATUSES,
    PAST_APPLICATION_STATUSES,
} from 'app/constants';
import useApplicationRoles from 'hooks/useApplicationRoles';
import Page from 'components/common/Page/Page';
import Application from '../Application/Application';
import { H3 } from 'assets/styles';

export const ERROR_MESSAGE = 'Oops, we\'re having trouble obtaining your applications. Please try again later.';

const useStyles = makeStyles(() => ({
    root: {
        textAlign: 'left',
    },
    section: {
        marginBottom: 32,

        '& h3': {
            marginBottom: 16,
        },
    },
}));

// TODO: page will get populated in a follow up pr
export function ApplicationsPage() {
    const classes = useStyles();
    const { error, applicationRoles } = useApplicationRoles();
    const notification = error && {
        type: 'error',
        messages: ERROR_MESSAGE
    };

    console.log({ applicationRoles });

    // TODO: test empty states
    const [active, past] = useMemo(() => {
        return [
            applicationRoles,
            applicationRoles
        ];
    }, [applicationRoles]);

    return (
        <Page
            className={classes.root}
            title="My Applications"
            notification={notification}
        >
            <div className={classes.section}>
                <H3>Active Applications</H3>
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
            </div>
        </Page>
    );
}

export default ApplicationsPage;
