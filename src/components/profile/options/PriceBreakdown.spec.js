import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import React from 'react';
import API from 'app/api';
import PriceBreakdown from 'components/profile/options/PriceBreakdown';

const buildProps = () => {
    return {
        application: { id: 123, },
        selectedOptions: {
            1: {
                quantity: 1
            },
            2: {
                quantity: 2
            }},
        unitId: 12,
        category: 'storage',
        categoryHelperText: 'storage space',
        onError: jest.fn(),
        onSuccess: jest.fn(),
    };
};

it('display correct info', async () => {
    const props = buildProps();
    API.getCurrentFlatQuote = jest.fn().mockReturnValue(Promise.resolve({
        total: '$2,020',
        items_breakdown: {
            storage: '$10',
            pets: '$10'
        },
        base_rent: '$2,000'
    }));
    const wrapper = mount(<PriceBreakdown {...props} />);
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(API.getCurrentFlatQuote).toHaveBeenCalled();
    expect(props.onSuccess).toHaveBeenCalled();
    expect(wrapper.debug()).toMatchSnapshot();
});
it('display correct info if has included options', async () => {
    const props = buildProps();
    API.getCurrentFlatQuote = jest.fn().mockReturnValue(Promise.resolve({
        total: '$2,020',
        items_breakdown: {
            storage: '', // storage included, serialized as empty string
            pets: '$10'
        },
        base_rent: '$2,000'
    }));
    const wrapper = mount(<PriceBreakdown {...props} />);
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.debug()).toMatchSnapshot();
});
it('calls onerror if api rejects', async () => {
    const props = buildProps();
    API.getCurrentFlatQuote = jest.fn().mockRejectedValue();
    const wrapper = mount(<PriceBreakdown {...props} />);
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(props.onError).toHaveBeenCalled();
});
