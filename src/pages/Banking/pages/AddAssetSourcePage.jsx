import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import API from 'api/api';
import { ROUTES, FINANCIAL_STREAM_ASSET } from 'constants/constants';
import { getFinancialSourceRequestBody, getUploadDocumentRequestBody } from 'utils/misc';
import { getUploadDocumentsOneByOne } from 'selectors/launchDarkly';
import { logToSentry } from 'utils/sentry';

import { BackLink } from 'common-components/BackLink/BackLink';
import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';
import BankingContext from 'pages/Banking/BankingContext';
import AddFinancialSourceForm from 'pages/Banking/components/AddFinancialSourceForm';
import { H1, H3, Spacer } from 'assets/styles';
import piggyBank from 'assets/images/piggy-bank.png';
import { generatePath } from 'react-router';

const ERROR_UPLOAD =
    'Oops, we had some trouble uploading your files. ' +
    'Be sure to use documents with unique filenames and refrain from renaming them during the upload process. ' +
    'If you continue to have issues, please contact an agent or try again later.';

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

// TODO: refactor component usable for both income and assets? created by: @JimVercoelen | Ticket: NESTIO-19929
export function AddAssetSourcePage(props) {
    const context = useContext(BankingContext);
    const [errors, setErrors] = useState([]);
    const url = generatePath(`${ROUTES.INCOME_VERIFICATION_SUMMARY}#asset`, { application_id: props.application.id });

    const onSubmit = async (values, { setSubmitting }) => {
        context.toggleLoader(true);
        setSubmitting(true);
        setErrors([]);

        const formData = getFinancialSourceRequestBody(values, FINANCIAL_STREAM_ASSET, props.vgsEnabled);
        if (!formData) {
            setErrors([ERROR_UPLOAD]);
            context.toggleLoader(false);
            setSubmitting(false);
        }
        try {
            await API.submitFinancialSource(props.application.id, formData, props.vgsEnabled);
            context.refreshFinancialSources();
            await context.fetchRenterProfile();
            props.history.push(
                generatePath(`${ROUTES.INCOME_VERIFICATION_SUMMARY}#asset`, { application_id: props.application.id })
            );
        } catch (e) {
            await logToSentry(e.response || e);
            setErrors([ERROR_UPLOAD]);
        } finally {
            context.toggleLoader(false);
            setSubmitting(false);
        }
    };

    const onSubmitOneByOne = async (values, { setSubmitting }) => {
        context.toggleLoader(true);
        setSubmitting(true);
        setErrors([]);
        try {
            const { estimated_amount, income_or_asset_type, other, uploadedDocuments } = values;
            const body = { estimated_amount, stream_type: FINANCIAL_STREAM_ASSET, income_or_asset_type, other };
            const stream = await API.createFinancialSource(props.application.id, body);

            if (uploadedDocuments) {
                for (const key of Object.keys(uploadedDocuments)) {
                    for (const v of uploadedDocuments[key].files) {
                        if (!(v.file && v.file.size)) return null;
                        const data = getUploadDocumentRequestBody(v, stream.id, key, props.vgsEnabled);
                        await API.uploadFinancialDocument(props.application.id, data, props.vgsEnabled);
                    }
                }
            }
            context.refreshFinancialSources();
            await context.fetchRenterProfile();
            props.history.push(url);
        } catch (e) {
            await logToSentry(e.response || e);
            setErrors([ERROR_UPLOAD]);
        } finally {
            context.toggleLoader(false);
            setSubmitting(false);
        }
    };

    return (
        <>
            <SkinnyH1>Add Proof of Assets</SkinnyH1>
            <SpacedH3>Fill in the details below to add your proof of assets.</SpacedH3>
            {errors.length > 0 && <GenericFormMessage type="error" messages={errors} />}
            <Img alt="piggy bank" src={piggyBank} />
            <Spacer height={30} />
            <AddFinancialSourceForm
                initialValues={props.initialValues}
                financialType={FINANCIAL_STREAM_ASSET}
                onSubmit={props.uploadDocumentsOneByOne ? onSubmitOneByOne : onSubmit}
                setError={(err) => setErrors(err)}
            />
            <BackLink
                to={generatePath(`${ROUTES.INCOME_VERIFICATION_SUMMARY}#asset`, {
                    application_id: props.application.id,
                })}
            />
        </>
    );
}

AddAssetSourcePage.propTypes = {
    history: PropTypes.object,
    initialValues: PropTypes.object,
    vgsEnabled: PropTypes.bool,
    application: PropTypes.object.isRequired,
    uploadDocumentsOneByOne: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    vgsEnabled: !state.configuration.use_demo_config,
    application: state.renterProfile,
    uploadDocumentsOneByOne: getUploadDocumentsOneByOne(state),
});

export default connect(mapStateToProps)(AddAssetSourcePage);
