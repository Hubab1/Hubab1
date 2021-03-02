import React from 'react';
import { shallow } from 'enzyme';

import { ROUTES } from 'app/constants';
import { TOS_TYPE_NESTIO } from 'app/constants';
import { TermsPage } from './TermsPage';
import ActionButton from 'components/common/ActionButton/ActionButton';

describe('TermsPage', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            leaseSettingsId: 10,
            history: {
                push: jest.fn(),
            },
            isSignedIn: true,
        };
    });

    it('renders terms only when applicant is signed in', () => {
        const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn />);
        expect(wrapper.find('[data-testid="terms"]').length).toBe(1);
        expect(wrapper.find('[data-testid="accept-terms"]').length).toBe(0);
    });

    it('renders terms and accept terms when applicant is signed out', () => {
        const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn={false} />);

        expect(wrapper.find('[data-testid="terms"]').length).toBe(1);
        expect(wrapper.find('[data-testid="accept-terms"]').length).toBe(1);
    });

    it('on CTA button click sets localStorage and navigates to sign up', () => {
        const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn={false} />);
        wrapper.find(ActionButton).simulate('click');
        expect(global.localStorage.getItem('accepted-platform-terms-10')).toBeTruthy();
        const acceptedTerms = JSON.parse(global.localStorage.getItem('accepted-platform-terms-10'));
        expect(acceptedTerms.type).toEqual(TOS_TYPE_NESTIO);
        expect(defaultProps.history.push).toHaveBeenCalledWith(ROUTES.SIGNUP);
    });
});
