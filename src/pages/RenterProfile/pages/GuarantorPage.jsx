import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import styled from '@emotion/styled';

import { ROUTES, RENTER_PROFILE_TYPE_GUARANTOR } from 'constants/constants';
import API from 'api/api';

import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchApplicant } from 'reducers/applicant';
import { selectors } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import InviteForm from 'common-components//InviteForm/InviteForm';
import ConfirmationPage from 'pages/Confirmation';
import BackLink from 'common-components/BackLink/BackLink';
import { H1, SpacedH3 } from 'assets/styles';
import coin from 'assets/images/coin.png';

const ERROR_INVITE = 'There was an error sending your guarantor an invite. Please Try again.';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 90px;
        max-width: 90px;
    }
`;

export class GuarantorPage extends Component {
    state = { confirmSent: false, errors: null };

    onSubmit = (values, { setSubmitting, setErrors }) => {
        this.props.toggleLoader(true);

        return API.inviteGuarantor({ guarantors: [values] })
            .then((res) => {
                setSubmitting(false);
                if (res.errors) {
                    const errors = get(res, 'errors.guarantors[0]');
                    if (errors) {
                        setErrors(errors);
                    }

                    this.setState({ errors: [res.errors.Error || ERROR_INVITE] });
                } else {
                    this.props.fetchRenterProfile();
                    this.setState({ confirmSent: true });
                }
            })
            .catch((res) => {
                this.setState({ errors: [res.errors || ERROR_INVITE] });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    handleContinueAfterInviteSent = () => {
        if (!this.props.guarantorRequested) {
            this.props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_GUARANTOR}`);
        } else {
            this.props.fetchApplicant().then(() => {
                this.props.history.push(this.props.initialPage);
            });
        }
    };

    render() {
        if (this.state.confirmSent) {
            return (
                <ConfirmationPage
                    successMessage="Invite Sent!"
                    secondarySuccessMessage="You’ll be able to check in on your guarantor's progress once you complete your application."
                    buttonClick={this.handleContinueAfterInviteSent}
                    buttonText="Continue"
                />
            );
        }
        return (
            <>
                <H1>Let&apos;s Invite a Guarantor</H1>
                <SpacedH3>
                    Plain and simple, a lease guarantor is someone who guarantees payment on the lease if it
                    could&apos;t be paid for some reason.
                </SpacedH3>
                <ImageContainer>
                    <img src={coin} alt="coin" />
                </ImageContainer>
                <InviteForm handleOnSubmit={this.onSubmit} displayedErrors={this.state.errors} isGuarantor={true} />
                <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_GUARANTOR}`} />
            </>
        );
    }
}

GuarantorPage.propTypes = {
    guarantorRequested: PropTypes.bool,
    initialPage: PropTypes.string,
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
    fetchRenterProfile: PropTypes.func,
    fetchApplicant: PropTypes.func,
};

const mapStateToProps = (state) => ({
    guarantorRequested: selectors.selectGuarantorRequested(state),
    initialPage: selectors.selectInitialPage(state),
});

const mapDispatchToProps = {
    fetchRenterProfile,
    fetchApplicant,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(GuarantorPage);
