import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import withRelativeRoutes from 'app/withRelativeRoutes';
import uuidv4 from 'uuid/v4';
import { NavLink } from 'react-router-dom';

import { css } from 'emotion';
import styled from '@emotion/styled';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import { ROUTES } from 'app/constants';
import { FINANCIAL_STREAM_INCOME, FINANCIAL_STREAM_ASSET } from 'app/constants';
import { P, LinkButton } from 'assets/styles';


const root = css`
    border-radius: 21.5px !important;
    height: 45px;
`

const label = css`
    text-transform: none;
    font-size: 16px;
`

const UploadButtonContainer = styled.div`
    margin-top: ${props => props.marginTop ? `${props.marginTop}px` : 0};
    margin-bottom: ${props => props.marginTop ? `${props.marginTop}px` : 0};
    text-decoration: none;
    display: block;
    label {
        margin-bottom: 17px;
    }
`

const UploadedDocuments = styled.div`
    .uploaded-document {
        margin-top: 37px;
        &:first-of-type {
            margin-top: 48px;
        }
    }
    .uploaded-document-type-title {
        span {
            font-size: 12px;
        }
        height: 16px;
        color: #828796;
        margin-bottom: 9px;
        padding: 11px 23px 12px 23px;
        display: flex;
        justify-content: space-between;
    }
    .uploaded-document-display {
        height: 43px;
        background-color: rgba(38,48,91,0.1);
        border-bottom: 1px solid #C8C8C8;
        padding: 11px 23px 12px 23px;
        display: flex;
        justify-content: space-between;
    }
`

const FileName = styled.div`
    color: #000000;
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
`


export class UploadDocuments extends React.Component {
    state = {
        selectedDocumentIndex: null,
        selectedDocument: null,
    };

    componentDidUpdate (prevProps) {
        if (prevProps.incomeOrAssetType !== this.props.incomeOrAssetType){
            this.setState({
                selectedDocumentIndex: null,
                selectedDocument: null,
            });
        }
    };

    getTitle = () => {
        let type = '';
        if (this.props.streamType === FINANCIAL_STREAM_INCOME) { type = 'income'}
        else if (this.props.streamType === FINANCIAL_STREAM_ASSET) { type = 'asset'}
        return (
            <P margin="43px 0 0 0">{`Proof of ${type}:`}</P>
        )
    };

    handleChange = event => {
        const documentRequired = this.documentsRequired;
        const index = parseInt(event.target.value);
        this.setState({
            selectedDocumentIndex: index,
            selectedDocument: documentRequired.proof_documents[index]
        });
    };

    get documentsRequired () {
        const config = this.props.config.financial_documents_validations;
        return config.find(doc => doc.income_or_asset_type === this.props.incomeOrAssetType);
    };

    getProofsLabel = () => {
        const documentRequired = this.documentsRequired;
        let proofDocuments = documentRequired.proof_documents;

        return proofDocuments.map(d => d.label).join(' + ')
    };

     onFileChange = (e, selectedDocument) => {
         const id = e.target.id;
         let file = e.target.files[0];
         let reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => {
             let fileInfo = {
                 name: file.name,
                 id: uuidv4(),
                 file: file
             };
             let uploadedDocuments = {...this.props.uploadedDocuments};
             if (uploadedDocuments[id]) {
                 uploadedDocuments[id].files.push(fileInfo)
             } else {
                 uploadedDocuments[id] = {
                     id: selectedDocument.id,
                     label: selectedDocument.label,
                     files: [fileInfo]
                 };
             }
             this.props.loadDocument(uploadedDocuments);
         };
     };


    displayUploadedDocuments = () => {
        const { uploadedDocuments } = this.props;
        if (!uploadedDocuments) return null;

        return (
            <UploadedDocuments>
                {Object.keys(uploadedDocuments).map((docId) => {
                    if (!uploadedDocuments[docId].files?.length) {
                        return null;
                    }
                    return (
                        <div className="uploaded-document" key={docId}>
                            <div className="uploaded-document-type-title">
                                {/* eslint-disable-next-line */}
                                <span>{uploadedDocuments[docId].label}</span>
                                {
                                    uploadedDocuments[docId].files.length > 1 &&
                                    <LinkButton
                                        onClick={() => this.props.removeAll(docId)}>
                                            Remove all ({uploadedDocuments[docId].files.length})
                                    </LinkButton>
                                }
                            </div>
                            {uploadedDocuments[docId].files.map((file, i) => (
                                <div className="uploaded-document-display" key={file.id}>
                                    <FileName>{file.name}</FileName>
                                    {/* eslint-disable-next-line */}
                                    <LinkButton onClick={() => this.props.removeFile(docId, file.id)}>Remove</LinkButton>
                                    {/* <a onClick={() => this.props.removeFile(docId, file.id)} href="javascript:void(0);" role="button">Remove</a> */}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </UploadedDocuments>
        )
    };
        
    render () {
        const { selectedDocumentIndex, selectedDocument } = this.state;
        const documentRequired = this.documentsRequired;
        const requireAll = documentRequired?.require_all ?? true;

        if (!documentRequired || documentRequired.proof_documents.length === 0) return null;

        return (
            <>
                {this.getTitle()}
                {requireAll || documentRequired.proof_documents.length ===1 ? (
                    <>
                        <P margin="15px 0 48px 0">{this.getProofsLabel()}</P>
                        {this.displayUploadedDocuments()}
                        <UploadButtonContainer marginTop={48} marginBottom={51}>
                            {documentRequired.proof_documents.map((doc) => (
                                <Button
                                    key={doc.id}
                                    variant="outlined"
                                    component="label"
                                    color="primary"
                                    classes={{ root, label }}
                                    fullWidth
                                >
                                    Upload {doc.label}
                                    <input
                                        id={String(doc.id)}
                                        type="file"
                                        name={String(doc.id)}
                                        accept="image/*,.pdf"
                                        style={{ display: "none" }}
                                        onChange={(e) => this.onFileChange(e, doc)}
                                    />
                                </Button>
                            ))}
                        </UploadButtonContainer>
                    </>
                ) : (
                    <>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="documents"
                                name="documents"
                                value={selectedDocumentIndex}
                                onChange={this.handleChange}
                            >
                                {documentRequired.proof_documents.map((doc, index) => (
                                    <FormControlLabel
                                        key={doc.id}
                                        value={index}
                                        control={<Radio />}
                                        label={doc.label}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                        {selectedDocument && (
                            <>
                                {this.displayUploadedDocuments()}
                                <UploadButtonContainer marginTop={48} marginBottom={68}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        color="primary"
                                        classes={{ root, label }}
                                        fullWidth
                                    >
                                        Upload {selectedDocument.label}
                                        <input
                                            id={String(selectedDocument.id)}
                                            type="file"
                                            name={String(selectedDocument.id)}
                                            accept="image/*,.pdf,.doc,.docx"
                                            style={{ display: "none" }}
                                            onChange={(e) => this.onFileChange(e, selectedDocument)}
                                        />
                                    </Button>
                                </UploadButtonContainer>
                            </>
                        )}
                    </>
                )}
            </>
        )
    }
}

UploadDocuments.propTypes = {
    incomeOrAssetType: PropTypes.number.isRequired,
    config: PropTypes.object.isRequired,
    streamType: PropTypes.number.isRequired,
    loadDocument: PropTypes.func.isRequired,
    uploadedDocuments: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    config: state.configuration,
});

export default connect(mapStateToProps)(withRelativeRoutes(UploadDocuments, ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME));
