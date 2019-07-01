import React from 'react';
import { shallow } from 'enzyme';

import { ConnectBankPage } from 'components/banking/ConnectBankPage';
import API from 'app/api';

beforeEach(() => {
    global.finicityConnect = {
        connectIFrame: jest.fn()
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

    const data = {reportData: 'yeehaw'};

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
            incomeKey: 'dkfjdsf-1',
            key: 'dkfjdsf-1',
        },
        { 
            name: 'employer 2',
            income: 1234,
            incomeKey: 'dkfjdsf-2',
            key: 'dkfjdsf-2',
        }
    ];
    wrapper.instance().parseReportData(reportData);

    expect(wrapper.state().incomeEntries).toEqual(expectedIncomeEntries);    
    expect(wrapper.state().incomeTotal).toEqual(7618);    
    expect(wrapper.state().assetsTotal).toEqual(38362.3);    
})