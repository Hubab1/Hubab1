import React from 'react';
import { mount } from 'enzyme';

import { InviteForm } from './InviteForm';
import ActionButton from 'components/common/ActionButton/ActionButton';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        initialValues: {
            last_name: 'Smith',
            first_name: 'John',
            email: 'johnsmithakjsehfbhi@gmail.com',
        }
    }
});

describe('<ActionButton/>', () => {
    describe('sendToPhone is false', () => {
        describe('all form fields filled in', () => {
            it('ActionButton is not disabled', function () {
                let wrapper = mount(<InviteForm {...defaultProps}/>);
                expect(wrapper.find(ActionButton).prop('disabled')).toBe(false);
            });
        });
    
        describe('missing form value', () => {
            const initialValues = {
                last_name: 'Smith',
                first_name: '',
                email: 'johnsmithakjsehfbhi@gmail.com',
            };
            it('disabled if form is incomplete', function () {
                const wrapper = mount(<InviteForm {...defaultProps} initialValues={initialValues} />);
                expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
            });
        });
    });
    describe('sendToPhone is true', () => {
        describe('all form fields filled in', () => {
            const initialValues = {
                last_name: 'Smith',
                first_name: 'John',
                phone_number: '555-555-5555',
            };
            it('ActionButton is not disabled', function () {
                let wrapper = mount(<InviteForm {...defaultProps} initialValues={initialValues} />);
                expect(wrapper.find(ActionButton).prop('disabled')).toBe(false);
            });
        });
    
        describe('missing form value', () => {
            const initialValues = {
                last_name: 'Smith',
                first_name: 'John',
                phone_number: '',
            };
            it('disabled if form is incomplete', function () {
                const wrapper = mount(<InviteForm {...defaultProps} initialValues={initialValues} />);
                expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
            });
        });
    })
});