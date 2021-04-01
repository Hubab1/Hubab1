import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';

import * as sentryUtils from 'utils/sentry';
import { ROUTES } from 'constants/constants';
import API from 'api/api';
import { AddAssetSourcePage } from './AddAssetSourcePage';
import AddFinancialSourceForm from 'pages/Banking/components/AddFinancialSourceForm';
import { generatePath } from 'react-router';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useContext: () => ({
        refreshFinancialSources: () => {},
        fetchRenterProfile: () => {},
        toggleLoader: () => {},
    }),
}));

let defaultProps;
beforeEach(() => {
    defaultProps = {
        history: {
            push: jest.fn(),
        },
        initialValues: {
            income_or_asset_type: 10,
            estimated_amount: '1111',
        },
        application: {
            id: 1,
        },
    };
});

afterEach(() => {
    jest.restoreAllMocks();
});

it('matches snapshot', () => {
    const wrapper = shallow(<AddAssetSourcePage {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});
