export const mockWindowLocation = (mockLocation = {}) => {
    const location = { ...window.location };
    delete window.location;
    window.location = {
        ...location,
        ...mockLocation,
    };
};
