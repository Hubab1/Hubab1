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

it('Goes back to manual income verification page on submit', async () => {
    jest.spyOn(API, 'createFinancialSource').mockReturnValue(
        Promise.resolve({
            status: 200,
        })
    );
    jest.spyOn(API, 'uploadFinancialDocument').mockReturnValue(
        Promise.resolve({
            status: 200,
        })
    );
    const wrapper = shallow(<AddAssetSourcePage {...defaultProps} />);

    wrapper.find(AddFinancialSourceForm).prop('onSubmit')(
        {
            estimated_amount: '123490',
            income_or_asset_type: 5,
        },
        {
            setSubmitting: () => {},
            setErrors: () => {},
        }
    );

    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(defaultProps.history.push).toHaveBeenCalledWith(
        `${generatePath(ROUTES.INCOME_VERIFICATION_SUMMARY, { application_id: 1 })}#asset`
    );
});

it('Doesnt go back on failure to submit and logs to sentry', async () => {
    const logToSentry = jest.spyOn(sentryUtils, 'logToSentry');
    jest.spyOn(API, 'createFinancialSource').mockReturnValue(
        Promise.reject({
            status: 400,
            json: () => ({ income_or_asset_type: ['Required'] }),
        })
    );

    const wrapper = shallow(<AddAssetSourcePage {...defaultProps} />);

    wrapper.find(AddFinancialSourceForm).prop('onSubmit')(
        {
            estimated_amount: '123490',
            income_or_asset_type: 5,
        },
        {
            setSubmitting: () => {},
            setErrors: () => {},
        }
    );

    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });

    expect(defaultProps.history.push).not.toHaveBeenCalled();
    expect(logToSentry).toBeCalled();
});
