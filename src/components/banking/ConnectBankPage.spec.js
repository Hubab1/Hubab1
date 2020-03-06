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


it('this.parseReportData updates state with correct data', () => {
    const reportData = {
        voa: {
            assets: {
                beginningBalance: 36942.3,
                currentBalance: 38362.3,
                sixMonthAverage: 37537.88,
                twoMonthAverage: 37843.94,
            },
        },
        voi: {
            institutions: [{
                accounts: [{
                    incomeStreams: [
                        { 
                            name: 'employer 1',
                            projectedGrossAnnual: 6384,
                            id: 'dkfjdsf-1',
                        },
                        { 
                            name: 'employer 2',
                            projectedGrossAnnual: 1234,
                            id: 'dkfjdsf-2',
                        }
                    ]
                }]

            }]
        }
    }
    const wrapper = shallow(<ConnectBankPage/>);

    const expectedIncomeEntries = [
        { 
            name: 'employer 1',
            income: 6384,
            id: 'dkfjdsf-1',
        },
        { 
            name: 'employer 2',
            income: 1234,
            id: 'dkfjdsf-2',
        }
    ];
    wrapper.instance().parseReportData(reportData);

    expect(wrapper.state().reportData.incomeEntries).toEqual(expectedIncomeEntries);    
    expect(wrapper.state().reportData.incomeTotal).toEqual(7618);    
    expect(wrapper.state().reportData.assetsTotal).toEqual(38362.3);    
})

it('if EVENT_INCOME_REPORTS_GENERATED is in applicant.events on mount, sets state.loadingReport = true', () => {
    const defaultProps = {applicant : {events: [{ "event": "45" }]}}
    const wrapper = shallow(<ConnectBankPage {...defaultProps} />);

    wrapper.instance().checkReportsGenerated = jest.fn();

    wrapper.instance().componentDidMount()

    expect(wrapper.instance().checkReportsGenerated).toHaveBeenCalled();
    expect(wrapper.state().loadingReport).toBeTruthy();

})

it('if EVENT_INCOME_REPORTS_GENERATED is not in applicant.events on mount, does not set state.loadingReport = true', () => {
    const defaultProps = {applicant : {events: [{ "event": "22" }]}}

    const wrapper = shallow(<ConnectBankPage {...defaultProps} />);

    wrapper.instance().checkReportsGenerated = jest.fn();

    wrapper.instance().componentDidMount()

    expect(wrapper.instance().checkReportsGenerated).toHaveBeenCalled();
    expect(wrapper.state().loadingReport).not.toBeTruthy();


})
