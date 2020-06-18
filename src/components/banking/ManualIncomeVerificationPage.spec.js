import React from 'react';
import { shallow } from 'enzyme';
import { ManualIncomeVerificationPage } from './ManualIncomeVerificationPage';

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useContext: () => ({
        bankingData: {
            income_sources: [
                {
                    id: 123,
                    income_or_asset_type: 105,
                    estimated_amount: 100000
                }
            ],
            asset_sources: [
                {
                    id: 123,
                    income_or_asset_type: 510,
                    estimated_amount: 40000
                }
            ]
        },

    })
  }));

let defaultProps;
beforeEach(() => {
    defaultProps = {
        goBack: jest.fn()
    }
})

it('matches snapshot with some financial sources data', () => {
    const wrapper = shallow(<ManualIncomeVerificationPage {...defaultProps}/>);
    expect(
        wrapper.getElement()
    ).toMatchSnapshot();
});
