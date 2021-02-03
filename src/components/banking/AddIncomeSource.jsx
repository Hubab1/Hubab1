import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { useContext } from 'react';

import API from 'app/api';
import { ROUTES, FINANCIAL_STREAM_INCOME } from 'app/constants';
import { getFinancialSourceRequestBody } from 'utils/misc';
import { logToSentry } from 'utils/sentry';

import { H1, H3, Spacer } from 'assets/styles';
import { BackLink } from 'components/common/BackLink';
import AddFinancialSourceForm from './AddFinancialSourceForm';
import GenericFormMessage from 'components/common/GenericFormMessage';
import BankingContext from './BankingContext';
import finance from 'assets/images/finance.png';

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

// TODO: refactor component usable for both income and assets? created by: @JimVercoelen | Ticket: NESTIO-19929
export function AddIncomeSource(props) {
    const [errors, setErrors] = useState([]);
    const context = useContext(BankingContext);

    const onSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        setErrors([]);

        const formData = getFinancialSourceRequestBody(values, FINANCIAL_STREAM_INCOME, props.vgsEnabled);

        let response;
        try {
            response = await API.submitFinancialSource(formData, props.vgsEnabled);
        } catch (e) {
            logToSentry(e);
            setErrors([ERROR_UPLOAD]);
            return setSubmitting(false);
        }

        if (response.status !== 200) {
            logToSentry(response);
            setErrors([ERROR_UPLOAD]);
            setSubmitting(false);
            return;
        }

        context.refreshFinancialSources();
        props.history.push(`${ROUTES.INCOME_VERIFICATION_SUMMARY}#income`);
        setSubmitting(false);
        setErrors([]);
    };

    return (
        <>
            <SkinnyH1>Add an Income Source</SkinnyH1>
            <SpacedH3>Fill in the details below to add your income source.</SpacedH3>
            {errors.length > 0 && <GenericFormMessage type="error" messages={errors} />}
            <img alt="coin" src={finance} />
            <Spacer height={30} />
            <AddFinancialSourceForm
                initialValues={props.initialValues}
                financialType={FINANCIAL_STREAM_INCOME}
                onSubmit={onSubmit}
                setError={(err) => setErrors(err)}
            />
            <BackLink to={`${ROUTES.INCOME_VERIFICATION_SUMMARY}#income`} />
        </>
    );
}

AddIncomeSource.propTypes = {
    history: PropTypes.object,
    initialValues: PropTypes.object,
    vgsEnabled: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    vgsEnabled: !state.configuration.use_demo_config,
});

export default connect(mapStateToProps)(AddIncomeSource);
