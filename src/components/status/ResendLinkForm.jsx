import React, { Fragment } from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';

import ArrowBackIos from '@material-ui/icons/ArrowBackIos'

import resendEnvelope from 'assets/images/resendEnvelope.png';
import { H1, SpacedH3, LinkButton, blackLinkRoot } from 'assets/styles';

import API from 'app/api';
import { InviteForm } from 'components/common/InviteForm';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';

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
        values.resend_invite = true;
        API.updateInvitee(values, values.id).then((res) => {
            setSubmitting(false);
            if (res.error_type === 'ValidationError') {
                if (!values.email && !values.phone_number ) {
                    return this.setState({errors: ['Phone Number or Email are required']})
                } else if (!values.email) {
                    return setErrors({phone_number: res.errors.phone_number[0], email: null})
                } else if (!values.phone_number) {
                    return setErrors({email: res.errors.email[0], phone_number: null})
                } else {
                    return this.setState({errors: ['There was an error with your submission. Please try again.']})
                }
            }
            this.props.fetchRenterProfile();
            this.setState({confirmSent: true})
        }).catch((res) => {
            this.setState({errors: ['There was an error with your submission. Please try again.']});
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
                <InviteForm
                    handleOnSubmit={this.onSubmit}
                    displayedErrors={this.state.errors}
                    initialValues={this.props.initialValues}
                />
                <LinkButton className={blackLinkRoot} onClick={() => this.props.handleConfirmationClick(null)}>
                    <ArrowBackIos classes={{root: arrowIcon}}/> Go Back
                </LinkButton>
            </Fragment>
        );
    }
}

export default ResendLinkForm;
