import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import {
    ROUTES,
    RENTER_PROFILE_TYPE_CO_APPLICANTS,
    RENTER_PROFILE_TYPE_DEPENDENT,
    RENTER_PROFILE_TYPE_GUARANTOR,
} from 'constants/constants';
import API from 'api/api';

import { fetchRenterProfile } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';
import ActionButton from 'common-components/ActionButton/ActionButton';
import { H1, H3, P, Bold } from 'assets/styles';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 22px;
`;

const CapitalizedSpan = styled.span`
    text-transform: capitalize;
`;

const Divider = styled.hr`
    border-style: none;
    border-bottom: 2px solid #eeeeee;
    margin-bottom: 22px;
`;

const Content = styled.div`
    text-align: left;
`;

export class RemovePersonPage extends Component {
    state = { errorSubmitting: false, financialSource: null, submitting: false };

    get returnLink() {
        return `${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`;
    }

    get person() {
        if (!this.props.profile) return null;

        const {
            match: {
                params: { type, id },
            },
        } = this.props;
        const { profile } = this.props;

        switch (type) {
            case RENTER_PROFILE_TYPE_DEPENDENT:
                return profile.dependents.find((x) => x.id === parseInt(id));
            case RENTER_PROFILE_TYPE_CO_APPLICANTS:
                return profile.co_applicants.find((x) => x.id === parseInt(id));
            case RENTER_PROFILE_TYPE_GUARANTOR:
                // TODO: get the guarantors directly from the profile | created by: @Chakib | Ticket: NESTIO-19934
                return profile.primary_applicant.guarantors.find((x) => x.id === parseInt(id));
            default:
                return null;
        }
    }

    onSubmit = async () => {
        const {
            match: {
                params: { type, id },
            },
        } = this.props;

        this.setState({ submitting: true });
        this.props.toggleLoader(true);

        try {
            if (type === RENTER_PROFILE_TYPE_DEPENDENT) {
                await API.deletePerson(this.props.profile.id, id);
            } else {
                await API.deleteInvitee(this.props.profile.id, id);
            }

            this.props.fetchRenterProfile();
            this.props.history.push(this.returnLink);
        } catch {
            this.setState({ errorSubmitting: true });
        } finally {
            this.setState({ submitting: false });
            this.props.toggleLoader(false);
        }
    };

    onCancel = () => {
        this.props.history.push(this.returnLink);
    };

    render() {
        if (!this.props.profile || !this.person) return null;

        const { match } = this.props;
        const person = this.person;
        const role = match.params.type === RENTER_PROFILE_TYPE_CO_APPLICANTS ? 'co-applicant' : match.params.type;
        const personLabel = role === RENTER_PROFILE_TYPE_GUARANTOR ? 'Guarantor' : 'Person';

        return (
            <>
                <SkinnyH1>Remove {personLabel}</SkinnyH1>
                <SpacedH3>
                    <CapitalizedSpan>
                        {person.first_name} {person.last_name}
                    </CapitalizedSpan>
                </SpacedH3>
                <Divider />
                <Content>
                    {this.state.errorSubmitting && (
                        <GenericFormMessage
                            type="error"
                            messages={['Oops! We had some trouble removing this person. Try again in a little bit.']}
                        />
                    )}
                    <Bold fontSize={18}>{`Are you sure you want to remove this ${personLabel.toLowerCase()}?`}</Bold>
                    <br />
                    <br />
                    {role === RENTER_PROFILE_TYPE_GUARANTOR ? (
                        <P>
                            You&apos;re about to remove <CapitalizedSpan>{person.first_name}</CapitalizedSpan> as
                            guarantor. Removing a guarantor prevents them from being able to financially back your lease
                            application.
                        </P>
                    ) : (
                        <P>
                            You&apos;re about to remove <CapitalizedSpan>{person.first_name}</CapitalizedSpan>
                            {`. Removing a person prevents them from being able to apply for this unit as a ${role} or from being added to the lease.`}
                        </P>
                    )}
                </Content>
                <ActionButton
                    id="submit-btn"
                    disabled={this.state.submitting}
                    onClick={this.onSubmit}
                    marginBottom={20}
                    marginTop={100}
                >
                    Remove {personLabel}
                </ActionButton>
                <ActionButton id="cancel-btn" onClick={this.onCancel} variant="outlined" marginBottom={20}>
                    Cancel
                </ActionButton>
            </>
        );
    }
}

RemovePersonPage.propTypes = {
    profile: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
    fetchRenterProfile: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
});

const mapDispatchToProps = {
    fetchRenterProfile,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(RemovePersonPage);
