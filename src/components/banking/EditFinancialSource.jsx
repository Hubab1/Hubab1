import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import API from 'app/api';
import captureRoute from 'app/captureRoute';
import { getIncompleteFinancialSourceWarning } from './IncomeVerificationSummaryPage';
import {
    ROUTES,
    FINANCIAL_STREAM_INCOME,
    FINANCIAL_STREAM_ASSET,
    FINANCIAL_STREAM_STATUS_PENDING,
} from 'app/constants';

import { BackLink } from 'components/common/BackLink';
import AddFinancialSourceForm from './AddFinancialSourceForm';
import GenericFormMessage from 'components/common/GenericFormMessage';
import BankingContext from './BankingContext';
import { H1, H3, Spacer } from 'assets/styles';
import finance from 'assets/images/finance.png';

export const ERROR_UPLOAD =
    'Oops, we had some trouble uploading your files. ' +
    'Be sure to use documents with unique filenames and refrain from renaming them during the upload process. ' +
    'If you continue to have issues, please contact an agent or try again later.'
;

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

// TODO: refactor to functional comp using hooks similar to AddAssetSource and AddIncomeSource
export class EditFinancialSource extends Component {
    state = { errors: [], financialSource: null };

    async componentDidMount() {
        this.fetchFinancialSource();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchFinancialSource();
        }
    }

    get initialValues() {
        const financialSource = this.state.financialSource;
        const uploadedDocuments = {};

        // eslint-disable-next-line
        financialSource.uploaded_documents?.forEach((source) => {
            // convert list of docs to format used in UploadDocuments.jsx
            if (!uploadedDocuments[source.type.id]) uploadedDocuments[source.type.id] = { files: [] };
            uploadedDocuments[source.type.id].label = source.type.label;
            uploadedDocuments[source.type.id].files.push({ name: source.filename, id: source.id });
        });
        return Object.assign({}, financialSource, { uploadedDocuments: uploadedDocuments });
    }

    onSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        this.setState({ errors: [] });

        const formData = new FormData();
        formData.append('estimated_amount', String(values.estimated_amount).replace(/,/g, ''));
        formData.append('adjusted_amount', 0);
        formData.append('has_requested_more_documents', false);
        formData.append('status', FINANCIAL_STREAM_STATUS_PENDING);

        if (values.other != null) {
            formData.append('other', values.other);
        }

        if (values.uploadedDocuments) {
            for (const key of Object.keys(values.uploadedDocuments)) {
                values.uploadedDocuments[key].files.forEach((v) => {
                    if (v.file) {
                        formData.append(`${key}[]`, v.file);
                    } else {
                        formData.append(`uploaded_documents[]`, v.id); // already uploaded
                    }
                });
            }
        }

        try {
            await API.updateFinancialSource(this.props.match.params.id, formData);
            // eslint-disable-next-line
            this.context.refreshFinancialSources?.();
            this.props.history.push(this.returnLink);
        } catch (e) {
            this.setState({ errors: [ERROR_UPLOAD] });
        } finally {
            setSubmitting(false);
        }
    };

    setErrors = (errors) => {
        this.setState({ errors: errors });
    };

    async fetchFinancialSource() {
        let data;
        try {
            data = await API.getFinancialSource(this.props.match.params.id);
        } catch (e) {
            return;
        }
        this.setState({ financialSource: data });
    }

    get isAsset() {
        return this.state.financialSource?.stream_type === FINANCIAL_STREAM_ASSET;
    }

    get returnLink() {
        return `${ROUTES.INCOME_VERIFICATION_SUMMARY}#${this.isAsset ? 'asset' : 'income'}`;
    }

    render() {
        const financialSource = this.state.financialSource;
        if (!financialSource) return null;
        const isAsset = financialSource.stream_type === FINANCIAL_STREAM_ASSET;
        const warning = getIncompleteFinancialSourceWarning(financialSource, isAsset);

        return (
            <>
                <SkinnyH1>Add an {isAsset ? 'Asset' : 'Income Source'}</SkinnyH1>
                <SpacedH3>Fill in the details below to add your {isAsset ? 'asset' : 'income source'}.</SpacedH3>
                {warning && <GenericFormMessage type="error" messages={[warning]} />}
                {this.state.errors.length > 0 && <GenericFormMessage type="error" messages={this.state.errors} />}
                <img alt="coin" src={finance} />
                <Spacer height={30} />
                <AddFinancialSourceForm
                    isEditing
                    initialValues={this.initialValues}
                    financialType={isAsset ? FINANCIAL_STREAM_ASSET : FINANCIAL_STREAM_INCOME}
                    onSubmit={this.onSubmit}
                    setError={(err) => this.setErrors(err)}
                />
                <BackLink to={this.returnLink} />
            </>
        );
    }
}

EditFinancialSource.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
};

EditFinancialSource.route = ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE;
EditFinancialSource.contextType = BankingContext;

export default captureRoute(EditFinancialSource);
