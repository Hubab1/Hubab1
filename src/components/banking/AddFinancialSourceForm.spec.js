import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { INCOME_TYPE_OTHER } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';
import API from 'app/api';
import { AddFinancialSourceForm } from './AddFinancialSourceForm';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        history: {
            push: jest.fn()
        },
        initialValues: {
            income_or_asset_type: 10,
            estimated_amount: '1111'
        }
    }
});

it('Disables submit if all values not set', async () => {
    const wrapper = shallow(<AddFinancialSourceForm {...defaultProps} initialValues={undefined}/>);
    expect(wrapper.find(Formik).dive().find(ActionButton).prop('disabled')).toBe(true);
});

it('Matches snapshot showing other field', async () => {
    const form = shallow(<AddFinancialSourceForm {...defaultProps} initialValues={{income_or_asset_type: INCOME_TYPE_OTHER}}/>).find(Formik).dive().find('form');
    expect(form.getElement()).toMatchSnapshot();
});
