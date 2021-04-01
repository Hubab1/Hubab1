import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import { ConnectBankPage } from './ConnectBankPage';

const defaultProps = {
    application: {
        id: 1,
    },
};

beforeEach(() => {
    global.finicityConnect = {
        connectIFrame: jest.fn(),
    };
});

describe('openFinicityIframe', () => {
    it('sets state to loadingFinicityIframe=true and calls API.createFinicityUrl', () => {
        const wrapper = shallow(<ConnectBankPage {...defaultProps} />);

        API.createFinicityUrl = jest.fn().mockReturnValue(Promise.resolve({ success: true, reasonCode: 'OK' }));

        expect(wrapper.state().loadingFinicityIframe).toEqual(false);
        expect(wrapper.state().showFinicityIframe).toEqual(false);

        wrapper.instance().openFinicityIframe();

        expect(API.createFinicityUrl).toHaveBeenCalled();
        expect(wrapper.state().loadingFinicityIframe).toEqual(true);
    });
});

describe('unmount', () => {
    it('calls finicityConnect.destroyIFrame', () => {
        window.finicityConnect.destroyIFrame = jest.fn();

        const wrapper = shallow(<ConnectBankPage />);
        wrapper.unmount();
        expect(window.finicityConnect.destroyIFrame).toHaveBeenCalled();
    });
});

describe('handleFetchReports', () => {
    it('calls API.fetchFinicityReports and setState on success', () => {
        const wrapper = shallow(<ConnectBankPage {...defaultProps} />);

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
