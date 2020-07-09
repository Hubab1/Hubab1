import React from 'react';
import { shallow } from 'enzyme';

import { ConnectBankPage } from 'components/banking/ConnectBankPage';
import API from 'app/api';

beforeEach(() => {
    global.finicityConnect = {
        connectIFrame: jest.fn(),
    }
})


it('this.openFinicityIframe sets state to loadingFinicityIframe=true and calls API.createFinicityUrl', () => {
    const wrapper = shallow(<ConnectBankPage/>);

    API.createFinicityUrl = jest.fn().mockReturnValue(Promise.resolve({success: true, reasonCode: "OK"}));

    expect(wrapper.state().loadingFinicityIframe).toEqual(false);
    expect(wrapper.state().showFinicityIframe).toEqual(false);

    wrapper.instance().openFinicityIframe()
        
    expect(API.createFinicityUrl).toHaveBeenCalled();
    expect(wrapper.state().loadingFinicityIframe).toEqual(true);
})

it('this.handleFetchReports calls API.fetchFinicityReports and setState on success', () => {
    const wrapper = shallow(<ConnectBankPage/>);

    const data = {json: ()=>{reportData: 'yeehaw'}};

    API.fetchFinicityReports = jest.fn().mockReturnValue(Promise.resolve(data));

    wrapper.instance().handleFetchReports();
    expect(API.fetchFinicityReports).toHaveBeenCalled();  
})

it('if EVENT_INCOME_REPORTS_GENERATED is in applicant.events on mount, sets state.loadingReport = true', () => {
    const defaultProps = {
        applicant : {events: [{ "event": "45" }]},
        history: {
            push: jest.fn()
        },
        refreshFinancialSources: jest.fn().mockResolvedValue({data:{}})
    };

    const wrapper = shallow(<ConnectBankPage {...defaultProps} />);

    wrapper.instance().checkReportsGenerated = jest.fn();

    wrapper.instance().componentDidMount()

    expect(wrapper.instance().checkReportsGenerated).toHaveBeenCalled();
});

it('if EVENT_INCOME_REPORTS_GENERATED is not in applicant.events on mount, does not set state.loadingReport = true', () => {
    const defaultProps = {
        history: {
            push: jest.fn()
        },
        applicant : {events: [{ "event": "22" }]}
    }

    const wrapper = shallow(<ConnectBankPage {...defaultProps} />);

    wrapper.instance().checkReportsGenerated = jest.fn();

    wrapper.instance().componentDidMount()

    expect(wrapper.instance().checkReportsGenerated).toHaveBeenCalled();
    expect(wrapper.state().loadingReport).not.toBeTruthy();


})
