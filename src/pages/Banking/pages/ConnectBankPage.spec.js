import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import { ConnectBankPage } from './ConnectBankPage';

beforeEach(() => {
    global.finicityConnect = {
        connectIFrame: jest.fn(),
    };
});

describe('openFinicityIframe', () => {
    it('sets state to loadingFinicityIframe=true and calls API.createFinicityUrl', () => {
        const wrapper = shallow(<ConnectBankPage />);

        API.createFinicityUrl = jest.fn().mockReturnValue(Promise.resolve({ success: true, reasonCode: 'OK' }));

        expect(wrapper.state().loadingFinicityIframe).toEqual(false);
        expect(wrapper.state().showFinicityIframe).toEqual(false);

        wrapper.instance().openFinicityIframe();

        expect(API.createFinicityUrl).toHaveBeenCalled();
        expect(wrapper.state().loadingFinicityIframe).toEqual(true);
    });
});

describe('handleFetchReports', () => {
    it('calls API.fetchFinicityReports and setState on success', () => {
        const wrapper = shallow(<ConnectBankPage />);

        const data = {
            json: () => {
                'yeehaw';
            },
        };

        API.fetchFinicityReports = jest.fn().mockReturnValue(Promise.resolve(data));

        wrapper.instance().handleFetchReports();
        expect(API.fetchFinicityReports).toHaveBeenCalled();
    });
});

describe('reportNoIncomeAssets', () => {
    it('should submit a financial source for no income/assets then refresh sources and redirect', () => {
        const targetRoute = '/test/route';
        const mockHistory = { push: jest.fn() };
        const mockContext = { refreshFinancialSources: jest.fn(), toggleLoader: jest.fn() };

        API.submitFinancialSource = jest.fn().mockResolvedValue({});

        const wrapper = shallow(<ConnectBankPage history={mockHistory} />);
        const instance = wrapper.instance();

        instance.context = mockContext;

        return wrapper
            .instance()
            .reportNoIncomeAssets({ preventDefault: () => {} }, targetRoute)
            .then(() => {
                expect(API.submitFinancialSource).toHaveBeenCalled();
                expect(mockContext.refreshFinancialSources).toHaveBeenCalledWith();
                expect(mockHistory.push).toHaveBeenCalledWith(targetRoute);
            });
    });
});
