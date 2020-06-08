import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import {act} from "react-dom/test-utils";

import { AddIncomeSource } from './AddIncomeSource';
import { ROUTES } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        history: {
            push: jest.fn()
        },
        initialValues: {
            income_type: 10,
            estimated_amount: '1111'
        }
    }
})

it('matches snapshot', () => {
    const wrapper = shallow(<AddIncomeSource {...defaultProps}/>);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Disables submit if all values not set', async () => {
    const wrapper = shallow(<AddIncomeSource {...defaultProps} initialValues={undefined}/>);
    expect(wrapper.find(Formik).dive().find(ActionButton).prop('disabled')).toBe(true);
});


it('Goes back to manual income verification page on submit', async () => {
    const wrapper = shallow(<AddIncomeSource {...defaultProps}/>);
    expect(wrapper.find(Formik).dive().find(ActionButton).prop('disabled')).toBe(false);
    wrapper.find(Formik).dive().find('form').simulate('submit');
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(defaultProps.history.push).toHaveBeenCalledWith(ROUTES.MANUAL_INCOME_VERIFICATION);
});
