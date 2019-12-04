import React from 'react';
import { shallow } from 'enzyme';

import { AccountPage } from './AccountPage';
import { LinkButton } from 'assets/styles';
import ChangePasswordForm from 'components/common/ChangePasswordForm';
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

it('renders ChangePasswordForm when password has been verified and Change Password button is clicked', () => {
    const wrapper = shallow(<AccountPage {...defaultProps}/>);
    wrapper.setState({verified:true});
    expect(wrapper.find(ChangePasswordForm).exists()).not.toBeTruthy();

    wrapper.find(LinkButton).simulate('click');
    expect(wrapper.find(ChangePasswordForm).exists()).toBeTruthy();
});