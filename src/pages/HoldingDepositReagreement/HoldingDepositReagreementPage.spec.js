import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import mockProfile from 'reducers/tests/mock-profile.json';
import mockConfig from 'reducers/tests/mock-config.json';
import { HoldingDepositReagreementPage } from './HoldingDepositReagreementPage';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig,
    };
    API.fetchHoldingDepositTerms = jest.fn().mockResolvedValue('');
});

it('Matches snapshot without a start date', () => {
    const wrapper = shallow(<HoldingDepositReagreementPage {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Matches snapshot with a start date', () => {
    defaultProps.profile.lease_start_date = '14/22/2050';
    const wrapper = shallow(<HoldingDepositReagreementPage {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
