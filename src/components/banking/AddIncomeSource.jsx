import React from 'react';
import styled from '@emotion/styled';

import { BackLink } from 'components/common/BackLink';
import { H1, H3, Spacer } from 'assets/styles';
import finance from 'assets/images/finance.png';
import captureRoute from 'app/captureRoute';
import { ROUTES, FINANCIAL_STREAM_INCOME } from 'app/constants';
import API from 'app/api';
import AddFinancialSourceForm from './AddFinancialSourceForm';
const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export function AddIncomeSource (props) {
    const onSubmit = async (values, {setErrors, setSubmitting}) => {
        setSubmitting(true);
        const payload = Object.assign(
            {
                income_or_asset_type: values.income_or_asset_type,
                estimated_amount: values.estimated_amount.replace(/,/g, ''),
                stream_type: FINANCIAL_STREAM_INCOME,
                // uploaded_documents: values.uploadedDocuments,
                other: values.other,
            },
        );
        let response;
        try {
            response = await API.submitFinancialSource(payload);
        } catch {
            return setSubmitting(false);
        }
        if (response.status !== 200) {
            const errors = await response.json();
            if (errors) {
                setErrors(errors);
            }
            setSubmitting(false);
            return;
        }
        props.history.push(ROUTES.MANUAL_INCOME_VERIFICATION);
        setSubmitting(false);
    };

    return (
        <>
            <SkinnyH1>Add an Income Source</SkinnyH1>
            <SpacedH3>Fill in the details below to add your income source.</SpacedH3>
            <img alt="coin" src={finance} />
            <Spacer height={30}/>
            <AddFinancialSourceForm
                initialValues={props.initialValues}
                financialType={FINANCIAL_STREAM_INCOME}
                onSubmit={onSubmit}
            />
            <BackLink to={ROUTES.MANUAL_INCOME_VERIFICATION}/>
        </>
    );
}
AddIncomeSource.route = ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME;

export default captureRoute(AddIncomeSource);
