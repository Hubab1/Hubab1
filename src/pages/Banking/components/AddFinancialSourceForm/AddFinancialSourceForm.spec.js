import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { INCOME_TYPE_OTHER } from 'constants/constants';
import ActionButton from 'components//ActionButton/ActionButton';
import { AddFinancialSourceForm } from './AddFinancialSourceForm';

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
        config: {
            financial_documents_validations: [],
        },
    };
});

it('Disables submit if all values not set', async () => {
    const wrapper = shallow(<AddFinancialSourceForm {...defaultProps} initialValues={undefined} />);
    expect(wrapper.find(Formik).dive().find(ActionButton).prop('disabled')).toBe(true);
});

it('Matches snapshot showing other field', async () => {
    const form = shallow(
        <AddFinancialSourceForm {...defaultProps} initialValues={{ income_or_asset_type: INCOME_TYPE_OTHER }} />
    )
        .find(Formik)
        .dive()
        .find('form');
    expect(form.getElement()).toMatchSnapshot();
});

it('Sorts income/asset types by id', async () => {
    const financial_documents_validations = [
        { income_or_asset_type: 505, stream_type: 10 },
        { income_or_asset_type: 510, stream_type: 10 },
        { income_or_asset_type: 500, stream_type: 10 },
    ];
    defaultProps.financialType = 10;
    defaultProps.config = { financial_documents_validations };

    const wrapper = shallow(<AddFinancialSourceForm {...defaultProps} />);
    expect(wrapper.find(Formik).dive().find(Select).dive().find(MenuItem).getElements()[0].key).toBe('500');
    expect(wrapper.find(Formik).dive().find(Select).dive().find(MenuItem).getElements()[1].key).toBe('505');
    expect(wrapper.find(Formik).dive().find(Select).dive().find(MenuItem).getElements()[2].key).toBe('510');
});
