import React from 'react';
import { shallow } from 'enzyme';
import { TermsPage } from './TermsPage';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { TOS_TYPE_NESTIO } from 'app/constants';
import Checkbox from 'components/common/Checkbox';

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

describe('signed in', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<TermsPage {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('signed out', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn={false} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('Action Button', () => {
        const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn={false} />);

        // Initially disabled
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);

        // Only 1 checked => Disabled
        wrapper
            .find(Checkbox)
            .at(0)
            .props()
            .onChange({ target: { checked: true } });
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);

        // Both checked => Enabled
        wrapper
            .find(Checkbox)
            .at(1)
            .props()
            .onChange({ target: { checked: true } });
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(false);

        // uncheck => Disabled
        wrapper
            .find(Checkbox)
            .at(1)
            .props()
            .onChange({ target: { checked: false } });
        expect(wrapper.find(ActionButton).prop('disabled')).toBe(true);
    });

    describe('on click ActionButton', () => {
        it('sets localStorage and navigates', () => {
            const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn={false} />);
            wrapper.find(ActionButton).simulate('click');
            expect(global.localStorage.getItem('accepted-platform-terms-10')).toBeTruthy();
            const acceptedTerms = JSON.parse(global.localStorage.getItem('accepted-platform-terms-10'));
            expect(acceptedTerms.type).toEqual(TOS_TYPE_NESTIO);
            expect(defaultProps.history.push).toHaveBeenCalledWith(ROUTES.SIGNUP);
        });
    });
});
