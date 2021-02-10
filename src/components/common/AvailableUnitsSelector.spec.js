import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Autocomplete from '@material-ui/lab/Autocomplete';

import API from 'app/api';
import AvailableUnitsSelector from 'components/common/AvailableUnitsSelector';

describe('AvailableUnitsSelector', () => {
    const units = [
        { date_available: '2020-11-20', unit_number: '2b' },
        { date_available: '2020-11-20', unit_number: '5c' },
        { date_available: '2020-12-05', unit_number: '9a' },
    ];

    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            application: {},
            isPrimaryApplicant: true,
            onChange: jest.fn(),
        };

        API.fetchAvailableUnits = jest.fn().mockReturnValue(Promise.resolve(units));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('calls fetchAvailableUnits', async () => {
        const fetchAvailableUnits = jest.spyOn(API, 'fetchAvailableUnits').mockReturnValue(Promise.resolve(units));

        await act(async () => {
            mount(<AvailableUnitsSelector {...defaultProps} />);
        });

        expect(fetchAvailableUnits).toBeCalled();
    });

    it('should filter out unit not available from lease start date', async () => {
        const leaseStartDate = new Date('2020-11-21');
        let wrapper;

        await act(async () => {
            wrapper = mount(<AvailableUnitsSelector {...defaultProps} leaseStartDate={leaseStartDate} />);
        });

        await wrapper.update();
        expect(wrapper.find(Autocomplete).prop('options')).toEqual([
            { date_available: '2020-11-20', unit_number: '2b' },
            { date_available: '2020-11-20', unit_number: '5c' },
        ]);
    });

    it('should include all units', async () => {
        const leaseStartDate = new Date('2020-12-21');
        let wrapper;

        await act(async () => {
            wrapper = mount(<AvailableUnitsSelector {...defaultProps} leaseStartDate={leaseStartDate} />);
        });

        await wrapper.update();
        expect(wrapper.find(Autocomplete).prop('options')).toEqual(units);
    });
});
