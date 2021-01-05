import React from 'react';
import { shallow } from 'enzyme';

import * as sentryUtils from 'utils/sentry';
import API from 'app/api';
import { EditFinancialSource, ERROR_UPLOAD } from './EditFinancialSource';
import { FINANCIAL_STREAM_STATUS_PENDING } from 'app/constants';
import GenericFormMessage from 'components/common/GenericFormMessage';

const mockGetFinancialSource = (resturnValue) => {
    API.getFinancialSource = jest.fn().mockReturnValue(resturnValue);
};

const mockUpdateFinancialSource = (resturnValue) => {
    API.updateFinancialSource = jest.fn().mockReturnValue(resturnValue);
};

let defaultProps;
beforeEach(() => {
    defaultProps = {
        match: {
            params: {
                id: '666',
            },
        },
        history: {
            push: jest.fn(),
        },
    };
});

afterEach(() => {
    jest.restoreAllMocks();
});

it('sets initial values', async () => {
    mockGetFinancialSource({
        uploaded_documents: [
            {
                id: 3,
                type: {
                    id: 1,
                    label: 'W2',
                },
                filename: 'w2-1.pdf',
            },
            {
                id: 4,
                type: {
                    id: 1,
                    label: 'W2',
                },
                filename: 'w2-2.pdf',
            },
            {
                id: 5,
                type: {
                    id: 2,
                    label: '3 recent paystubs',
                },
                filename: 'paystub1.pdf',
            },
        ],
    });

    const wrapper = await shallow(<EditFinancialSource {...defaultProps} />);

    expect(wrapper.instance().initialValues['uploadedDocuments']).toEqual({
        1: {
            files: [
                { name: 'w2-1.pdf', id: 3 },
                { name: 'w2-2.pdf', id: 4 },
            ],
            label: 'W2',
        },
        2: { files: [{ name: 'paystub1.pdf', id: 5 }], label: '3 recent paystubs' },
    });
});

it('onSubmit submits correct form data', async () => {
    mockUpdateFinancialSource(Promise.resolve({}));
    mockGetFinancialSource({
        uploaded_documents: [
            {
                id: 4,
                type: {
                    id: 1,
                    label: 'W2',
                },
                filename: 'w2-2.pdf',
            },
            {
                id: 5,
                type: {
                    id: 2,
                    label: '3 recent paystubs',
                },
                filename: 'paystub1.pdf',
            },
        ],
    });

    const wrapper = await shallow(<EditFinancialSource {...defaultProps} />);

    wrapper.instance().onSubmit(
        {
            uploadedDocuments: {
                1: { files: [{ name: 'w2-1.pdf', id: 3, file: 'file' }], label: 'W2' },
                2: { files: [{ name: 'paystub1.pdf', id: 5 }], label: '3 recent paystubs' },
            },
        },
        {
            setSubmitting: jest.fn(),
        }
    );

    expect(API.updateFinancialSource.mock.calls[0][0]).toEqual('666');
    const formData = API.updateFinancialSource.mock.calls[0][1];
    expect(formData.getAll('uploaded_documents[]')).toEqual(['5']);
    expect(formData.getAll('1[]')).toEqual(['file']);
    expect(formData.get('status')).toBe(String(FINANCIAL_STREAM_STATUS_PENDING));
});

it('onSubmit handle failire', async () => {
    const logToSentry = jest.spyOn(sentryUtils, 'logToSentry');
    mockUpdateFinancialSource(Promise.reject({ status: 400 }));
    mockGetFinancialSource({
        uploaded_documents: [
            {
                id: 4,
                type: {
                    id: 1,
                    label: 'W2',
                },
                filename: 'w2-2.pdf',
            },
        ],
    });

    const wrapper = await shallow(<EditFinancialSource {...defaultProps} />);

    await wrapper.instance().onSubmit(
        {
            uploadedDocuments: {
                1: { files: [{ name: 'w2-1.pdf', id: 3, file: 'file' }], label: 'W2' },
                2: { files: [{ name: 'paystub1.pdf', id: 5 }], label: '3 recent paystubs' },
            },
        },
        {
            setSubmitting: jest.fn(),
        }
    );

    expect(wrapper.find(GenericFormMessage).length).toBe(1);
    expect(wrapper.find(GenericFormMessage).prop('messages')).toContain(ERROR_UPLOAD);
    expect(logToSentry).toBeCalled();
});
