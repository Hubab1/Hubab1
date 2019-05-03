import { ALL_ROUTES, FullRoutes } from 'constants.js';

export const nextRoute = (path) => {
    const lastRoute = ALL_ROUTES[ALL_ROUTES.length-1]
    if (lastRoute === path) return null;
    return ALL_ROUTES[ALL_ROUTES.indexOf(path)+1];
}

export const previousRoute = path => {
    const firstRoute = ALL_ROUTES[0];
    if (firstRoute === path) return null;
    return ALL_ROUTES[ALL_ROUTES.indexOf(path)-1];
}

export const getInitialPage = (commId, profile) => {
    if (!profile) return;
    if (!profile.completed_terms_and_conditions) {
        return FullRoutes.TOS;
    } else if (profile.selected_rental_options.length === 0) {
        return FullRoutes.PROFILE_OPTIONS;
    }
}
