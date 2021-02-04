import React from 'react';
import { shallow } from 'enzyme';
import { HoldingDepositReagreement } from './HoldingDepositReagreement';
import API from 'app/api';
import mockProfile from 'reducers/mock-profile.json';
import mockConfig from 'reducers/mock-config.json';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        profile: mockProfile,
        configuration: mockConfig,
    };
    API.fetchHoldingDepositTerms = jest.fn().mockResolvedValue('');
});

it('Matches snapshot without a start date', () => {
    const wrapper = shallow(<HoldingDepositReagreement {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Matches snapshot with a start date', () => {
    defaultProps.profile.lease_start_date = '14/22/2050';
    const wrapper = shallow(<HoldingDepositReagreement {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
