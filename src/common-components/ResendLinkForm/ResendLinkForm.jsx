import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import API from 'api/api';
import { RENTER_PROFILE_TYPE_GUARANTOR } from 'constants/constants';

import { fetchRenterProfile } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import { BackLink } from 'common-components/BackLink/BackLink';
import { InviteForm } from 'common-components//InviteForm/InviteForm';
import ConfirmationPage from 'common-components/Pages/ConfirmationPage/ConfirmationPage';
import { H1, SpacedH3 } from 'assets/styles';
import resendEnvelope from 'assets/images/resendEnvelope.png';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 90px;
        max-width: 90px;
    }
`;

export class ResendLinkForm extends Component {
    state = { confirmSent: false, errors: null };

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const resendValues = Object.assign({}, values);
        resendValues.resend_invite = true;

        this.props.toggleLoader(true);

        API.updateInvitee(resendValues, values.id)
            .then((res) => {
                if (res.error_type === 'ValidationError') {
                    if (!values.email && !values.phone_number) {
                        return this.setState({ errors: ['Phone Number or Email are required'] });
                    } else if (!values.email) {
                        return setErrors({ phone_number: res.errors.phone_number[0], email: null });
                    } else if (!values.phone_number) {
                        return setErrors({ email: res.errors.email[0], phone_number: null });
                    } else {
                        return this.setState({
                            errors: ['There was an error with your submission. Please try again.'],
                        });
                    }
                }
                this.props.fetchRenterProfile();
                this.setState({ confirmSent: true });
            })
            .catch(() => {
                this.setState({ errors: ['There was an error with your submission. Please try again.'] });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    render() {
        if (this.state.confirmSent) {
            return (
                <ConfirmationPage
                    successMessage="Amazing! Invite Sent"
                    secondarySuccessMessage="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
                    buttonClick={() => this.props.history.push(this.props.location.state.returnRoute)}
                    buttonText={this.props.location.state.confirmationButtonText}
                />
            );
        }
        return (
            <>
                <H1>Let’s Try This Again</H1>
                <SpacedH3>Double check all the information below and let’s resend the invite</SpacedH3>
                <ImageContainer>
                    <img src={resendEnvelope} alt="coin" />
                </ImageContainer>
                <InviteForm
                    handleOnSubmit={this.onSubmit}
                    displayedErrors={this.state.errors}
                    initialValues={this.props.location.state?.initialValues}
                    isGuarantor={this.props.location.state?.returnRoute.includes(RENTER_PROFILE_TYPE_GUARANTOR)}
                />
                <BackLink to={this.props.location.state?.returnRoute} />
            </>
        );
    }
}

ResendLinkForm.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    toggleLoader: PropTypes.func,
    fetchRenterProfile: PropTypes.func,
};

const mapStateToProps = null;

const mapDispatchToProps = {
    fetchRenterProfile,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResendLinkForm);
