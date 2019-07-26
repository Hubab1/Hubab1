import React, { Fragment } from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';

import ArrowBackIos from '@material-ui/icons/ArrowBackIos'

import resendEnvelope from 'assets/images/resendEnvelope.png';
import { H1, SpacedH3, LinkButton, blackLinkRoot } from 'assets/styles';

import { InviteForm } from 'components/common/InviteForm';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import API from 'app/api';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 90px;
        max-width: 90px;
    }
`

const arrowIcon = css`
    font-weight: 500 !important;
    font-size: 16px !important;
    vertical-align: sub;
`

export class ResendLinkForm extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        API.updateAppliant(values).then((res) => {
            setSubmitting(false);
            this.setState({confirmSent: true})
        }).catch((res) => {
            this.setState({errors: [res.errors]});
            setSubmitting(false);
        });
    }

    render () {
        if (this.state.confirmSent) {
            return <ConfirmationPage
                successMessage="Amazing! Invite Sent"
                secondarySuccessMessage="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
                buttonClick={() => this.props.handleConfirmationClick(null)}
                buttonText="Back to Application Status"
            />
        }
        return (
            <Fragment>
                <H1>Let’s Try This Again</H1>
                <SpacedH3>Double check all the information below and let’s resend the invite</SpacedH3>
                <ImageContainer>
                    <img src={resendEnvelope} alt="coin"/>
                </ImageContainer>
                <InviteForm handleOnSubmit={this.onSubmit} errors={this.state.errors} />
                <LinkButton className={blackLinkRoot} onClick={() => this.props.handleConfirmationClick(null)}>
                    <ArrowBackIos classes={{root: arrowIcon}}/> Go Back
                </LinkButton>
            </Fragment>
        );
    }
}

export default ResendLinkForm;