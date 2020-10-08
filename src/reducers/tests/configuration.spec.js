import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import API from 'app/api';
import {
    fetchConfiguration,
    configurationReceived,
    selectors,
    configurationDoesNotExist,
} from 'reducers/configuration';
import { DOES_NOT_EXIST } from 'app/constants';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('fetchConfiguration', () => {
    it('should only call fetchConfiguration if only communityId is provided', () => {
        const store = mockStore({ configuration: null });
        const configData = { community: 'coolsville' };

        API.fetchConfiguration = jest.fn().mockReturnValue(Promise.resolve(configData));
        API.fetchPersonalizedInfo = jest.fn().mockReturnValue(Promise.resolve());

        const communityId = '1';

        return store.dispatch(fetchConfiguration(communityId)).then(() => {
            expect(API.fetchConfiguration).toHaveBeenCalled();
            expect(API.fetchPersonalizedInfo).not.toHaveBeenCalled();

            expect(store.getActions()).toEqual([configurationReceived(configData)]);
        });
    });

    it('should call fetchConfiguration and fetchPersonalizedInfo if communityId and hash are provided', () => {
        const store = mockStore({ configuration: null });
        const configData = { community: 'coolsville' };

        API.fetchConfiguration = jest.fn().mockReturnValue(Promise.resolve(configData));
        API.fetchPersonalizedInfo = jest.fn().mockReturnValue(Promise.resolve());

        const communityId = '1';
        const hash = { client: 123 };

        return store.dispatch(fetchConfiguration(communityId, hash)).then(() => {
            expect(API.fetchConfiguration).toHaveBeenCalled();
            expect(API.fetchPersonalizedInfo).toHaveBeenCalled();

            expect(store.getActions()).toEqual([configurationReceived(configData)]);
        });
    });

    it('should dispatch configurationDoesNotExist if fetchConfiguration returns an error_type DoesNotExist', () => {
        const store = mockStore({ configuration: null });
        const configData = { error_type: DOES_NOT_EXIST };

        API.fetchConfiguration = jest.fn().mockReturnValue(Promise.resolve(configData));

        const communityId = '11111';

        return store.dispatch(fetchConfiguration(communityId, null)).then(() => {
            expect(API.fetchConfiguration).toHaveBeenCalled();

            expect(store.getActions()).toEqual([configurationDoesNotExist(configData)]);
        });
    });
});

describe('selectTheme', () => {
    it('recomputes theme only when colors change', () => {
        const theme = selectors.selectTheme({
            configuration: {
                primary_color: '000000',
                secondary_color: 'ffffff',
            },
        });
        expect(theme).not.toBe(null);
        const themeTwo = selectors.selectTheme({
            configuration: {
                primary_color: '000000',
                secondary_color: 'ffffff',
            },
        });
        expect(theme).toEqual(themeTwo);
        const themeThree = selectors.selectTheme({
            configuration: {
                primary_color: '000000',
                secondary_color: 'cccccc',
            },
        });
        expect(themeTwo).not.toEqual(themeThree);
    });
});
