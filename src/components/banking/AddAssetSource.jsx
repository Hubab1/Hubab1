import React, {useState, useContext} from 'react';
import styled from '@emotion/styled';
import { BackLink } from 'components/common/BackLink';
import { H1, H3, Spacer } from 'assets/styles';
import piggyBank from 'assets/images/piggy-bank.png';
import { ROUTES, FINANCIAL_STREAM_ASSET } from 'app/constants';
import API from 'app/api';
import AddFinancialSourceForm from './AddFinancialSourceForm';
import GenericFormMessage from 'components/common/GenericFormMessage';
import BankingContext from './BankingContext';
const ERROR_UPLOAD = 'Oops! We had some trouble uploading your files. Please try again in a little bit.';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export const Img = styled.img`
    height: 83px;
`;

export function AddAssetSource (props) {
    const context = useContext(BankingContext);
    const [errors, setErrors] = useState([]);
    const onSubmit = async (values, {setErrors, setSubmitting}) => {
        setSubmitting(true);
        setErrors([]);

        const formData = new FormData();
        formData.append('income_or_asset_type', values.income_or_asset_type);
        formData.append('estimated_amount', values.estimated_amount.replace(/,/g, ''));
        formData.append('stream_type', FINANCIAL_STREAM_ASSET);
        formData.append('other', values.other);
        if (values.uploadedDocuments) {
            for (const key of Object.keys(values.uploadedDocuments)) {
                values.uploadedDocuments[key].files.forEach(v => {
                    formData.append(`${key}[]`, v.file);
                });
            }
        }
        let response;
        try {
            response = await API.submitFinancialSource(formData);
        } catch {
            setErrors([ERROR_UPLOAD]);
            return setSubmitting(false);
        }
        if (response.status !== 200) {
            const errors = await response.json();
            if (errors) {
                setErrors(errors);
            }
            setSubmitting(false);
            setErrors([ERROR_UPLOAD]);
            return;
        }
        context.refreshFinancialSources();
        props.history.push(`${ROUTES.INCOME_VERIFICATION_SUMMARY}#asset`);
        setSubmitting(false);
        setErrors([]);
    };

    return (
        <>
            <SkinnyH1>Add Proof of Assets</SkinnyH1>
            <SpacedH3>Fill in the details below to add your proof of assets.</SpacedH3>
            {errors.length > 0 && (
                <GenericFormMessage
                    type="error"
                    messages={errors}
                />
            )}
            <Img alt="piggy bank" src={piggyBank} />
            <Spacer height={30}/>
            <AddFinancialSourceForm
                initialValues={props.initialValues}
                financialType={FINANCIAL_STREAM_ASSET}
                onSubmit={onSubmit}
                setError={(err) => setErrors(err)}
            />
            <BackLink to={`${ROUTES.INCOME_VERIFICATION_SUMMARY}#asset`}/>
        </>
    );
}

export default AddAssetSource;
