import React from 'react';
import { shallow } from 'enzyme';

import auth from 'utils/auth';
import API from 'api/api';

import { AccountPage } from './AccountPage';
import AccountForm from 'common-components/Forms/AccountForm/AccountForm';
import ChangePasswordForm from 'common-components/Forms/ChangePasswordForm/ChangePasswordForm';
import VerifyAccount from 'pages/Account/components/VerifyAccount/VerifyAccount';
import mockApplicant from 'reducers/tests/mock-applicant.json';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        communityId: '123',
        applicant: mockApplicant,
        configuration: {
            community: {
                contact_phone: '11111111',
            },
        },
        updateApplication: jest.fn(),
        toggleLoader: jest.fn(),
    };
});

it('renders VerifyAccount when not verified', () => {
    const wrapper = shallow(<AccountPage {...defaultProps} />);
    expect(wrapper.find(VerifyAccount).exists).toBeTruthy();
    expect(wrapper.find(AccountForm).exists()).not.toBeTruthy();
});

it('renders AccountForm when verified', () => {
    const wrapper = shallow(<AccountPage {...defaultProps} />);
    wrapper.setState({ verified: true });

    expect(wrapper.find(VerifyAccount).exists()).not.toBeTruthy();
    expect(wrapper.find(AccountForm).exists()).toBeTruthy();
});

it('renders ChangePasswordForm when password has been verified and Change Password button is clicked', () => {
    const wrapper = shallow(<AccountPage {...defaultProps} />);
    wrapper.setState({ verified: true });
    expect(wrapper.find(ChangePasswordForm).exists()).not.toBeTruthy();

    wrapper.setState({ showChangePassword: true });
    expect(wrapper.find(ChangePasswordForm).exists()).toBeTruthy();
});

it('calls API.passwordReset onChangePasswordSubmit', function () {
    const token = '123';

    auth.getToken = jest.fn().mockReturnValue('123');

    const wrapper = shallow(<AccountPage {...defaultProps} />);
    API.passwordReset = jest.fn().mockReturnValue(Promise.resolve());
    return wrapper
        .instance()
        .onChangePasswordSubmit({ password: 'Abagail' }, { setSubmitting: function () {} })
        .then(() => {
            expect(API.passwordReset).toHaveBeenCalledWith('Abagail', token);
        });
});

it('renders errors if has errors', function () {
    const errorMessage = 'There was an error with resetting your password. Please try again.';

    auth.getToken = jest.fn().mockReturnValue('123');

    const wrapper = shallow(<AccountPage {...defaultProps} />);
    API.passwordReset = jest.fn().mockReturnValue(Promise.resolve({ errors: [errorMessage] }));
    return wrapper
        .instance()
        .onChangePasswordSubmit({ password: 'Abagail' }, { setSubmitting: function () {} })
        .then(() => {
            expect(wrapper.state('resetPasswordErrors')).toEqual([errorMessage]);
        });
});
