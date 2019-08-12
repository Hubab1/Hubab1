import React from 'react';
import { shallow } from 'enzyme';

import mockProfile from 'reducers/mock-profile';
import mockConfig from 'reducers/mock-config';
import { PaymentOptionsPage } from './PaymentOptionsPage';
import { ApplicationFees } from './ApplicationFees';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig
    }
})

it('renders ApplicationFees', function() {
    let wrapper = shallow( <PaymentOptionsPage {...defaultProps} /> );
    expect(wrapper.find(ApplicationFees)).toBeTruthy();
});
