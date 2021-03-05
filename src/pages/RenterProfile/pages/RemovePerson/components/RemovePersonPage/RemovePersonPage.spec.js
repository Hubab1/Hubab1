import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import {
    RENTER_PROFILE_TYPE_CO_APPLICANTS,
    RENTER_PROFILE_TYPE_DEPENDENT,
    RENTER_PROFILE_TYPE_GUARANTOR,
} from 'constants/constants';
import mockConfig from 'reducers/mock-config.json';
import mockApplication from 'reducers/mock-profile.json';
import mockProfile from 'reducers/mock-profile.json';
import { RemovePersonPage } from './RemovePersonPage';

let defaultProps, fetchRenterProfile;

beforeEach(() => {
    fetchRenterProfile = jest.fn().mockResolvedValue({});
    defaultProps = {
        toggleLoader: jest.fn(),
        fetchRenterProfile: fetchRenterProfile,
        profile: {
            ...mockProfile,
            dependents: [{ id: 1, first_name: 'John', last_name: 'Doe', birthday: null }],
            co_applicants: [{ id: 1, first_name: 'John', last_name: 'Doe', birthday: null }],
            primary_applicant: {
                guarantors: [{ id: 1, first_name: 'John', last_name: 'Doe', birthday: null }],
            },
        },
        application: mockApplication,
        config: mockConfig,
    };

    API.deletePerson = jest.fn().mockReturnValue(Promise.resolve());
    API.deleteInvitee = jest.fn().mockReturnValue(Promise.resolve());
});

afterEach(() => {
    jest.restoreAllMocks();
});

it('matches snapshot: case dependent', function () {
    const wrapper = shallow(
        <RemovePersonPage
            {...defaultProps}
            match={{ params: { id: 1, type: 'dependent' }, isExact: true, path: '', url: '' }}
        />
    );

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('renders content for dependent person type', () => {
    const wrapper = shallow(
        <RemovePersonPage {...defaultProps} match={{ params: { id: 1, type: RENTER_PROFILE_TYPE_DEPENDENT } }} />
    );

    expect(wrapper.text()).toContain('Remove Person');
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Are you sure you want to remove this person?');
    expect(wrapper.text()).toContain(
        "You're about to remove John. Removing a person prevents " +
            'them from being able to apply for this unit as a dependent ' +
            'or from being added to the lease.'
    );

    wrapper.find('#submit-btn').simulate('click');

    expect(API.deletePerson).toHaveBeenCalled();
    expect(API.deleteInvitee).not.toHaveBeenCalled();
});

it('renders content for co-applicant person type', () => {
    const wrapper = shallow(
        <RemovePersonPage {...defaultProps} match={{ params: { id: 1, type: RENTER_PROFILE_TYPE_CO_APPLICANTS } }} />
    );

    expect(wrapper.text()).toContain('Remove Person');
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Are you sure you want to remove this person?');
    expect(wrapper.text()).toContain(
        "You're about to remove John. Removing a person prevents " +
            'them from being able to apply for this unit as a co-applicant ' +
            'or from being added to the lease.'
    );

    wrapper.find('#submit-btn').simulate('click');

    expect(API.deleteInvitee).toHaveBeenCalled();
    expect(API.deletePerson).not.toHaveBeenCalled();
});

it('renders content for guarantor person type', () => {
    const wrapper = shallow(
        <RemovePersonPage {...defaultProps} match={{ params: { id: 1, type: RENTER_PROFILE_TYPE_GUARANTOR } }} />
    );

    expect(wrapper.text()).toContain('Remove Guarantor');
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Are you sure you want to remove this guarantor?');
    expect(wrapper.text()).toContain(
        "You're about to remove John as guarantor. " +
            'Removing a guarantor prevents them from being able ' +
            'to financially back your lease application.'
    );

    wrapper.find('#submit-btn').simulate('click');

    expect(API.deleteInvitee).toHaveBeenCalled();
    expect(API.deletePerson).not.toHaveBeenCalled();
});
