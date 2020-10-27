import React from 'react';
import { shallow } from 'enzyme';
import { IncomeVerificationSummaryPage, IncomeOrAssetItemWarning } from './IncomeVerificationSummaryPage';
import {
    ROLE_GUARANTOR,
    ROLE_PRIMARY_APPLICANT,
    FINANCIAL_STREAM_STATUS_PENDING,
    FINANCIAL_STREAM_STATUS_INCOMPLETE,
} from 'app/constants';

const mockUseContext = jest.spyOn(React, 'useContext');

let defaultProps;
beforeEach(() => {
    defaultProps = {
        history: {
            push: jest.fn(),
        },
        goBack: jest.fn(),
        applicant: {
            role: ROLE_PRIMARY_APPLICANT,
        },
        config: {
            guarantor_income_requirement_multiplier: 80,
            applicant_income_requirements: 40,
        },
        profile: {
            unit: {
                price: 1000,
            },
        },
    };
});

function mockBankingData(incomeSources, assetSources, incomeTotal, assetTotal, reportedNoIncomeAssets) {
    mockUseContext.mockImplementation(() => ({
        bankingData: {
            income_sources: incomeSources,
            asset_sources: assetSources,
            income_total: incomeTotal,
            asset_total: assetTotal,
            reported_no_income_assets: reportedNoIncomeAssets,
        },
    }));
}

// it('matches snapshot with some financial sources data', () => {
//     const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);
//     expect(wrapper.getElement()).toMatchSnapshot();
// });
//
// it('matches snapshot with some financial sources data if guarantor', () => {
//     defaultProps.applicant.role = ROLE_GUARANTOR;
//     const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);
//     expect(wrapper.getElement()).toMatchSnapshot();
// });
//
// it('matches snapshot with some financial sources data - with warnings', () => {
//     const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);
//     expect(wrapper.getElement()).toMatchSnapshot();
// });
//
// it('matches snapshot with some financial sources data if guarantor - with warnings', () => {
//     defaultProps.applicant.role = ROLE_GUARANTOR;
//     const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);
//     expect(wrapper.getElement()).toMatchSnapshot();
// });
//
it('matches snapshot with no financial sources data', () => {
    mockBankingData([], [], '0.00', '0.00', false);

    const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot when no financial sources data, but reported no income/assets', () => {
    mockBankingData([], [], '0.00', '0.00', true);

    const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot with only asset sources - with warning', () => {
    mockBankingData(
        [],
        [
            {
                id: 125,
                income_or_asset_type: 510,
                estimated_amount: 40000,
                adjusted_amount: null,
                uploaded_documents: [],
                status: 40,
            },
        ],
        '100000.00',
        '40000.00',
        false
    );

    const wrapper = shallow(<IncomeVerificationSummaryPage {...defaultProps} />);

    expect(wrapper.getElement()).toMatchSnapshot();
});

describe('IncomeOrAssetItemWarning', () => {
    it('wont render anything is the source is not incomplete', () => {
        const wrapper = shallow(
            <IncomeOrAssetItemWarning source={{ status: FINANCIAL_STREAM_STATUS_PENDING }} isAsset />
        );

        expect(wrapper.type()).toEqual(null);
    });

    it('renders warning for incomplete asset source with an adjusted amount', () => {
        const wrapper = shallow(
            <IncomeOrAssetItemWarning
                source={{
                    status: FINANCIAL_STREAM_STATUS_INCOMPLETE,
                    adjusted_amount: 1000,
                }}
                isAsset
            />
        );

        expect(wrapper.text()).toBe('The documents for this asset source show a value of $1,000.');
    });

    it('renders warning for incomplete asset source without an adjusted amount', () => {
        const wrapper = shallow(
            <IncomeOrAssetItemWarning
                source={{
                    status: FINANCIAL_STREAM_STATUS_INCOMPLETE,
                    adjusted_amount: 0,
                }}
                isAsset
            />
        );

        expect(wrapper.text()).toBe('This asset source has been marked as having incorrect or insufficient documents.');
    });

    it('renders warning for incomplete income source with an adjusted amount', () => {
        const wrapper = shallow(
            <IncomeOrAssetItemWarning
                source={{
                    status: FINANCIAL_STREAM_STATUS_INCOMPLETE,
                    adjusted_amount: 1000,
                }}
                isAsset={false}
            />
        );

        expect(wrapper.text()).toBe('The documents for this income source show earnings of $1,000/year.');
    });

    it('renders warning for incomplete income source without an adjusted amount', () => {
        const wrapper = shallow(
            <IncomeOrAssetItemWarning
                source={{
                    status: FINANCIAL_STREAM_STATUS_INCOMPLETE,
                    adjusted_amount: 0,
                }}
                isAsset={false}
            />
        );

        expect(wrapper.text()).toBe(
            'This income source has been marked as having incorrect or insufficient documents.'
        );
    });
});
