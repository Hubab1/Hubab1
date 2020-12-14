import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import enableHooks from 'jest-react-hooks-shallow';
import 'utils/configureYup';

configure({ adapter: new Adapter() });
enableHooks(jest, { dontMockByDefault: true });

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
