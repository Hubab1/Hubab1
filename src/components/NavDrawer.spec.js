import React from 'react';
import { shallow } from 'enzyme';
import { PersistentDrawerLeft } from 'components/NavDrawer';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        logout: jest.fn(),
        history: {
            push: jest.fn(),
        },
        applicant: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'jdoe@nest.io',
        },
        children: [],
        canAccessRoute: jest.fn(),
    };
});

it('PersistentDrawerLeft - Matches snapshot', function () {
    const wrapper = shallow(<PersistentDrawerLeft {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
