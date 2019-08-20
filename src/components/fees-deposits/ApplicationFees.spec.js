import React from 'react';
import { shallow } from 'enzyme';

import { ApplicationFees, OtherApplicantRow } from './ApplicationFees';
import { PaidText } from './PaidText';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        otherApplicants: [
            {
                "phone_number": "(383) 838-4849",
                "first_name": "kreebs",
                "last_name": "mcgreebs",
                "id": 71,
                "is_registered": false,
                "application_fee_paid": true,
            },
            {
                "phone_number": "(333) 888-4449",
                "first_name": "jerry",
                "last_name": "maguire",
                "id": 73,
                "is_registered": true,
                "application_fee_paid": false,
            },
            {
                "phone_number": "(222) 111-0000",
                "first_name": "elvish",
                "last_name": "parsley",
                "id": 74,
                "is_registered": false,
                "application_fee_paid": false,
            }
        ],
        totalApplicationFee: 2222,
        applicationFeesSelected: "everyone",
        handleChange: jest.fn()
    }
})

it('renders row with radio select and all other applicants when everyone selected', () => {
    let wrapper = shallow( <ApplicationFees {...defaultProps} /> );

    expect(wrapper.text().includes('Application Fee')).toBeTruthy();
    expect(wrapper.find(OtherApplicantRow).length).toEqual(3);
})

it('renders row with radio select, but no other Applicants when self is selected', () => {
    defaultProps.applicationFeesSelected = 'self';
    let wrapper = shallow( <ApplicationFees {...defaultProps} /> );

    expect(wrapper.text().includes('Application Fee')).toBeTruthy();

    expect(wrapper.find(OtherApplicantRow).length).toEqual(0);

})

it('renders OtherApplicantRows with full names', () => {
    let wrapper = shallow( <ApplicationFees {...defaultProps} /> );

    expect(wrapper.find(OtherApplicantRow).first().props().name).toEqual('kreebs mcgreebs');
    expect(wrapper.find(OtherApplicantRow).at(1).props().name).toEqual('jerry maguire');
    expect(wrapper.find(OtherApplicantRow).last().props().name).toEqual('elvish parsley');
})

it('renders OtherApplicantRow with PaidText when fees have been paid', () => {
    let wrapper = shallow(<OtherApplicantRow name="steve" applicantFeePaid={true}/>);

    expect(wrapper.find(PaidText).length).toBeTruthy();
})

it('renders OtherApplicantRow without PaidText when fees have not been paid', () => {
    let wrapper = shallow(<OtherApplicantRow name="steve" applicantFeePaid={false}/>);

    expect(wrapper.find(PaidText).length).not.toBeTruthy();
})