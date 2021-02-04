import DetectRTC from 'detectrtc';

export const isMobileOrTable = DetectRTC.isMobileDevice;
export const isDesktop = !isMobileOrTable;
