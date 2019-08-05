import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import coin from 'assets/images/coin.png';
import { H1, SpacedH3 } from 'assets/styles';

import styled from '@emotion/styled';

import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import { ROUTES } from 'app/constants';
import { selectors, updateRenterProfile } from 'reducers/renter-profile';
import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';
import { InviteForm } from 'components/common/InviteForm';
import BackLink from 'components/common/BackLink';


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
        API.inviteGuarantor({guarantors: [values]}).then((res) => {
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
                successMessage="Invite Sent!"
                secondarySuccessMessage="You’ll be able to check in on your guarantor's progress once you complete your application."
                buttonClick={this.props._nextRoute}
                buttonText="Continue"
            />
        }
        return (
            <Fragment>
                <H1>Let's Invite a Guarantor</H1>
                <SpacedH3>Plain and simple, a lease guarantor is someone who guarantees payment on the lease if it couldn’t be paid for some reason.</SpacedH3>
                <ImageContainer>
                    <img src={coin} alt="coin"/>
                </ImageContainer>
                <InviteForm handleOnSubmit={this.onSubmit} displayedErrors={this.state.errors} />
                <BackLink to={this.props._prev}/>
            </Fragment>
        );
    }
}

export default connect((state) => ({routes: selectors.selectOrderedRoutes(state)}), {updateRenterProfile})(withRelativeRoutes(GuarantorPage, ROUTES.GUARANTOR));