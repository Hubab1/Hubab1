import React from 'react';
import { makeStyles } from '@material-ui/core';

import useApplications from 'hooks/useApplications';
import Page from 'components/common/Page/Page';
import { H3 } from 'assets/styles';

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

    const { loading, error, applications } = useApplications();
    // eslint-disable-next-line no-console
    console.log({ loading, error, applications });

    return (
        <Page className={classes.root} title="My Applications">
            <div className={classes.section}>
                <H3>Active Applications</H3>
            </div>
            <div className={classes.section}>
                <H3>Past Applications</H3>
            </div>
        </Page>
    );
}

ApplicationsPage.propTypes = {
    // TODO: will be used in follow up PR
};

export default ApplicationsPage;
