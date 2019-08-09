import React from 'react';
import { shallow } from 'enzyme';

import mockProfile from 'reducers/mock-profile';
import mockConfig from 'reducers/mock-config';
import { PaymentOptionsPage } from './PaymentOptionsPage';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig
    }
})

it('renders names of all co_applicants and guarantors', function() {
    let wrapper = shallow( <PaymentOptionsPage {...defaultProps} /> );
    expect(wrapper.text().includes('elvish parsley')).toBeTruthy();
    expect(wrapper.text().includes('kreebs mcgreebs')).toBeTruthy();
    expect(wrapper.text().includes('jerry maguire')).toBeTruthy();
});
