import React from 'react';
import { shallow } from 'enzyme';
import { ROUTES } from 'app/constants';
import { NavBlockedStep } from 'components/NavBlockedStep';

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
    };

    it('matches snapshot', () => {
        const wrapper = shallow(<NavBlockedStep {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('View Progress when clicked takes to initialPage set', function () {
        const wrapper = shallow(<NavBlockedStep {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith('/income-employment/summary');
    });
});
