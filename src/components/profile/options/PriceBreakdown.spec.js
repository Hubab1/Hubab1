import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import React from 'react';
import API from 'app/api';
import PriceBreakdown from 'components/profile/options/PriceBreakdown';

const buildProps = () => {
    return {
        application: { id: 123, },
        selectedOptions: {},
        unitId: 12,
        baseRent: 1200,
        category: 'storage',
        categoryHelperText: 'storage space',
    }
};

describe('Price Breackdown section', () => {
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
        let wrapper = mount(<PriceBreakdown {...props} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });
        expect(wrapper.debug()).toMatchSnapshot();
    })
})