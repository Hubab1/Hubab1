import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import API from 'app/api';
import reducer, {
    fetchConfiguration,
    configurationReceived,
    selectors,
    configurationDoesNotExist,
    filterRentalOptionsByUnit,
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

    it('should not include attributes with empty objects', () => {
        const store = mockStore({ configuration: {} });
        const configData = { community: 'coolsville', emptyObjet: {}, enable_automatic_income_verification: true };
        const personalData = { person: { first_name: 'Fred', last_name: 'Sample' }, emptyObjet: {} };
        const combinedData = {
            community: 'coolsville',
            person: { first_name: 'Fred', last_name: 'Sample' },
            enable_automatic_income_verification: true,
        };

        API.fetchConfiguration = jest.fn().mockReturnValue(Promise.resolve(configData));
        API.fetchPersonalizedInfo = jest.fn().mockReturnValue(Promise.resolve(personalData));

        const communityId = '1';
        const hash = { client: 123 };

        return store.dispatch(fetchConfiguration(communityId, hash)).then(() => {
            expect(store.getActions()).toEqual([configurationReceived(combinedData)]);
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

describe('filter rental options by unit', () => {
    it("removes rental options that don't match the unit", async () => {
        const state = {
            rental_options: {
                parking: [{ layouts: [10, 20] }, { layouts: [40, 30] }],
                pets: [{ layouts: [] }, { layouts: [10] }],
                storage: [{ layouts: [10] }],
            },
        };

        const result = reducer(state, {
            type: filterRentalOptionsByUnit.type,
            payload: {
                unit: {
                    layout: 20,
                },
            },
        });

        expect(result).toMatchObject({
            rental_options: {
                parking: [{ layouts: [10, 20] }],
                pets: [{ layouts: [] }],
            },
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

describe('community selectors', () => {
    it('selectCommunity returns community when available', () => {
        const state = {};
        expect(selectors.selectCommunity(state)).toBeUndefined();

        state.configuration = {};
        expect(selectors.selectCommunity(state)).toBeUndefined();

        const community = { foo: 'bar' };
        state.configuration.community = community;
        expect(selectors.selectCommunity(state)).toEqual(community);
    });

    it('selectCommunityContactPhoneNumber returns number when available', () => {
        const state = {};
        expect(selectors.selectCommunityContactPhoneNumber(state)).toBeUndefined();

        state.configuration = {};
        expect(selectors.selectCommunityContactPhoneNumber(state)).toBeUndefined();

        state.configuration.community = { foo: 'bar' };
        expect(selectors.selectCommunityContactPhoneNumber(state)).toBeUndefined();

        state.configuration.community.contact_phone = '12345';
        expect(selectors.selectCommunityContactPhoneNumber(state)).toEqual('12345');
    });
});
