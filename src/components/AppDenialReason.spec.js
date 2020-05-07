import React from 'react';
import { shallow } from 'enzyme';

import DenialReason from 'components/AppDenialReason';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        date: '5/6/2020',
        buildingName: 'Monterey Pines Apartments',
        unitNumber: 'Unit 14F',
        name: 'John Doe',
        onAgree: jest.fn(),
    };
});

it('Matches Snapshot', function() {
    let wrapper = shallow( <DenialReason {...defaultProps}/> );
    expect(wrapper.getElement()).toMatchSnapshot();
});
