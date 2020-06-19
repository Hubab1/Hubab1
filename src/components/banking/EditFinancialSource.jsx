import React, {useState} from 'react';
import styled from '@emotion/styled';
import { useContext } from 'react';

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
    removedFiles = [];
    state = { errorSubmitting: false, financialSource: null }

    get getInitialValues () {
        const financialSource = this.state.financialSource;
        // uploadedDocuments
        const uploadedDocuments = {};
    
        // eslint-disable-next-line
        financialSource.uploaded_documents?.forEach( source => {
            // convert list of docs to format used in UploadDocuments.jsx
            if (!uploadedDocuments[source.type_id]) uploadedDocuments[source.type_id] = {files: []};
            uploadedDocuments[source.type_id].label = source.type__label;
            uploadedDocuments[source.type_id].files.push({name: source.filename, id: source.id});
        });
        return Object.assign({}, financialSource, {uploadedDocuments: uploadedDocuments});
    }
    
    onSubmit = async (values, {setErrors, setSubmitting}) => {
        console.log(values)
        setSubmitting(true);
        this.setState({errorSubmitting: false});

        const formData = new FormData();
        formData.append('estimated_amount', String(values.estimated_amount).replace(/,/g, ''));
        this.removedFiles.forEach(id => {
            formData.append('removed_files[]', id);
        });
        if (values.other != null) {
            formData.append('other', values.other);
        }
        if (values.uploadedDocuments) {
            for (let key of Object.keys(values.uploadedDocuments)) {
                values.uploadedDocuments[key].files.forEach((v, k) => {
                    if (v.file) {
                        formData.append(`${key}[]`, v.file);
                    }
                });
            }
        }
        let data;
        try {
            data = await API.updateFinancialSource(this.props.match.params.id, formData);
        } catch (e) {

        }
        
        setSubmitting(false);
    };
    async componentDidMount () {
        this.fetchFinancialSource();
    }
    async fetchFinancialSource () {
        let data;
        try {
            data = await API.getFinancialSource(this.props.match.params.id);
        } catch (e) {
            alert(e)
            // setError(data);
            return;
        }
        this.setState({financialSource: data});
    }
    componentDidUpdate (prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchFinancialSource();
        }
    }

    onRemove = (fileIds) => {
        this.removedFiles.push(...fileIds);
        console.log(this.removedFiles)
    }

    render () {
        const financialSource = this.state.financialSource;
        if (!financialSource) return null;
        const isAsset = financialSource.stream_type === FINANCIAL_STREAM_ASSET;
        return (
            <>
                <SkinnyH1>Edit {isAsset ? 'Asset' : 'Income Source'}</SkinnyH1>
                {/* <SpacedH3>Fill in the details below to add your income source.</SpacedH3> */}
                {this.state.errorSubmitting && (
                    <GenericFormMessage
                        type="error"
                        messages={['Oops! We had some trouble uploading your files. Please try again in a little bit.']}
                    />
                )}
                <img alt="coin" src={finance} />
                <Spacer height={30}/>
                <AddFinancialSourceForm
                    initialValues={this.getInitialValues}
                    financialType={FINANCIAL_STREAM_INCOME}
                    onSubmit={this.onSubmit}
                    onRemove={this.onRemove}
                />
                <BackLink to={ROUTES.MANUAL_INCOME_VERIFICATION}/>
            </>
        );
    }
}
EditFinancialSource.route = ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE;
EditFinancialSource.contextType = BankingContext;

export default captureRoute(EditFinancialSource);
