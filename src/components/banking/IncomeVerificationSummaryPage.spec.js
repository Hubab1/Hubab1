import React from 'react';
import { shallow } from 'enzyme';
import { IncomeVerificationSummaryPage } from './IncomeVerificationSummaryPage';
import { ROLE_GUARANTOR, ROLE_PRIMARY_APPLICANT } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';

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
            ],
            income_total: '100000.00',
            asset_total: '40000.00',
        },

    })
  }));

let defaultProps;
beforeEach(() => {
    defaultProps = {
        pageComplete: jest.fn(),
        _navigate: jest.fn(),
        goBack: jest.fn(),
        applicant: {
            role: ROLE_PRIMARY_APPLICANT
        },
        config: {
            guarantor_income_requirement_multiplier: 80,
            applicant_income_requirements: 40
        },
        profile: {
            unit: {
                price: 1000
            }
        }

    }
})

it('matches snapshot with some financial sources data', () => {
    const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps}/>);
    expect(
        wrapper.getElement()
    ).toMatchSnapshot();
});

it('matches snapshot with some financial sources data if guarantor', () => {
    defaultProps.applicant.role = ROLE_GUARANTOR
    const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);
    expect(
        wrapper.getElement()
    ).toMatchSnapshot();
});

it('calls props.pageComplete and _navigate on click continue',  async () => {
    const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);
    await wrapper.find(ActionButton).simulate('click');
    expect(defaultProps._navigate).toHaveBeenCalled();
    expect(defaultProps.pageComplete).toHaveBeenCalledWith('income_verification');
});
