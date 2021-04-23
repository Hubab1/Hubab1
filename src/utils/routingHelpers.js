import auth from 'utils/auth';
import { ROUTES } from 'constants/constants';

export const getLeaseSettingsIdFromUrl = () => {
    const leaseSettingsId = window.location.pathname.split('/')[1];
    return leaseSettingsId;
};

export const getApplicationIdFromUrl = () => {
    const applicationIdFromUrl = window.location.pathname.split('/')[3];
    return applicationIdFromUrl;
};

export const getApplicationIsInWrongCommunityEnv = (application) => {
    const leaseSettingsIdFromUrl = getLeaseSettingsIdFromUrl();

    if (String(leaseSettingsIdFromUrl) !== String(application.lease_settings)) {
        return true;
    }

    return false;
};

/**
 * Get Initial route
 *  - When we do know what application the applicant is trying to access
 *    (the application id is part of the url or is present in the configuration).
 *    Then we return to the initial page of that application.
 *
 *  - When the applicant has multiple active applications, and either applied for another one, or got invited to another one.
 *    Then we return the applications page, where the new application can be started.
 *
 *  - When we don't know what application the applicant is trying to access but does have multiple active applications.
 *    Then we return the applications page so that the applicant can choose the application.
 *
 *  - When the applicant is accessing the app with an application of another community.
 *    Then we return to the applications page, where applicant can switch between community environments.
 *
 *  - When none of the above.
 *    Then we 'fallback' by returning the initial page of the application.
 */
export const getInitialRoute = (
    applicant,
    application,
    configuration,
    accessedAppByInvitationOrWebsite,
    initialApplicationPage
) => {
    const applicationIdFromUrl = getApplicationIdFromUrl();
    const applicationIdFromConfiguration = configuration?.application_id;

    if (applicationIdFromUrl || applicationIdFromConfiguration) {
        return initialApplicationPage;
    }

    if (accessedAppByInvitationOrWebsite && applicant?.num_active_applications > 0) {
        return ROUTES.APPLICATIONS;
    }

    if (!applicationIdFromUrl && !applicationIdFromConfiguration && applicant?.num_active_applications > 1) {
        return ROUTES.APPLICATIONS;
    }

    if (getApplicationIsInWrongCommunityEnv(application)) {
        return ROUTES.APPLICATIONS;
    }

    return initialApplicationPage;
};

export const switchToApplicationCommunityEnv = (application, initialPage) => {
    auth.setScope(application.lease_settings);
    const initialApplicationPageOtherCommunity = `${window.location.origin}/${application.lease_settings}${initialPage}`;
    window.location = initialApplicationPageOtherCommunity;
};
