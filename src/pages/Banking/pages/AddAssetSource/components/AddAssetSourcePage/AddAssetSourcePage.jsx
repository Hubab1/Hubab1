import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import API from 'api/api';
import { ROUTES, FINANCIAL_STREAM_ASSET } from 'constants/constants';
import { getFinancialSourceRequestBody } from 'utils/misc';
import { logToSentry } from 'utils/sentry';

import { BackLink } from 'components//BackLink/BackLink';
import GenericFormMessage from 'components//GenericFormMessage/GenericFormMessage';
import BankingContext from 'pages/Banking/BankingContext';
import AddFinancialSourceForm from 'pages/Banking/components/AddFinancialSourceForm/AddFinancialSourceForm';
import { H1, H3, Spacer } from 'assets/styles';
import piggyBank from 'assets/images/piggy-bank.png';

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
            await API.submitFinancialSource(formData, props.vgsEnabled);
            context.refreshFinancialSources();
            await context.fetchRenterProfile();
            props.history.push(`${ROUTES.INCOME_VERIFICATION_SUMMARY}#asset`);
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
                onSubmit={onSubmit}
                setError={(err) => setErrors(err)}
            />
            <BackLink to={`${ROUTES.INCOME_VERIFICATION_SUMMARY}#asset`} />
        </>
    );
}

AddAssetSourcePage.propTypes = {
    history: PropTypes.object,
    initialValues: PropTypes.object,
    vgsEnabled: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    vgsEnabled: !state.configuration.use_demo_config,
});

export default connect(mapStateToProps)(AddAssetSourcePage);
