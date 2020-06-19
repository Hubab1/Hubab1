import React, {useState} from 'react';
import styled from '@emotion/styled';
import { useContext } from 'react';

import { BackLink } from 'components/common/BackLink';
import { H1, H3, Spacer } from 'assets/styles';
import finance from 'assets/images/finance.png';
import captureRoute from 'app/captureRoute';
import { ROUTES, FINANCIAL_STREAM_INCOME } from 'app/constants';
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

export function EditFinancialSource (props) {
const context = useContext(BankingContext);
    const [errorSubmitting, setErrorSubmitting] = useState(false);
    const [financialSource, setFinancialSource] = useState(null);

    function getInitialValues () {
        // uploadedDocuments
        const uploadedDocuments = {};
    
        // eslint-disable-next-line
        financialSource.uploaded_documents?.forEach( source => {
            // convert list of docs to format used in UploadDocuments.jsx
            if (!uploadedDocuments[source.type_id]) uploadedDocuments[source.type_id] = {files: []};
            uploadedDocuments[source.type_id].label = source.type__label;
            uploadedDocuments[source.type_id].files.push({name: source.filename, id: source.id});
        });
        const data = Object.assign({}, financialSource, {uploadedDocuments: uploadedDocuments});
        return Object.assign({}, financialSource, {uploadedDocuments: uploadedDocuments});
    }
    
    const onSubmit = async (values, {setErrors, setSubmitting}) => {
        console.log(values)
        setSubmitting(true);
        setErrorSubmitting(false);

        const formData = new FormData();
        formData.append('estimated_amount', String(values.estimated_amount).replace(/,/g, ''));
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
            data = await API.updateFinancialSource(props.match.params.id, formData);
        } catch (e) {

        }
        
        setSubmitting(false);
    };
    React.useEffect(() => {
        (async () => {
            let data;
            try {
                console.log(props.match)
                data = await API.getFinancialSource(props.match.params.id);
            } catch (e) {
                alert(e)
                // setError(data);
                return;
            }
            setFinancialSource(data);
            // if (uploadedDocuments[id]) {
            //     uploadedDocuments[id].files.push(fileInfo)
            // } else {
            //     uploadedDocuments[id] = {
            //         id: selectedDocument.id,
            //         label: selectedDocument.label,
            //         files: [fileInfo]
            //     };
            // }
            
        })();
        // fetch income source
        // API.fetchIncomeSource(props.location.match.id)

    }, []);
    if (!financialSource) return null;

    return (
        <>
            <SkinnyH1>Edit Income Source</SkinnyH1>
            {/* <SpacedH3>Fill in the details below to add your income source.</SpacedH3> */}
            {errorSubmitting && (
                <GenericFormMessage
                    type="error"
                    messages={['Oops! We had some trouble uploading your files. Please try again in a little bit.']}
                />
            )}
            <img alt="coin" src={finance} />
            <Spacer height={30}/>
            <AddFinancialSourceForm
                initialValues={getInitialValues()}
                financialType={FINANCIAL_STREAM_INCOME}
                onSubmit={onSubmit}
            />
            <BackLink to={ROUTES.MANUAL_INCOME_VERIFICATION}/>
        </>
    );
}
EditFinancialSource.route = ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE;

export default captureRoute(EditFinancialSource);
