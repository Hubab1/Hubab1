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
import { ROUTES, RENTER_PROFILE_TYPE_CO_APPLICANTS } from 'app/constants';
import { serializeDate } from 'utils/misc';
import { updateRenterProfile } from 'reducers/renter-profile';


const SpacedH3 = styled(H3)`
    margin: 20px 15% 20px 15%;s
`;

export class InviteRoommatesPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        this.props.updateRenterProfile({co_applicants: [values]}).then((res) => {
            if (res.errors) {
                const coApplicantsErrorsObj = get(res, 'errors.co_applicants');
                const coApplicantErrors = coApplicantsErrorsObj && Object.values(coApplicantsErrorsObj)[0];
                coApplicantErrors ? setErrors(coApplicantErrors) : this.setState({errors: ['There was an error sending your roommate an invite. Please Try again.']});
            } else {
                this.setState({confirmSent: true});
            }
            setSubmitting(false);
        }).catch((res) => {
            this.setState({errors: [res.errors]});
            setSubmitting(false);
        });
    }
    onSubmitDependent = (values, { setSubmitting, setErrors }) => {
        const serialized = Object.assign({}, values);
        serialized.birthday = serializeDate(serialized.birthday);
        this.props.updateRenterProfile({dependents: [serialized]}).then((res) => {
            if (res.errors) {
                const errorsObj = get(res, 'errors.dependents');
                const errors = errorsObj && Object.values(errorsObj)[0];
                errors ? setErrors(errors) : this.setState({errors: ['There was an error adding your dependent. Please Try again.']});
            } else {
                this.props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`);
            }
            setSubmitting(false);
        }).catch((res) => {
            this.setState({errors: [res.errors]});
            setSubmitting(false);
        });
    }

    canInviteMore () {
        // manually setting this until product figures out how we want to determine the limit
        if (this.props.profile.co_applicants.length >= 10) {
            return false;
        }
        return true;
    }

    render () {
        if (this.state.confirmSent) {
            return <ConfirmationPage 
                successMessage="Invite Sent!"
                secondarySuccessMessage="You’ll be able to check in on your roommate’s progress once you complete your application."
                buttonClick={()=>this.props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`)}
                buttonText="Continue"
                secondaryButtonClick={this.canInviteMore() ? () => this.setState({confirmSent: false}) : null}
                secondaryButtonText="Add Another Person"
                confirmationImage={inviteConfirm}
            />;
        } 
        return (
            <Fragment>
                <H1>Add a Person</H1>
                <SpacedH3>Enter their info below.</SpacedH3>
                <img src={roommatesImage} alt="hand with smartphone in it"/>
                <InviteForm
                    initialIsDependent={null}
                    onSubmitDependent={this.onSubmitDependent}
                    handleOnSubmit={this.onSubmit}
                    displayedErrors={this.state.errors}
                />
                <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`}/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
});

export default connect(mapStateToProps, {updateRenterProfile})(InviteRoommatesPage);
