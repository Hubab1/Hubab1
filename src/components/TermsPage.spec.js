import React from 'react';
import { shallow } from 'enzyme';
import { TermsPage } from './TermsPage';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { TOS_TYPE_NESTIO } from 'app/constants';

let defaultProps;
beforeEach(()=>{
    defaultProps = {
        leaseSettingsId: 10,
        history: {
            push: jest.fn(),
        },
        isSignedIn: true
    };
});

describe('signed in', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<TermsPage {...defaultProps}/>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('signed out', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn={false}/>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
    describe('on click ActionButton', () => {
        it('sets localStorage and navigates', () => {
            const wrapper = shallow(<TermsPage {...defaultProps} isSignedIn={false}/>);
            wrapper.find(ActionButton).simulate('click');
            expect(global.localStorage.getItem('accepted-terms-10')).toBeTruthy();
            const acceptedTerms = JSON.parse(global.localStorage.getItem('accepted-terms-10'));
            expect(acceptedTerms.type).toEqual(TOS_TYPE_NESTIO);
            expect(defaultProps.history.push).toHaveBeenCalledWith(ROUTES.SIGNUP);
        });
    });
});
