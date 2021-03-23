import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import get from 'lodash/get';

import { ROUTES, RENTER_PROFILE_TYPE_CO_APPLICANTS } from 'constants/constants';
import { serializeDate } from 'utils/misc';

import { updateRenterProfile } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import BackLink from 'common-components/BackLink/BackLink';
import InviteForm from 'common-components/InviteForm/InviteForm';
import ConfirmationPage from 'pages/Confirmation';
import { H1, H3 } from 'assets/styles';
import roommatesImage from 'assets/images/roommates.png';
import inviteConfirm from 'assets/images/invite-confirm.png';
import { generatePath } from 'react-router';
import captureRoute from 'utils/captureRoute';

const SpacedH3 = styled(H3)`
    margin: 20px 15% 20px 15%;
`;

export class InviteRoommatesPage extends Component {
    state = { confirmSent: false, errors: null };

    onSubmit = (values, { setSubmitting, setErrors }) => {
        this.props.toggleLoader(true);

        this.props
            .updateRenterProfile({ co_applicants: [values] })
            .then((res) => {
                if (res.errors) {
                    const coApplicantsErrorsObj = get(res, 'errors.co_applicants');
                    const coApplicantErrors = coApplicantsErrorsObj && Object.values(coApplicantsErrorsObj)[0];
                    coApplicantErrors
                        ? setErrors(coApplicantErrors)
                        : this.setState({
                              errors: ['There was an error sending your roommate an invite. Please Try again.'],
                          });
                } else {
                    this.setState({ confirmSent: true });
                }
            })
            .catch((res) => {
                this.setState({ errors: [res.errors] });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };
    onSubmitDependent = (values, { setSubmitting, setErrors }) => {
        this.props.toggleLoader(true);

        const serialized = Object.assign({}, values);
        serialized.birthday = serializeDate(serialized.birthday);

        this.props
            .updateRenterProfile({ dependents: [serialized] })
            .then((res) => {
                if (res.errors) {
                    const errorsObj = get(res, 'errors.dependents');
                    const errors = errorsObj && Object.values(errorsObj)[0];
                    errors
                        ? setErrors(errors)
                        : this.setState({ errors: ['There was an error adding your dependent. Please Try again.'] });
                } else {
                    this.props.history.push(
                        generatePath(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`, {
                            application_id: this.props.profile.id,
                        })
                    );
                }
            })
            .catch((res) => {
                this.setState({ errors: [res.errors] });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    canInviteMore() {
        // manually setting this until product figures out how we want to determine the limit
        if (this.props.profile.co_applicants.length >= 10) {
            return false;
        }
        return true;
    }

    render() {
        if (!this.props.profile) {
            return null;
        }
        const url = generatePath(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`, {
            application_id: this.props.profile.id,
        });
        if (this.state.confirmSent) {
            return (
                <ConfirmationPage
                    successMessage="Invite Sent!"
                    secondarySuccessMessage="You’ll be able to check in on your roommate’s progress once you complete your application."
                    buttonClick={() => {
                        this.props.history.push(url);
                    }}
                    buttonText="Continue"
                    secondaryButtonClick={this.canInviteMore() ? () => this.setState({ confirmSent: false }) : null}
                    secondaryButtonText="Add Another Person"
                    confirmationImage={inviteConfirm}
                />
            );
        }
        return (
            <>
                <H1>Add a Person</H1>
                <SpacedH3>Enter their info below.</SpacedH3>
                <img src={roommatesImage} alt="hand with smartphone in it" />
                <InviteForm
                    initialIsDependent={null}
                    onSubmitDependent={this.onSubmitDependent}
                    handleOnSubmit={this.onSubmit}
                    displayedErrors={this.state.errors}
                />
                <BackLink to={url} />
            </>
        );
    }
}

InviteRoommatesPage.propTypes = {
    profile: PropTypes.object,
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
    updateRenterProfile: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
});

const mapDispatchToProps = {
    updateRenterProfile,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(InviteRoommatesPage, ROUTES.CO_APPLICANTS));
