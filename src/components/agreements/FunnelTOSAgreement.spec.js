import React from 'react';
import { shallow } from 'enzyme';
import { FunnelTOSAgreement } from './FunnelTOSAgreement';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        isSignedIn: true,
        onAgree: jest.fn(),
    };
});

describe('signed in', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<FunnelTOSAgreement {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('signed out', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(<FunnelTOSAgreement {...defaultProps} isSignedIn={false} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
