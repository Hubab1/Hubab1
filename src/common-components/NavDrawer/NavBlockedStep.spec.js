import React from 'react';
import { shallow } from 'enzyme';
import { ROUTES } from 'constants/constants';
import {
    NavBlockedCompletedStep,
    NavBlockedInProgressStep,
    NavBlockedStep,
} from 'common-components/NavDrawer/NavBlockedStep';

describe('NavBlockedStep', () => {
    const defaultProps = {
        initialPage: ROUTES.INCOME_VERIFICATION_SUMMARY,
        currentRoute: 'lease_settings',
        text: 'We are waiting for xyz',
        config: {
            community: {
                contact_phone: '123-456-7891',
            },
        },
        handleDrawerClose: jest.fn(),
        history: {
            push: jest.fn(),
        },
        stepProps: {
            completed: true,
        },
        stepClass: 'class',
        buttonColor: 'primary',
    };

    it('NavBlockedStepInProgress matches snapshot', () => {
        const wrapper = shallow(<NavBlockedStep {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('View Progress when clicked takes to initialPage set', function () {
        const wrapper = shallow(<NavBlockedStep {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith(ROUTES.INCOME_VERIFICATION_SUMMARY);
    });
});

describe('NavBlockedInProgressStep', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<NavBlockedInProgressStep text={'You have to add guarantor.'} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('NavBlockedCompletedStep', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<NavBlockedCompletedStep text={'App is submitted.'} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
