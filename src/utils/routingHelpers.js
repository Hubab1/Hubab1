import { ROUTES } from 'constants/constants';

export const getLeaseSettingsIdFromUrl = () => {
    const leaseSettingsId = window.location.pathname.split('/')[1];
    return leaseSettingsId;
};

export const getApplicationIdFromUrl = () => {
    const applicationIdFromUrl = window.location.pathname.split('/')[3];
    return applicationIdFromUrl;
};

export const getInitialRoute = (applicant, configuration, accessedAppByInvitationOrWebsite, initialApplicationPage) => {
    const applicationIdFromUrl = getApplicationIdFromUrl();
    const applicationIdFromConfiguration = configuration?.application_id;

    if (applicationIdFromUrl || applicationIdFromConfiguration) {
        return initialApplicationPage;
    }

    if (accessedAppByInvitationOrWebsite && applicant?.num_active_applications > 0) {
        return ROUTES.APPLICATIONS;
    }

    if (!applicationIdFromUrl && applicant?.num_active_applications > 1) {
        return ROUTES.APPLICATIONS;
    }

    return initialApplicationPage;
};
