import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import withRelativeRoutes from 'app/withRelativeRoutes';
import uuidv4 from 'uuid/v4';

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
const FileNamesContainer = styled.div`
    margin-right: -23px;
    margin-left: -23px;
    padding-left: 23px;
    padding-right: 23px;
    background-color: rgba(38,48,91,0.1);
    .uploaded-document-display:last-child {
        border-bottom: none;
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
        padding: 11px 0px 12px 0px;
        display: flex;
        justify-content: space-between;
    }
    .uploaded-document-display {
        border-bottom: 1px solid #C8C8C8;
        padding: 11px 0px 12px 0px;
        display: flex;
        justify-content: space-between;
    }
`

const FileName = styled.div`
    white-space: nowrap;
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

    componentDidMount () {
        let label;
        for (let key in this.props.uploadedDocuments) {
            label = this.props.uploadedDocuments[key].label;
        }
        if (!label) return;
        const index = this.documentsRequired?.proof_documents.findIndex((proof) => proof.label === label); // find label for existing document to set initial selected values
        if (index > -1) {
            this.setState({
                selectedDocumentIndex: index,
                selectedDocument: this.documentsRequired.proof_documents[index]
            });
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.incomeOrAssetType !== this.props.incomeOrAssetType){
            this.setState({
                selectedDocumentIndex: null,
                selectedDocument: null,
            });
        }
    };

    startCase = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };

    titleCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
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

    getRemainingFilesCount = (document) => {
        const documentRequired = this.documentsRequired;
        const proof_documents = documentRequired.proof_documents;
        const { uploadedDocuments } = this.props;

        if (!document || !uploadedDocuments) return { max: 0, min: 0 };

        const settings = proof_documents.find(settings => settings.id === document.id);
        const uploaded = uploadedDocuments[String(document.id)]? uploadedDocuments[String(document.id)].files.length: 0;
        return {
            max: Math.max(0, settings.max_required - uploaded),
            min: Math.max(0, settings.min_required - uploaded)
        };
    };

    onFileChange = (e, selectedDocument) => {
        const id = e.target.id;
        if (e.target.value.length === 0) return null;

        const maxCount = this.getRemainingFilesCount(selectedDocument)?.max?? 0;
        if (!maxCount) return null;

        let badFiles = [];

        for (let i = 0; i < (e.target.files.length<= maxCount? e.target.files.length: maxCount); i++) {
            let file = e.target.files[i];
            let fileSize = file.size / 1024 / 1024; // in MB
            if (fileSize > 10) {
                badFiles.push(file.name);
            } else {
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
            }
        }
        if (badFiles.length) {
            const errorMessage = badFiles.length === 1?
                `Oops! Your file ${badFiles[0]} is too large. Please save it as 10 MB or smaller and try again.`:
                `Oops! Your files ${badFiles.join(', ')} are too large. Please save them as 10 MB or smaller each and try again.`;

            this.props.setError([errorMessage]);
        } else {
            this.props.setError([])
        }
    };

    getUploadButtonLabel = (doc) => {
        let remaining = this.getRemainingFilesCount(doc)?.min?? 0;
        return this.startCase(`Upload ${remaining? remaining : ''} ${doc.label}`);
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
                                <span>{this.titleCase(uploadedDocuments[docId].label)}</span>
                                {
                                    uploadedDocuments[docId].files.length > 1 &&
                                    <LinkButton
                                        onClick={() => this.props.removeAll(docId)}>
                                            Remove all ({uploadedDocuments[docId].files.length})
                                    </LinkButton>
                                }
                            </div>
                            <FileNamesContainer>
                                {uploadedDocuments[docId].files.map((file, i) => (
                                    <div className="uploaded-document-display" key={file.id}>
                                        <FileName>{file.name}</FileName>
                                        {/* eslint-disable-next-line */}
                                        <LinkButton onClick={() => this.props.removeFile(docId, file.id)}>Remove</LinkButton>
                                        {/* <a onClick={() => this.props.removeFile(docId, file.id)} href="javascript:void(0);" role="button">Remove</a> */}
                                    </div>
                                ))}
                            </FileNamesContainer>
                        </div>
                    );
                })}
            </UploadedDocuments>
        )
    };

    displayUploadButton = (document) => {
        const documentRequired = this.documentsRequired;
        const requireAll = documentRequired?.require_all ?? true;
        const proof_documents = documentRequired.proof_documents;
        const { uploadedDocuments } = this.props;

        // Case 1: No documents uploaded
        if (!document || !uploadedDocuments || Object.keys(uploadedDocuments).length === 0) return true;

        const documentId = document.id;

        // Case 2: 'Require All' is disabled and other documents uploaded
        const otherDocTypesUploaded = !uploadedDocuments.hasOwnProperty(String(documentId));
        if (!requireAll && otherDocTypesUploaded) return false;

        // Case 3: 'Max required' reached
        const settings = proof_documents.find(settings => settings.id === documentId);
        const uploaded = uploadedDocuments[String(documentId)]? uploadedDocuments[String(documentId)].files.length: 0;
        if (uploaded >= settings.max_required) return false;

        // Case 4: All other cases
        return true
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
                                <div key={doc.id}>
                                    {this.displayUploadButton(doc) && (
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            color="primary"
                                            classes={{ root, label }}
                                            fullWidth
                                        >
                                            {this.getUploadButtonLabel(doc)}
                                            <input
                                                id={String(doc.id)}
                                                type="file"
                                                name={String(doc.id)}
                                                accept="image/*,.pdf"
                                                style={{ display: "none" }}
                                                onChange={(e) => this.onFileChange(e, doc)}
                                                max={this.getRemainingFilesCount(doc)?.max}
                                                multiple
                                            />
                                        </Button>
                                    )}
                                </div>
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
                                        id={`radioButton${doc.id}`}
                                        value={index}
                                        control={<Radio />}
                                        label={this.startCase(doc.label)}
                                        disabled={selectedDocumentIndex !== index && !this.displayUploadButton(doc)}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                        {selectedDocument && (
                            <>
                                {this.displayUploadedDocuments()}
                                <UploadButtonContainer marginTop={48} marginBottom={68}>
                                    {this.displayUploadButton(selectedDocument) && (
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            color="primary"
                                            classes={{ root, label }}
                                            fullWidth
                                        >
                                            {this.getUploadButtonLabel(selectedDocument)}
                                            <input
                                                id={String(selectedDocument.id)}
                                                type="file"
                                                name={String(selectedDocument.id)}
                                                accept="image/*,.pdf,.doc,.docx"
                                                style={{ display: "none" }}
                                                onChange={(e) => this.onFileChange(e, selectedDocument)}
                                                max={this.getRemainingFilesCount(selectedDocument)?.max}
                                                multiple
                                            />
                                        </Button>
                                    )}
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
    setError: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    config: state.configuration,
});

export default connect(mapStateToProps)(withRelativeRoutes(UploadDocuments, ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME));
