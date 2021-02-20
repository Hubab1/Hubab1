import React from 'react';
// TODO: will be used in follow up PR
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

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

export function ApplicationsPage() {
    const classes = useStyles();

    return (
        <Page className={classes.root} header="My Applications">
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
