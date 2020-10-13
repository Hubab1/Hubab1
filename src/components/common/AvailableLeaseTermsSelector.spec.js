import React from 'react';
import { shallow, mount } from 'enzyme';
import AvailableLeaseTermsSelector from 'components/common/AvailableLeaseTermsSelector';
import API from 'app/api';

describe('AvailableLeaseTermsSelector', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            handleChange: jest.fn(),
            isPrimaryApplicant: true,
        };
    });

    it('Does not call API if no unit', () => {
        API.fetchAvailableLeaseTerms = jest.fn().mockReturnValue(Promise.resolve({ lease_terms: [] }));
        const wrapper = mount(
            <AvailableLeaseTermsSelector
                {...defaultProps}
                leaseTerm={null}
                unitId={null}
                lease_start_date={new Date('2020-08-26')}
            />
        );
        expect(API.fetchAvailableLeaseTerms).not.toHaveBeenCalled();
    });

    it('Call API if unit id provided', () => {
        API.fetchAvailableLeaseTerms = jest.fn().mockReturnValue(Promise.resolve({ lease_terms: [6, 12, 24] }));
        const wrapper = mount(
            <AvailableLeaseTermsSelector
                {...defaultProps}
                leaseTerm={null}
                unitId={100}
                lease_start_date={new Date('2020-08-26')}
            />
        );
        expect(API.fetchAvailableLeaseTerms).toHaveBeenCalledWith({
            move_in_date: '2020-08-26',
            unit_id: 100,
        });
    });

    it('Matches snapshot', () => {
        API.fetchAvailableLeaseTerms = jest.fn().mockReturnValue(Promise.resolve({ lease_terms: [6, 12, 24] }));
        const wrapper = shallow(
            <AvailableLeaseTermsSelector
                {...defaultProps}
                leaseTerm={12}
                unitId={100}
                lease_start_date={new Date('2020-08-27')}
            />
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
