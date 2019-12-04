import React from 'react';
import { shallow } from 'enzyme';

import { AccountPage } from './AccountPage';
import AccountForm from 'components/common/AccountForm';
import VerifyAccount from 'components/account/VerifyAccount';
import mockApplicant from 'reducers/applicant-mock.json';


let defaultProps;

beforeEach(() => {
    defaultProps = {
        updateApplication: jest.fn(),
        communityId: '123',
        applicant: mockApplicant,
    }
})

it('renders VerifyAccount when not verified', () => {
    const wrapper = shallow(<AccountPage {...defaultProps}/>);
    expect(wrapper.find(VerifyAccount).exists).toBeTruthy();
    expect(wrapper.find(AccountForm).exists()).not.toBeTruthy();
});

it('renders AccountForm when verified', () => {
    const wrapper = shallow(<AccountPage {...defaultProps}/>);
    wrapper.setState({verified:true});

    expect(wrapper.find(VerifyAccount).exists()).not.toBeTruthy();
    expect(wrapper.find(AccountForm).exists()).toBeTruthy();
});