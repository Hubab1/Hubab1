import { ALL_ROUTES } from 'constants.js';

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

export const buildRoute = (curUrl, nextUrl) => {
    // handle trailing slashes
    if (curUrl.charAt(curUrl.length-1) === '/') {
        return `${curUrl}${nextUrl}`;
    } else {
        return `${curUrl}/${nextUrl}`;
    }
}
