import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';

import { ACTIVE_APPLICATION_STATUSES, APPLICANT_ROLE_VALUES, PAST_APPLICATION_STATUSES } from 'constants/constants';
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

export const getAlreadyHasActiveApplicationForCommuntiyAsPrimaryError = (
    applicant,
    applications,
    community,
    unit,
    accessedAppByInvitationOrWebsite
) => {
    if (!accessedAppByInvitationOrWebsite || !community || !unit) return;
    if (applications?.length === 0) return;

    const activeApplicationsForCommunityAsPrimary = applications.filter((a) => {
        return (
            a.primary_applicant.id === applicant.id &&
            a.role === APPLICANT_ROLE_VALUES.ROLE_PRIMARY_APPLICANT &&
            a.community.id === community.id && ACTIVE_APPLICATION_STATUSES.includes(a.status)
        );
    });

    if (activeApplicationsForCommunityAsPrimary?.length > 0) {
        return (
            <span>
                Oops, it looks like you already have an active application for {community.display_name}. Please continue
                your application for unit {unit.unit_number}, or call our office at {community.contact_phone} if you
                would like to start another application at {community.display_name}.
            </span>
        );
    }
};

export function ApplicationsPage({ applicant, community, unit, accessedAppByInvitationOrWebsite }) {
    const classes = useStyles();
    const { loading, error, applications } = hooks.useApplications(ERROR_MESSAGE);
    const alreadyHasActiveApplicationForCommuntiyAsPrimaryError = useMemo(() => {
        return getAlreadyHasActiveApplicationForCommuntiyAsPrimaryError(
            applicant,
            applications,
            community,
            unit,
            accessedAppByInvitationOrWebsite
        );
    }, [applicant, applications, community, unit, accessedAppByInvitationOrWebsite]);

    const notification = (error || alreadyHasActiveApplicationForCommuntiyAsPrimaryError) && {
        type: 'error',
        messages: error || alreadyHasActiveApplicationForCommuntiyAsPrimaryError,
    };

    const [active, past] = useMemo(() => {
        return [
            applications.filter((application) => ACTIVE_APPLICATION_STATUSES.includes(application.status)),
            applications.filter((application) => PAST_APPLICATION_STATUSES.includes(application.status)),
        ];
    }, [applications]);

    const [showActiveEmptyState, showPastEmptyState] = useMemo(() => {
        return [!error && active.length === 0, !error && past.length === 0];
    }, [error, active, past]);

    return (
        <Page className={classes.root} title="My Applications" notification={notification} loading={loading}>
            <div data-testid="active-applications" className={classes.section}>
                <Typography variant="h3">Active Applications</Typography>
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

ApplicationsPage.propTypes = {
    applicant: PropTypes.object.isRequired,
    community: PropTypes.object,
    unit: PropTypes.object,
    accessedAppByInvitationOrWebsite: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    community: state.configuration?.community,
    unit: state.configuration?.unit,
    accessedAppByInvitationOrWebsite: Boolean(state.siteConfig.hash),
});

const mapActionsToProps = null;

export default connect(mapStateToProps, mapActionsToProps)(ApplicationsPage);
