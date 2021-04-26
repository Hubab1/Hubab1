import DetectRTC from 'detectrtc';

export const isMobileOrTablet = DetectRTC.isMobileDevice;
export const isDesktop = !isMobileOrTablet;
export const browserName = DetectRTC.browser.name === 'Edge' || 'Chrome' || 'Firefox';
export const browserVersion = DetectRTC.browser.version;
export const osName = DetectRTC.osName;
export const osVersion = DetectRTC.osVersion;
export const isPrivateBrowsing = DetectRTC.browser.isPrivateBrowsing; // incognito or private modes
