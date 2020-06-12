import { UploadDocuments } from './UploadDocuments';
import {shallow} from "enzyme";
import React from "react";
import { FINANCIAL_STREAM_INCOME, FINANCIAL_STREAM_ASSET } from 'app/constants';


let defaultProps;
let store;
beforeEach(() => {
    defaultProps = {
        incomeOrAssetType: 105,
        streamType: FINANCIAL_STREAM_INCOME,
        config: {
            financial_documents_validations:
                [
                    {
                        stream_type: 5,
                        proof_documents:
                            [
                                {
                                    min_required: 1,
                                    id: 1,
                                    description: 'W2 tax form',
                                    max_required: 1,
                                    label: 'W2',
                                }
                            ],
                        lease_settings: 2,
                        require_all: false,
                        income_or_asset_type: 105,
                    },
                    {
                        stream_type: 5,
                        proof_documents:
                            [
                                {
                                    min_required: 1,
                                    id: 2,
                                    description: '1099 IRS Tax Form',
                                    max_required: 1,
                                    label: '1099 Form'
                                },
                                {
                                    min_required: 3,
                                    id: 3,
                                    description: '3 latest pay-stubs',
                                    max_required: 3,
                                    label: '3 Paystubs'
                                }
                            ],
                        lease_settings: 2,
                        require_all: false,
                        income_or_asset_type: 110,
                    },
                    {
                        stream_type: 5,
                        proof_documents:
                            [
                                {
                                    min_required: 1,
                                    id: 1,
                                    description: 'W2 tax form',
                                    max_required: 1,
                                    label: 'W2'
                                },
                                {
                                    min_required: 1,
                                    id: 2,
                                    description: '1099 IRS Tax Form',
                                    max_required: 1,
                                    label: '1099 Form'
                                }
                            ],
                        lease_settings: 2,
                        require_all: true,
                        income_or_asset_type: 115
                    }
                ],
        },
    }
});

it('Case only one required document', () => {
    const wrapper = shallow(<UploadDocuments {...defaultProps} incomeOrAssetType={105} store={store}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Case multiple required document (require all)', () => {
    const wrapper = shallow(<UploadDocuments {...defaultProps} incomeOrAssetType={115} store={store}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Case require one of multiple document', () => {
    const wrapper = shallow(<UploadDocuments {...defaultProps} incomeOrAssetType={110} store={store}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Test title when uploading for income', () => {
    const wrapper = shallow(<UploadDocuments {...defaultProps} streamType={FINANCIAL_STREAM_INCOME} incomeOrAssetType={105} store={store} />);
    console.log(wrapper.html());
    expect(wrapper.childAt(0).text()).toMatch('Proof of income:')
});

it('Test title when uploading for asset', () => {
    const wrapper = shallow(<UploadDocuments {...defaultProps} streamType={FINANCIAL_STREAM_ASSET} incomeOrAssetType={105} store={store} />);
    console.log(wrapper.html());
    expect(wrapper.childAt(0).text()).toMatch('Proof of asset:')
});
