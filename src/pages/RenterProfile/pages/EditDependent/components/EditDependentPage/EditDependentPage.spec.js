import React from 'react';
import { shallow } from 'enzyme';

import mockConfig from 'reducers/mock-config.json';
import mockApplication from 'reducers/mock-profile.json';
import mockProfile from 'reducers/mock-profile.json';
import { EditDependentPage } from './EditDependentPage';
import InviteForm from 'components//Forms/InviteForm/InviteForm';


let defaultProps, updateRenterProfile;

beforeEach(() => {
    updateRenterProfile = jest.fn().mockResolvedValue({});
    defaultProps = {
        updateRenterProfile: updateRenterProfile,
        profile: {
            ...mockProfile,
            dependents: [{id: 1, first_name: 'John', last_name: 'Doe', birthday: null}]
        },
        application: mockApplication,
        config: mockConfig,
    };
});

it('matches snapshot', function() {
    const wrapper = shallow(
        <EditDependentPage
            {...defaultProps}
            match={{params: {id: 1}, isExact: true, path: '', url: ''}}
        />
    );

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Check Invite form values', function() {
    const wrapper = shallow(
        <EditDependentPage
            {...defaultProps}
            match={{params: {id: 1}, isExact: true, path: '', url: ''}}
        />
    );

    expect(wrapper.find(InviteForm).exists()).toBeTruthy();
    expect(wrapper.find(InviteForm).prop('initialValues')).toMatchObject(
        {birthday: null, first_name: 'John', id: 1, last_name: 'Doe'},
    );
    expect(wrapper.find(InviteForm).prop('buttonText')).toEqual('Save Changes');
    expect(wrapper.find(InviteForm).prop('disableTypeChange')).toBe(true);
    expect(wrapper.find(InviteForm).prop('initialIsDependent')).toBe(true);
});
