import React from 'react';
import { shallow } from 'enzyme';

import ApplicationFees from './ApplicationFees';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        otherApplicants: [
            {
                "phone_number": "(383) 838-4849",
                "first_name": "kreebs",
                "last_name": "mcgreebs",
                "id": 71,
                "is_registered": false
            },
            {
                "phone_number": "(333) 888-4449",
                "first_name": "jerry",
                "last_name": "maguire",
                "id": 73,
                "is_registered": true
            },
            {
                "phone_number": "(222) 111-0000",
                "first_name": "elvish",
                "last_name": "parsley",
                "id": 74,
                "is_registered": false
            }
        ],
        totalApplicationFee: 2222,
        applicationFeesSelected: "everyone",
        handleChange: jest.fn()
    }
})

it('renders all other applicants', () => {
    let wrapper = shallow( <ApplicationFees {...defaultProps} /> );
    expect(wrapper.text()).toEqual('shut up');

    expect(wrapper.text().includes('elvish parsley')).toBeTruthy();
    expect(wrapper.text().includes('kreebs mcgreebs')).toBeTruthy();
    expect(wrapper.text().includes('jerry maguire')).toBeTruthy();

})