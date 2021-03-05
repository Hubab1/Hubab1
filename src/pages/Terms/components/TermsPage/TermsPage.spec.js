import React from 'react';
import { shallow } from 'enzyme';
import { FormControlLabel } from '@material-ui/core';

import { ROUTES, TOS_TYPE_NESTIO } from 'constants/constants';
import { TermsPage } from './TermsPage';
import ActionButton from 'components//ActionButton/ActionButton';

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

    it('disables CTA button as longs as the applicant has not agreed to the terms', async () => {
        const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn={false} />);
        // Initially disabled
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);

        // Only 1 checked => Disabled
        wrapper
            .find(FormControlLabel)
            .at(0)
            .props()
            .control // checkbox
            .props.onChange({ target: { checked: true } });
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);

        // Both checked => Enabled
        wrapper
            .find(FormControlLabel)
            .at(1)
            .props()
            .control // checkbox
            .props.onChange({ target: { checked: true } });
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(false);

        // uncheck => Disabled
        wrapper
            .find(FormControlLabel)
            .at(1)
            .props()
            .control // checkbox
            .props.onChange({ target: { checked: false } });
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
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
