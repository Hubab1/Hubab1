import React from 'react';
import { shallow, mount } from 'enzyme';

import API from 'api/api';
import AvailableLeaseTermsSelector from './AvailableLeaseTermsSelector';

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
        mount(
            <AvailableLeaseTermsSelector
                {...defaultProps}
                leaseTerm={null}
                unitId={null}
                leaseStartDate={new Date('2020-08-26')}
            />
        );
        expect(API.fetchAvailableLeaseTerms).not.toHaveBeenCalled();
    });

    it('Call API if unit id provided', () => {
        API.fetchAvailableLeaseTerms = jest.fn().mockReturnValue(Promise.resolve({ lease_terms: [6, 12, 24] }));
        mount(
            <AvailableLeaseTermsSelector
                {...defaultProps}
                leaseTerm={null}
                unitId={100}
                leaseStartDate={new Date('2020-08-26')}
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
                leaseTerm={null}
                unitId={100}
                leaseStartDate={new Date('2020-08-27')}
            />
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
