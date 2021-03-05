import React from 'react';
import { shallow } from 'enzyme';

import { HoldingDeposit } from './HoldingDeposit';
import { PaidText } from 'components//PaidText/PaidText';

describe('Holding Deposit', () => {
    it('shows PaidText if holdingDepositPaid=true', () => {
        const wrapper = shallow(<HoldingDeposit holdingDepositPaid={true} holdingDepositAmount="$1000" />);
        expect(wrapper.find(PaidText).length).toEqual(1);
    });
    it('shows holdingDepositAmount if passed holdingDepositPaid=false', () => {
        const wrapper = shallow(<HoldingDeposit holdingDepositPaid={false} holdingDepositAmount="$1000" />);
        expect(wrapper.find(PaidText).length).toEqual(0);
        expect(wrapper.text().includes('$1000')).toBeTruthy();
    });
});
