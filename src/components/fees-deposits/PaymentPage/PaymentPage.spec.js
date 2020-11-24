import React from 'react';
import { shallow } from 'enzyme';

import { PaymentPage } from './PaymentPage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        totalPayment: 60.567,
        applicant: { first_name: 'Bob' },
    };
});

it('Inserts fee and first name in template', function () {
    const wrapper = shallow(<PaymentPage {...defaultProps} />);
    expect(wrapper.text()).toContain('Almost There, Bob!');
    expect(wrapper.text()).toContain('The application fee and holding deposit for this apartment is $60.57');
});

describe('outstanding balance state', function () {
    it('displays outstanding balance messaging', function () {
        defaultProps.isOutstanding = true;
        const wrapper = shallow(<PaymentPage {...defaultProps} />);
        expect(wrapper.text()).toContain('The outstanding balance for this apartment is $60.57');
    });
});
