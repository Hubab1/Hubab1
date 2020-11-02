import React from 'react';
import { shallow } from 'enzyme';
import { ElectronicSignatureAgreement } from './ElectronicSignatureAgreement';
import Checkbox from 'components/common/Checkbox';
import ActionButton from 'components/common/ActionButton/ActionButton';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        isSignedIn: true,
        onAgree: jest.fn(),
    };
});

it('matches snapshot signed in', () => {
    const wrapper = shallow(<ElectronicSignatureAgreement {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot signed out', () => {
    const wrapper = shallow(<ElectronicSignatureAgreement {...defaultProps} isSignedIn={false} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Action Button', () => {
    const wrapper = shallow(<ElectronicSignatureAgreement {...defaultProps} isSignedIn={false} />);

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
