import React from 'react';
import { mount } from 'enzyme';
import AvailableUnitsSelector from 'components/common/AvailableUnitsSelector';
import API from 'app/api';
import Downshift from 'downshift';
import { act } from 'react-dom/test-utils';

describe('availableUnitsByDate', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            application: {},
            isPrimaryApplicant: true,
            update: jest.fn(),
        };

        const units = [
            { date_available: '2020-11-20', unit_number: '2b' },
            { date_available: '2020-11-20', unit_number: '5c' },
            { date_available: '2020-12-05', unit_number: '9a' },
        ];

        API.fetchAvailableUnits = jest.fn().mockReturnValue(Promise.resolve(units));
    });

    describe("leaseStartDate is before a unit's available date", () => {
        it('should exclude this unit', async () => {
            defaultProps.leaseStartDate = new Date('2020-11-21');
            let wrapper;
            let downshift;

            await act(async () => {
                wrapper = mount(<AvailableUnitsSelector {...defaultProps} />);
                downshift = wrapper.find(Downshift).find('input');
                await downshift.simulate('change', { target: { value: '' } });
            });

            expect(wrapper.text()).toContain('2b');
            expect(wrapper.text()).toContain('5c');
            expect(wrapper.text()).not.toContain('9a');
        });
    });

    describe('leaseStartDate is after all unit available dates', () => {
        it('should include all units', async () => {
            defaultProps.leaseStartDate = new Date('2020-12-21');
            let wrapper;
            let downshift;

            await act(async () => {
                wrapper = mount(<AvailableUnitsSelector {...defaultProps} />);
                downshift = wrapper.find(Downshift).find('input');
                await downshift.simulate('change', { target: { value: '' } });
            });

            expect(wrapper.text()).toContain('2b');
            expect(wrapper.text()).toContain('5c');
            expect(wrapper.text()).toContain('9a');
        });
    });

    describe('leaseStartDate is null', () => {
        it('should include all units', async () => {
            defaultProps.leaseStartDate = null;
            let wrapper;
            let downshift;

            await act(async () => {
                wrapper = mount(<AvailableUnitsSelector {...defaultProps} />);
                downshift = wrapper.find(Downshift).find('input');
                await downshift.simulate('change', { target: { value: '' } });
            });

            expect(wrapper.text()).toContain('2b');
            expect(wrapper.text()).toContain('5c');
            expect(wrapper.text()).toContain('9a');
        });
    });
});
