import auth from 'utils/auth';

export const getApplicationIsInWrongCommunityEnv = (application) => {
    const leaseSettingsId = window.location.pathname.split('/')[1];

    console.log('getApplicationIsInWrongCommunityEnv: ', {
        leaseSettingsId,
        'application.lease_settings': application.lease_settings,
    })

    if (Number(leaseSettingsId) !== application.lease_settings) {
        return true;
    }

    return false;
};

export const switchToApplicationCommunityEnv = (application, initialPage) => {
    auth.setScope(application.lease_settings);
    const initialApplicationPageOtherCommunity = `${window.location.origin}/${application.lease_settings}${initialPage}`;
    window.location = initialApplicationPageOtherCommunity;
};
