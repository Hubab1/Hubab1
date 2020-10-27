import React from 'react';
import { shallow } from 'enzyme';
import BankingContext from './BankingContext';
import { IncomeVerificationSummaryPage, IncomeOrAssetItemWarning } from './IncomeVerificationSummaryPage';
import {
    ROLE_GUARANTOR,
    ROLE_PRIMARY_APPLICANT,
    FINANCIAL_STREAM_STATUS_PENDING,
    FINANCIAL_STREAM_STATUS_INCOMPLETE,
} from 'app/constants';

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

function renderWithMockBankingData(incomeSourcesa, assetSources, incomeTotal, assetTotal, reportedNoIncomeAssets) {
    const contextData = {
        bankingData: {
            income_sources: incomeSourcesa,
            asset_sources: assetSources,
            income_total: incomeTotal,
            asset_total: assetTotal,
            reported_no_income_assets: reportedNoIncomeAssets,
        },
    };

    return shallow(
        <BankingContext.Provider value={contextData}>
            <IncomeVerificationSummaryPage {...defaultProps} />
        </BankingContext.Provider>
    );
}

const incomeSources = [
    {
        id: 123,
        income_or_asset_type: 105,
        estimated_amount: 100000,
        uploaded_documents: [
            {
                id: 4,
                filename: 'w2-1.pdf',
                type: {
                    label: 'W2',
                    id: 1,
                },
            },
        ],
    },
    {
        id: 124,
        income_or_asset_type: 135,
        estimated_amount: 100000,
        uploaded_documents: [],
    },
    {
        id: 125,
        income_or_asset_type: 500,
        estimated_amount: 100000,
        uploaded_documents: [
            {
                id: 1,
                filename: 'w2-1.pdf',
                type: {
                    label: 'W2',
                    id: 1,
                },
            },
            {
                id: 2,
                filename: 'w2-2.pdf',
                type: {
                    label: 'W2',
                    id: 1,
                },
            },
            {
                id: 3,
                filename: 'w3.pdf',
                type: {
                    label: 'W3',
                    id: 2,
                },
            },
        ],
    },
];
const assetSources = [
    {
        id: 125,
        income_or_asset_type: 510,
        estimated_amount: 40000,
        uploaded_documents: [],
    },
];
const incomeTotal = '100000.00';
const assetTotal = '40000.00';

it('matches snapshot with some financial sources data', () => {
    const wrapper = renderWithMockBankingData(incomeSources, assetSources, incomeTotal, assetTotal, false);

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot with some financial sources data if guarantor', () => {
    defaultProps.applicant.role = ROLE_GUARANTOR;

    const wrapper = renderWithMockBankingData(incomeSources, assetSources, incomeTotal, assetTotal, false);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot when reported no income or assets', () => {
    const wrapper = renderWithMockBankingData(incomeSources, assetSources, incomeTotal, assetTotal, true);

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot with some financial sources data - with warnings', () => {
    const wrapper = renderWithMockBankingData(
        [
            {
                id: 124,
                income_or_asset_type: 135,
                estimated_amount: 100000,
                adjusted_amount: 100020,
                uploaded_documents: [],
                status: 40,
            },
            {
                id: 124,
                income_or_asset_type: 135,
                estimated_amount: 100000,
                adjusted_amount: null,
                uploaded_documents: [],
                status: 40,
            },
        ],
        [
            {
                id: 125,
                income_or_asset_type: 510,
                estimated_amount: 40000,
                adjusted_amount: 40020,
                uploaded_documents: [],
                status: 40,
            },
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

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot with some financial sources data if guarantor - with warnings', () => {
    defaultProps.applicant.role = ROLE_GUARANTOR;

    const wrapper = renderWithMockBankingData(
        [
            {
                id: 124,
                income_or_asset_type: 135,
                estimated_amount: 100000,
                adjusted_amount: 100020,
                uploaded_documents: [],
                status: 40,
            },
            {
                id: 124,
                income_or_asset_type: 135,
                estimated_amount: 100000,
                adjusted_amount: null,
                uploaded_documents: [],
                status: 40,
            },
        ],
        [
            {
                id: 125,
                income_or_asset_type: 510,
                estimated_amount: 40000,
                adjusted_amount: 40020,
                uploaded_documents: [],
                status: 40,
            },
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

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot with no financial sources data', () => {
    const wrapper = renderWithMockBankingData([], [], '100000.00', '40000.00', false);

    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot with only asset sources - with warning', () => {
    const wrapper = renderWithMockBankingData(
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
