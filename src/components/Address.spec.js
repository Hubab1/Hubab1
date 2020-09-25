import React from 'react';
import { mount } from 'enzyme';

import { Address } from './Address';
import ActionButton from 'components/common/ActionButton/ActionButton';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        applicant: {
            address_street: '123 Fulton st',
            address_line_2: '1F',
            address_city: 'New York',
            address_state: 'NY',
            address_postal_code: '10038',
        },
        updateApplicant: jest.fn()
    };
});

describe('<ActionButton/>', () => {
    describe('all form fields filled in', () => {
        it('ActionButton is not disabled', function () {
            let wrapper = mount(<Address {...defaultProps}/>);
            expect(wrapper.find(ActionButton).prop('disabled')).toBe(false);
        });
    });

    describe('missing form value', () => {
        let applicant = {
            address_street: '123 Fulton st',
            address_city: 'New York',
            address_state: '',
            address_postal_code: '10038',
        };
        it('disabled if form is incomplete', function () {
            const wrapper = mount(<Address {...defaultProps} applicant={applicant} />);
            expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
        });
    });
    describe('missing optional form value address_line_2', () => {
        let applicant = {
            address_street: '123 Fulton st',
            address_city: 'New York',
            address_state: 'NY',
            address_postal_code: '10038',
        };
        it('disabled if form is incomplete', function () {
            const wrapper = mount(<Address {...defaultProps} applicant={applicant} />);
            expect(wrapper.find(ActionButton).prop('disabled')).toBe(false);
        });
    });
});