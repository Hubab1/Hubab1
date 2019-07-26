import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import get from 'lodash/get';

import { H1, H3 } from 'assets/styles';
import roommatesImage from 'assets/images/roommates.png';
import inviteConfirm from 'assets/images/invite-confirm.png';
import BackLink from 'components/common/BackLink';
import { InviteForm } from 'components/common/InviteForm';

import ConfirmationPage from 'components/common/ConfirmationPage/ConfirmationPage';
import { ROUTES } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import withRelativeRoutes from 'app/withRelativeRoutes';


const SpacedH3 = styled(H3)`
    margin: 20px 15% 20px 15%;s
`

export class InviteRoommatesPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        this.props.updateRenterProfile({co_applicants: [values]}).then((res) => {
            if (res.errors) {
                const coApplicantsErrorsObj = get(res, 'errors.co_applicants');
                const coApplicantErrors = coApplicantsErrorsObj && Object.values(coApplicantsErrorsObj)[0]
                coApplicantErrors ? setErrors(coApplicantErrors) : this.setState({errors: ['There was an error sending your roommate an invite. Please Try again.']})
            } else {
                this.setState({confirmSent: true})
            }
            setSubmitting(false);
        }).catch((res) => {
            this.setState({errors: [res.errors]});
            setSubmitting(false);
        });
    }

    render () {
        if (this.state.confirmSent) {
            return <ConfirmationPage 
                successMessage="Invite Sent!"
                secondarySuccessMessage="You’ll be able to check in on your roommate’s progress once you complete your application."
                buttonClick={this.props._nextRoute}
                buttonText="Continue"
                secondaryButtonClick={() => this.setState({confirmSent: false})}
                secondaryButtonText="Add Another Roommate"
                confirmationImage={inviteConfirm}
            />
        } 
        return (
            <Fragment>
                <H1>Invite Your Roommates</H1>
                <SpacedH3>Tell us the basics and we’ll send them an invite to tell us the rest.</SpacedH3>
                <img src={roommatesImage} alt="hand with smartphone in it"/>
                <InviteForm handleOnSubmit={this.onSubmit} errors={this.state.errors} />
                <BackLink to={this.props._prev}/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
})

export default connect(mapStateToProps, {updateRenterProfile})(withRelativeRoutes(InviteRoommatesPage, ROUTES.CO_APPLICANTS));
