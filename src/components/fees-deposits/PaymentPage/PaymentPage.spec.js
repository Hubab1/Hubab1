import React from 'react';
import { shallow } from 'enzyme';

import { PaymentPage } from './PaymentPage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        totalPayment: 60.567,
        applicant: { client: { person: { first_name: 'Bob' } } }
    }
})

it('Inserts fee and first name in template', function() {
    const wrapper = shallow( <PaymentPage {...defaultProps}/> );
    expect(wrapper.text()).toContain('Almost There, Bob!')
    expect(wrapper.text()).toContain('The application fee and holding deposit for this apartment is $60.57')
});
