import MobileDetect from 'mobile-detect';

const md = new MobileDetect(window.navigator.userAgent);

export const isMobile = md.phone() !== null;
export const isTablet = md.phone() !== null;
export const isMobileOrTable = isMobile || isTablet;
export const isDesktop = !isMobileOrTable;
