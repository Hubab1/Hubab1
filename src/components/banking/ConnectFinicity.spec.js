import React from 'react';
import { shallow } from 'enzyme';
import ConnectFinicity from './ConnectFinicity';
import ManualIncomeVerificationPage from './ManualIncomeVerificationPage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        goBack: jest.fn()
    }
})

it('shows manual income verification screen if screen === manual', () => {
    const wrapper = shallow(<ConnectFinicity {...defaultProps} screen="manual"/>);
    expect(wrapper.find(ManualIncomeVerificationPage).length).toBe(1);
});
