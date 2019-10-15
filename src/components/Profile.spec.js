import React from 'react';
import { mount } from 'enzyme';

import { Profile } from './Profile';
import ActionButton from 'components/common/ActionButton/ActionButton';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        applicant: {
            address_street: '123 Fulton st',
            address_city: 'New York',
            address_state: 'NY',
            address_postal_code: '10038',
        }
    }
});

describe('<ActionButton/>', () => {
    it('disabled if form is incomplete', function () {
        let wrapper = mount(<Profile {...defaultProps}/>);
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(false);

        let applicant = {
            address_street: '123 Fulton st',
            address_city: 'New York',
            address_state: '',
            address_postal_code: '10038',
        };
        wrapper = mount(<Profile {...defaultProps} applicant={applicant} />);
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
    });
});