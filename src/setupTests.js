import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import enableHooks from 'jest-react-hooks-shallow';
import 'utils/configureYup';

// https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server
React.useLayoutEffect = React.useEffect;

configure({ adapter: new Adapter() });
enableHooks(jest, { dontMockByDefault: true });

// Mock hooks, issue: https://stackoverflow.com/questions/53162001/typeerror-during-jests-spyon-cannot-set-property-getrequest-of-object-which
jest.mock('hooks', () => ({
    useApplicationRoles: jest.fn(),
}));

const setupGoogleMock = () => {
    const google = {
        maps: {
            places: {
                AutocompleteService: class {},
                PlacesServiceStatus: {
                    INVALID_REQUEST: 'INVALID_REQUEST',
                    NOT_FOUND: 'NOT_FOUND',
                    OK: 'OK',
                    OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                    REQUEST_DENIED: 'REQUEST_DENIED',
                    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                    ZERO_RESULTS: 'ZERO_RESULTS',
                },
            },
            Geocoder: class {},
            GeocoderStatus: {
                ERROR: 'ERROR',
                INVALID_REQUEST: 'INVALID_REQUEST',
                OK: 'OK',
                OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                REQUEST_DENIED: 'REQUEST_DENIED',
                UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                ZERO_RESULTS: 'ZERO_RESULTS',
            },
        },
    };

    global.window.google = google;
};

beforeAll(() => {
    setupGoogleMock();
});
