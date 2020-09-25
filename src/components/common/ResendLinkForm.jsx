import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';


import resendEnvelope from 'assets/images/resendEnvelope.png';
import { H1, SpacedH3 } from 'assets/styles';

import API from 'app/api';
import { BackLink } from 'components/common/BackLink';
import { InviteForm } from 'components/common/InviteForm';
import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { RENTER_PROFILE_TYPE_GUARANTOR } from 'app/constants';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 90px;
        max-width: 90px;
    }
`;

export class ResendLinkForm extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const resendValues = Object.assign({}, values);
        resendValues.resend_invite = true;
        API.updateInvitee(resendValues, values.id).then((res) => {
            setSubmitting(false);
            if (res.error_type === 'ValidationError') {
                if (!values.email && !values.phone_number ) {
                    return this.setState({errors: ['Phone Number or Email are required']});
                } else if (!values.email) {
                    return setErrors({phone_number: res.errors.phone_number[0], email: null});
                } else if (!values.phone_number) {
                    return setErrors({email: res.errors.email[0], phone_number: null});
                } else {
                    return this.setState({errors: ['There was an error with your submission. Please try again.']});
                }
            }
            this.props.fetchRenterProfile();
            this.setState({confirmSent: true});
        }).catch(() => {
            this.setState({errors: ['There was an error with your submission. Please try again.']});
            setSubmitting(false);
        });
    };

    render () {
        if (this.state.confirmSent) {
            return <ConfirmationPage
                successMessage="Amazing! Invite Sent"
                secondarySuccessMessage="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
                buttonClick={()=>this.props.history.push(this.props.location.state.returnRoute)}
                buttonText={this.props.location.state.confirmationButtonText}
                   />;
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
                    initialValues={this.props.location.state.initialValues}
                    isGuarantor={this.props.location.state.returnRoute.includes(RENTER_PROFILE_TYPE_GUARANTOR)}
                />
                <BackLink to={this.props.location.state.returnRoute}/>
            </Fragment>
        );
    }
}

export default connect(null, {fetchRenterProfile})(ResendLinkForm);
