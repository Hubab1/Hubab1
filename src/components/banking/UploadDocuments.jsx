import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import withRelativeRoutes from 'app/withRelativeRoutes';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ActionButton from 'components/common/ActionButton/ActionButton';

import { ROUTES } from 'app/constants';
import { FINANCIAL_STREAM_INCOME, FINANCIAL_STREAM_ASSET } from 'app/constants';
import { P } from 'assets/styles';


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
        if (this.props.streamType === FINANCIAL_STREAM_INCOME) { type = ' of income'}
        if (this.props.streamType === FINANCIAL_STREAM_ASSET) { type = ' of asset'}
        return (
            <P margin="43px 0 0 0">{`Proof${type}:`}</P>
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

    getProofsLabel = (proofDocuments) => {
        let label = proofDocuments[0].label;
        if (proofDocuments.length > 1) {
            for (let i = 1; i < proofDocuments.length; i++) {
                label += ` + ${proofDocuments[i].label}`;
            }
        }
        return label;
    };

    render () {
        const { selectedDocumentIndex, selectedDocument } = this.state;
        const documentRequired = this.documentsRequired;
        const requireAll = documentRequired? documentRequired.require_all: true;

        if (!documentRequired || documentRequired.proof_documents.length === 0) return null;

        return (
            <>
                {this.getTitle()}
                {requireAll || documentRequired.proof_documents.length <=1 ? (
                    <>
                        <P margin="15px 0 48px 0">{this.getProofsLabel(documentRequired.proof_documents)}</P>
                        {documentRequired.proof_documents.map((doc, index) => (
                            <ActionButton
                                key={index}
                                marginBottom={(index === documentRequired.proof_documents.length - 1) ? 68 : 17}
                                disabled={false}
                                variant="outlined"
                            >
                                Upload {doc.label}
                            </ActionButton>)
                        )}
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
                                        key={index}
                                        value={index}
                                        control={<Radio />}
                                        label={doc.label}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                        {selectedDocument && (
                            <ActionButton disabled={false} marginTop={48} marginBottom={68} variant="outlined">
                                Upload {selectedDocument.label}
                            </ActionButton>
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
};

const mapStateToProps = state => ({
    config: state.configuration,
});

export default connect(mapStateToProps)(withRelativeRoutes(UploadDocuments, ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME));
