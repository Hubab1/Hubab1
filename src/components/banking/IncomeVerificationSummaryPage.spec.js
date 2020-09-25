import React from 'react';
import { shallow } from 'enzyme';
import { IncomeVerificationSummaryPage } from './IncomeVerificationSummaryPage';
import { ROLE_GUARANTOR, ROLE_PRIMARY_APPLICANT } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useContext: () => ({
        bankingData: {
            income_sources: [
                {
                    id: 123,
                    income_or_asset_type: 105,
                    estimated_amount: 100000,
                    uploaded_documents: [{
                        id: 4,
                        filename: 'w2-1.pdf',
                        type: {
                            label: 'W2',
                            id: 1,
                        }
                    }]
                },
                {
                    id: 124,
                    income_or_asset_type: 135,
                    estimated_amount: 100000,
                    uploaded_documents: []
                },
                {
                    id: 125,
                    income_or_asset_type: 500,
                    estimated_amount: 100000,
                    uploaded_documents: [{
                        id: 1,
                        filename: 'w2-1.pdf',
                        type: {
                            label: 'W2',
                            id: 1,
                        }
                    }, {
                        id: 2,
                        filename: 'w2-2.pdf',
                        type: {
                            label: 'W2',
                            id: 1,
                        }
                    }, {
                        id: 3,
                        filename: 'w3.pdf',
                        type: {
                            label: 'W3',
                            id: 2,
                        }
                    }]
                }
            ],
            asset_sources: [
                {
                    id: 125,
                    income_or_asset_type: 510,
                    estimated_amount: 40000,
                    uploaded_documents: []
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
        history: {
            push: jest.fn()
        },
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

    };
});

it('matches snapshot with some financial sources data', () => {
    const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps}/>);
    expect(
        wrapper.getElement()
    ).toMatchSnapshot();
});

it('matches snapshot with some financial sources data if guarantor', () => {
    defaultProps.applicant.role = ROLE_GUARANTOR;
    const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);
    expect(
        wrapper.getElement()
    ).toMatchSnapshot();
});
