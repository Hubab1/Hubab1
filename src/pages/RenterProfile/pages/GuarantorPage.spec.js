import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import { ROUTES, RENTER_PROFILE_TYPE_GUARANTOR } from 'constants/constants';
import { GuarantorPage } from './GuarantorPage';
import ActionButton from 'common-components/ActionButton/ActionButton';
import ConfirmationPage from 'pages/Confirmation';
import { generatePath } from 'react-router';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        fetchRenterProfile: jest.fn(),
        history: {
            push: jest.fn(),
        },
        initialPage: '/rental_profile',
        toggleLoader: jest.fn(),
        fetchApplicant: jest.fn().mockResolvedValue({}),
        application: {
            id: 1,
        },
        stillFinishingApp: true,
    };
});

it('fetches renter profile on submit', function () {
    API.inviteGuarantor = jest.fn().mockResolvedValue({});
    const wrapper = shallow(<GuarantorPage {...defaultProps} />);
    return wrapper
        .instance()
        .onSubmit({}, { setSubmitting: jest.fn() })
        .then(() => {
            expect(defaultProps.fetchRenterProfile).toHaveBeenCalled();
        });
});

it('sets errors on submit if errors returned', function () {
    API.inviteGuarantor = jest.fn().mockResolvedValue({ errors: { guarantors: ['not good'] } });
    const wrapper = shallow(<GuarantorPage {...defaultProps} />);
    const setErrors = jest.fn();
    return wrapper
        .instance()
        .onSubmit({}, { setSubmitting: jest.fn(), setErrors })
        .then(() => {
            expect(defaultProps.fetchRenterProfile).not.toHaveBeenCalled();
            expect(setErrors).toHaveBeenCalledWith('not good');
        });
});

it('matches snapshot', () => {
    const wrapper = shallow(<GuarantorPage {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Confirmation Page - Add guarantor from rental options', function () {
    const wrapper = shallow(<GuarantorPage {...defaultProps} />);
    wrapper.setState({ confirmSent: true });
    expect(wrapper.find(ConfirmationPage).exists()).toBeTruthy();
    wrapper.find(ConfirmationPage).dive().find(ActionButton).at(0).simulate('click');
    expect(defaultProps.history.push).toHaveBeenCalledWith(
        generatePath(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_GUARANTOR}`, { application_id: 1 })
    );
});

it('Confirmation Page - Add guarantor after requested', function () {
    const wrapper = shallow(<GuarantorPage {...defaultProps} stillFinishingApp={false} />);
    wrapper.setState({ confirmSent: true });
    expect(wrapper.find(ConfirmationPage).exists()).toBeTruthy();
    wrapper.find(ConfirmationPage).dive().find(ActionButton).at(0).simulate('click');
    expect(defaultProps.fetchApplicant).toHaveBeenCalled();
});
