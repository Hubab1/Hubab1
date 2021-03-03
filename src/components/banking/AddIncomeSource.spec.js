import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';

import * as sentryUtils from 'utils/sentry';
import { ROUTES } from 'app/constants';
import API from 'app/api';
import { AddIncomeSource } from './AddIncomeSource';
import AddFinancialSourceForm from './AddFinancialSourceForm';

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
    };
});

afterEach(() => {
    jest.restoreAllMocks();
});

it('matches snapshot', () => {
    const wrapper = shallow(<AddIncomeSource {...defaultProps} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Goes back to manual income verification page on submit', async () => {
    jest.spyOn(API, 'submitFinancialSource').mockReturnValue(Promise.resolve({
        status: 200
    }));
    const wrapper = shallow(<AddIncomeSource {...defaultProps} />);
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
    expect(defaultProps.history.push).toHaveBeenCalledWith(`${ROUTES.INCOME_VERIFICATION_SUMMARY}#income`);
});

it('Doesnt go back on failure to submit', async () => {
    const logToSentry = jest.spyOn(sentryUtils, 'logToSentry');
    jest.spyOn(API, 'submitFinancialSource').mockReturnValue(Promise.reject({
        status: 400,
        json: () => ({ income_or_asset_type: ['Required'] })
    }));
    const wrapper = shallow(<AddIncomeSource {...defaultProps} />);

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
