import { UploadDocuments } from './UploadDocuments';
import {shallow, mount} from "enzyme";
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
                                    max_required: 3,
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
                                    max_required: 3,
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
                                    max_required: 3,
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
    expect(wrapper.childAt(0).text()).toMatch('Proof of income:')
});

it('Test title when uploading for asset', () => {
    const wrapper = shallow(<UploadDocuments {...defaultProps} streamType={FINANCIAL_STREAM_ASSET} incomeOrAssetType={105} store={store} />);
    expect(wrapper.childAt(0).text()).toMatch('Proof of asset:')
});

it('Case no uploaded documents', () => {
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{}}
        />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Case documents uploaded', () => {
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{
                // Case 1 doc
                '1': {
                    id:1,
                    label: 'W2',
                    files:[
                        {name: 'abc.png'},
                    ]
                },
                // Case stacked
                '2': {
                    id:1,
                    label: 'W2',
                    files:[
                        {name: 'def.pdf'},
                        {name: 'ghi.jpg'},
                    ]
                }
            }}
        />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Case minimum uploaded not met', () => {
    const config = {
        financial_documents_validations:
            [
                {
                    stream_type: 5,
                    proof_documents:
                        [
                            {
                                min_required: 2,
                                id: 1,
                                description: 'W2 tax form',
                                max_required: 3,
                                label: 'W2',
                            },
                        ],
                    lease_settings: 2,
                    require_all: false,
                    income_or_asset_type: 105,
                },
            ],
    };
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            config={config}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{
                '1': {
                    id:1,
                    label: 'W2',
                    files:[
                        {name: 'abc.png'},
                    ]
                },
            }}
        />);
    expect(wrapper.find('input').length).toBe(1);
});

it('Case minimum uploaded met', () => {
    const config = {
        financial_documents_validations:
            [
                {
                    stream_type: 5,
                    proof_documents:
                        [
                            {
                                min_required: 2,
                                id: 1,
                                description: 'W2 tax form',
                                max_required: 3,
                                label: 'W2',
                            },
                        ],
                    lease_settings: 2,
                    require_all: false,
                    income_or_asset_type: 105,
                },
            ],
    };
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            config={config}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{
                '1': {
                    id:1,
                    label: 'W2',
                    files:[
                        {name: 'abc.png'},
                        {name: 'def.png'},
                    ]
                },
            }}
        />);
    expect(wrapper.find('input').length).toBe(1);
});

it('Case maximum uploaded met', () => {
    const config = {
        financial_documents_validations:
            [
                {
                    stream_type: 5,
                    proof_documents:
                        [
                            {
                                min_required: 2,
                                id: 1,
                                description: 'W2 tax form',
                                max_required: 3,
                                label: 'W2',
                            },
                        ],
                    lease_settings: 2,
                    require_all: false,
                    income_or_asset_type: 105,
                },
            ],
    };
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            config={config}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{
                '1': {
                    id:1,
                    label: 'W2',
                    files:[
                        {name: 'abc.png'},
                        {name: 'def.png'},
                        {name: 'ghi.png'},
                    ]
                },
            }}
        />);
    expect(wrapper.find('input').length).toBe(0);
});

it('Case require_all false and no document uploaded', () => {
    const config = {
        financial_documents_validations:
            [
                {
                    stream_type: 5,
                    proof_documents:
                        [
                            {
                                min_required: 2,
                                id: 1,
                                description: 'W2 tax form',
                                max_required: 3,
                                label: 'W2',
                            },
                            {
                                min_required: 2,
                                id: 2,
                                description: '1099 tax form',
                                max_required: 3,
                                label: '1099',
                            },
                        ],
                    lease_settings: 2,
                    require_all: false,
                    income_or_asset_type: 105,
                },
            ],
    };
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            config={config}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{}}
        />);
    expect(wrapper.find('#radioButton1').prop('disabled')).toBe(false);
    expect(wrapper.find('#radioButton2').prop('disabled')).toBe(false);
});

it('Case require_all false and one of documents types uploaded, disable the rest', () => {
    const config = {
        financial_documents_validations:
            [
                {
                    stream_type: 5,
                    proof_documents:
                        [
                            {
                                min_required: 2,
                                id: 1,
                                description: 'W2 tax form',
                                max_required: 3,
                                label: 'W2',
                            },
                            {
                                min_required: 2,
                                id: 2,
                                description: '1099 tax form',
                                max_required: 3,
                                label: '1099',
                            },
                        ],
                    lease_settings: 2,
                    require_all: false,
                    income_or_asset_type: 105,
                },
            ],
    };
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            config={config}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{
                '1': {
                    id:1,
                    label: 'W2',
                    files:[
                        {name: 'abc.png'},
                    ]
                },
            }}
        />);
    expect(wrapper.find('#radioButton1').prop('disabled')).toBe(false);
    expect(wrapper.find('#radioButton2').prop('disabled')).toBe(true);
});

it('Case require_all is true and only one document type met minimum', () => {
    const config = {
        financial_documents_validations:
            [
                {
                    stream_type: 5,
                    proof_documents:
                        [
                            {
                                min_required: 2,
                                id: 1,
                                description: 'W2 tax form',
                                max_required: 2,
                                label: 'W2',
                            },
                            {
                                min_required: 1,
                                id: 2,
                                description: '1099 tax form',
                                max_required: 3,
                                label: '1099',
                            },
                        ],
                    lease_settings: 2,
                    require_all: true,
                    income_or_asset_type: 105,
                },
            ],
    };
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            config={config}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{
                '1': {
                    id:1,
                    label: 'W2',
                    files:[
                        {name: 'abc.png'},
                        {name: 'def.jpg'},
                    ]
                },
            }}
        />);
    expect(wrapper.find('input').length).toBe(1);
});


it('Case require_all is true and all documents types met min and max requirement', () => {
    const config = {
        financial_documents_validations:
            [
                {
                    stream_type: 5,
                    proof_documents:
                        [
                            {
                                min_required: 2,
                                id: 1,
                                description: 'W2 tax form',
                                max_required: 2,
                                label: 'W2',
                            },
                            {
                                min_required: 1,
                                id: 2,
                                description: '1099 tax form',
                                max_required: 1,
                                label: '1099',
                            },
                        ],
                    lease_settings: 2,
                    require_all: true,
                    income_or_asset_type: 105,
                },
            ],
    };
    const wrapper = shallow(
        <UploadDocuments
            {...defaultProps}
            config={config}
            streamType={FINANCIAL_STREAM_ASSET}
            incomeOrAssetType={105}
            store={store}
            uploadedDocuments={{
                '1': {
                    id:1,
                    label: 'W2',
                    files:[
                        {name: 'abc.png'},
                        {name: 'def.jpg'},
                    ]
                },
                '2': {
                    id: 2,
                    label: '1099',
                    files:[
                        {name: 'abc.png'},
                    ]
                },
            }}
        />);
    expect(wrapper.find('input').length).toBe(0);
});
