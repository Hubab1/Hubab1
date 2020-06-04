import React from 'react';
import { shallow } from 'enzyme';
import VerifyIncome from './VerifyIncome';
import ManualIncomeVerificationPage from './ManualIncomeVerificationPage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        goBack: jest.fn()
    }
})

it('shows manual income verification screen if screen === manual', () => {
    const wrapper = shallow(<VerifyIncome {...defaultProps} screen="manual"/>);
    expect(wrapper.find(ManualIncomeVerificationPage).length).toBe(1);
});
