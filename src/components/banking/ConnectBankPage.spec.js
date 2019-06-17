import React from 'react';
import { shallow } from 'enzyme';

import { ConnectBankPage } from 'components/banking/ConnectBankPage';
import API from 'app/api';


it('this.openFinicityIframe sets state to loadingFinicityIframe=true and calls API.createFinicityUrl', () => {
    const wrapper = shallow(<ConnectBankPage/>);

    API.createFinicityUrl = jest.fn().mockReturnValue(Promise.resolve({success: true, reasonCode: "OK"}));

    expect(wrapper.state().loadingFinicityIframe).toEqual(false);
    expect(wrapper.state().showFinicityIframe).toEqual(false);

    wrapper.instance().openFinicityIframe()
    
    expect(API.createFinicityUrl).toHaveBeenCalled();
    expect(wrapper.state().loadingFinicityIframe).toEqual(true);
})