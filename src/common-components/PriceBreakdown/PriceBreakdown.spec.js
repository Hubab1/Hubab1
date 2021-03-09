import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import API from 'api/api';
import PriceBreakdown from './PriceBreakdown';

describe('PriceBreakDown', () => {
    let props = {};

    beforeEach(() => {
        props = {
            application: { id: 123 },
            selectedOptions: {
                1: {
                    quantity: 1,
                },
                2: {
                    quantity: 2,
                },
            },
            unitId: 12,
            moveInDate: '01/01/2020',
            category: 'storage',
            categoryHelperText: 'storage space',
            onError: jest.fn(),
            onSuccess: jest.fn(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('display correct info', async () => {
        const fetchQuote = jest.spyOn(API, 'getCurrentFlatQuote').mockReturnValue(
            Promise.resolve({
                total: '$2,020',
                items_breakdown: {
                    storage: '$10',
                    pets: '$10',
                },
                base_rent: '$2,000',
            })
        );
        const wrapper = mount(<PriceBreakdown {...props} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });

        expect(fetchQuote).toHaveBeenCalled();
        expect(props.onSuccess).toHaveBeenCalled();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('display correct info if has included options', async () => {
        const fetchQuote = jest.spyOn(API, 'getCurrentFlatQuote').mockReturnValue(
            Promise.resolve({
                total: '$2,020',
                items_breakdown: {
                    storage: '', // storage included, serialized as empty string
                    pets: '$10',
                },
                base_rent: '$2,000',
            })
        );
        const wrapper = mount(<PriceBreakdown {...props} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });

        expect(fetchQuote).toHaveBeenCalled();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('calls onerror if api rejects', async () => {
        const fetchQuote = jest.spyOn(API, 'getCurrentFlatQuote').mockRejectedValue();
        const wrapper = mount(<PriceBreakdown {...props} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });

        expect(fetchQuote).toHaveBeenCalled();
        expect(props.onError).toHaveBeenCalled();
    });

    it('will not fetch quote when date is missing', async () => {
        const fetchQuote = jest.spyOn(API, 'getCurrentFlatQuote').mockReturnValue(Promise.resolve());
        const wrapper = mount(<PriceBreakdown {...props} moveInDate={null} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });

        expect(fetchQuote).not.toHaveBeenCalled();
    });

    it('will not fetch quote when date is invalid', async () => {
        const fetchQuote = jest.spyOn(API, 'getCurrentFlatQuote').mockReturnValue(Promise.resolve());
        const wrapper = mount(<PriceBreakdown {...props} moveInDate={'blablabla'} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });

        expect(fetchQuote).not.toHaveBeenCalled();
    });
});
