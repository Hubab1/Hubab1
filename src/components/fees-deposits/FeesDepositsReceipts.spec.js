import React from 'react';
import { shallow } from 'enzyme';
import mockReceipt from 'reducers/mock-receipt';
import mockProfile from 'reducers/mock-profile';
import mockApplicant from 'reducers/applicant-mock';
import { FeesDepositsReceipt } from './FeesDepositsReceipt';
import { ApplicationFees } from './ApplicationFees';
import { HoldingDeposit } from './HoldingDeposit';



let defaultProps;
const everyone = mockProfile.primary_applicant.guarantors.concat(mockProfile.co_applicants);
everyone.unshift(mockApplicant);

beforeEach(() => {
    defaultProps = {
        baseAppFee: 100,
        handleContinue: jest.fn(),
        email: "slkejhfkajshefjkhek@gm.com",
        receipt: mockReceipt,
        everyone: everyone
    }
})


it('renders expected headings text', () => {
    let wrapper = shallow( <FeesDepositsReceipt {...defaultProps}/> );

    expect(wrapper.text().includes('Payment Success!')).toBeTruthy();
    expect(wrapper.text().includes('Payment Summary')).toBeTruthy();
})


it('renders receipt information as expected with holding deposit', () => {
    let wrapper = shallow(<FeesDepositsReceipt {...defaultProps} />);

    expect(wrapper.text().includes('Payment Success!Thank you! We emailed a receipt to slkejhfkajshefjkhek@gm.comPayment Summary')).toBeTruthy();

    expect(wrapper.text().includes('Total$1300')).toBeTruthy();
    expect(wrapper.find(ApplicationFees).props().everyone.length).toEqual(3);
    expect(wrapper.find(HoldingDeposit).props().holdingDepositAmount).toEqual("$1000");
})

it('renders receipt information as expected when one applicant fee on receipt, no holding deposit', () => {
    let receipt = {
        "line_items": [{
            "id": "12",
            "type": "10",
            "invoice": "666",
            "applicant": "18",
            "invitee": null,
            "amount": 100.00,
            "paid": true,
            "stripe_id": "932923482jdf33"
        }],
        "paid": true,
        "id": 123,
        "application": {"id": 234},
        "total": 100.00,
        "stripe_id": "932923482jdf33",
        "paid_by": 18

    }
    let wrapper = shallow(<FeesDepositsReceipt {...defaultProps} payments={null} receipt={receipt} />);
    expect(wrapper.text().includes('Total$100')).toBeTruthy();
    expect(wrapper.find(ApplicationFees).props().everyone.length).toEqual(1);
    expect(wrapper.find(HoldingDeposit).length).toEqual(0);
})