import React from 'react';
import styled from '@emotion/styled';

import { BackLink } from 'components/common/BackLink';
import { H1, H3, Spacer } from 'assets/styles';
import finance from 'assets/images/finance.png';
import captureRoute from 'app/captureRoute';
import { ROUTES, FINANCIAL_STREAM_INCOME, FINANCIAL_STREAM_ASSET } from 'app/constants';
import API from 'app/api';
import AddFinancialSourceForm from './AddFinancialSourceForm';
import GenericFormMessage from 'components/common/GenericFormMessage';
import BankingContext from './BankingContext';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export class EditFinancialSource extends React.Component {
    state = { errorSubmitting: false, financialSource: null }

    get initialValues () {
        const financialSource = this.state.financialSource;
        const uploadedDocuments = {};
    
        // eslint-disable-next-line
        financialSource.uploaded_documents?.forEach( source => {
            // convert list of docs to format used in UploadDocuments.jsx
            if (!uploadedDocuments[source.type.id]) uploadedDocuments[source.type.id] = {files: []};
            uploadedDocuments[source.type.id].label = source.type.label;
            uploadedDocuments[source.type.id].files.push({name: source.filename, id: source.id});
        });
        return Object.assign({}, financialSource, {uploadedDocuments: uploadedDocuments});
    }
    
    onSubmit = async (values, {setSubmitting}) => {
        setSubmitting(true);
        this.setState({errorSubmitting: false});

        const formData = new FormData();
        formData.append('estimated_amount', String(values.estimated_amount).replace(/,/g, ''));
        if (values.other != null) {
            formData.append('other', values.other);
        }
        if (values.uploadedDocuments) {
            for (const key of Object.keys(values.uploadedDocuments)) {
                values.uploadedDocuments[key].files.forEach(v => {
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
        } catch (e) {
            return;
        }
        // eslint-disable-next-line
        this.context.refreshFinancialSources?.();
        setSubmitting(false);
        this.props.history.push(this.returnLink);
    };
    async componentDidMount () {
        this.fetchFinancialSource();
    }
    async fetchFinancialSource () {
        let data;
        try {
            data = await API.getFinancialSource(this.props.match.params.id);
        } catch (e) {
            return;
        }
        this.setState({financialSource: data});
    }
    componentDidUpdate (prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchFinancialSource();
        }
    }

    get isAsset () {
        return this.state.financialSource?.stream_type === FINANCIAL_STREAM_ASSET;
    }

    get returnLink () {
        return `${ROUTES.INCOME_VERIFICATION_SUMMARY}#${this.isAsset ? 'asset' : 'income'}`;
    }

    render () {
        const financialSource = this.state.financialSource;
        if (!financialSource) return null;
        const isAsset = financialSource.stream_type === FINANCIAL_STREAM_ASSET;
        return (
            <>
                <SkinnyH1>Add an {isAsset ? 'Asset' : 'Income Source'}</SkinnyH1>
                <SpacedH3>Fill in the details below to add your {isAsset ? 'asset' : 'income source'}.</SpacedH3>
                {this.state.errorSubmitting && (
                    <GenericFormMessage
                        type="error"
                        messages={['Oops! We had some trouble uploading your files. Please try again in a little bit.']}
                    />
                )}
                <img alt="coin" src={finance} />
                <Spacer height={30}/>
                <AddFinancialSourceForm
                    isEditing
                    initialValues={this.initialValues}
                    financialType={isAsset ? FINANCIAL_STREAM_ASSET : FINANCIAL_STREAM_INCOME}
                    onSubmit={this.onSubmit}
                />
                <BackLink to={this.returnLink}/>
            </>
        );
    }
}
EditFinancialSource.route = ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE;
EditFinancialSource.contextType = BankingContext;

export default captureRoute(EditFinancialSource);
