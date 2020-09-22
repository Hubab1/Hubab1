import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import coin from 'assets/images/coin.png';
import { H1, SpacedH3 } from 'assets/styles';

import styled from '@emotion/styled';

import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import { ROUTES, RENTER_PROFILE_TYPE_GUARANTOR } from 'app/constants';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { fetchApplicant } from 'reducers/applicant';
import API from 'app/api';
import { InviteForm } from 'components/common/InviteForm';
import BackLink from 'components/common/BackLink';
import { selectors } from 'reducers/renter-profile';


const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 90px;
        max-width: 90px;
    }
`

export class GuarantorPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        return API.inviteGuarantor({guarantors: [values]}).then((res) => {
            setSubmitting(false);
            if (res.errors) {
                const errors = get(res, 'errors.guarantors[0]');
                if (errors) {
                    setErrors(errors);
                } else {
                    this.setState({errors: ['There was an error sending your guarantor an invite. Please Try again.']});

                }
            } else {
                this.props.fetchRenterProfile();
                this.setState({confirmSent: true});
            }
        }).catch((res) => {
            this.setState({errors: [res.errors]});
            setSubmitting(false);
        });
    };

    handleContinueAfterInviteSent = () => {
        if (!this.props.guarantorRequested) {
            this.props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_GUARANTOR}`)
        } else {
            this.props.fetchApplicant().then(() => {
                this.props.history.push(this.props.initialPage);
            });
        }
    };

    render () {
        if (this.state.confirmSent) {
            return <ConfirmationPage
                successMessage="Invite Sent!"
                secondarySuccessMessage="You’ll be able to check in on your guarantor's progress once you complete your application."
                buttonClick={this.handleContinueAfterInviteSent}
                buttonText="Continue"
            />
        }
        return (
            <Fragment>
                <H1>Let's Invite a Guarantor</H1>
                <SpacedH3>Plain and simple, a lease guarantor is someone who guarantees payment on the lease if it could't be paid for some reason.</SpacedH3>
                <ImageContainer>
                    <img src={coin} alt="coin"/>
                </ImageContainer>
                <InviteForm handleOnSubmit={this.onSubmit} displayedErrors={this.state.errors} isGuarantor={true} />
                <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_GUARANTOR}`}/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    guarantorRequested: selectors.selectGuarantorRequested(state),
    initialPage: selectors.selectInitialPage(state),
});

export default connect(mapStateToProps, {fetchRenterProfile, fetchApplicant})(GuarantorPage);
