import React from 'react';
import styled from '@emotion/styled';

import { H1, H3, P, Bold } from 'assets/styles';
import { ROUTES, RENTER_PROFILE_TYPE_CO_APPLICANTS } from 'app/constants';
import GenericFormMessage from 'components/common/GenericFormMessage';
import ActionButton from 'components/common/ActionButton/ActionButton';
import {connect} from "react-redux";
import API from 'app/api';
import { fetchRenterProfile } from 'reducers/renter-profile';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 22px;
`;

const Divider = styled.hr`
    border-style: none;
    border-bottom: 2px solid #EEEEEE;
    margin-bottom: 22px;
`;

export class RemovePerson extends React.Component {
    state = { errorSubmitting: false, financialSource: null, submitting: false };

    get returnLink () {
        return `${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`;
    }

    onSubmit = async () => {
        this.setState({submitting: true});
        try {
            await API.deletePerson(this.props.match.params.id);
        } catch {
            this.setState({submitting: false, errorSubmitting: true});
            return;
        }
        this.props.fetchRenterProfile();
        this.setState({submitting: false});
        this.props.history.push(this.returnLink);
    };


    render () {
        if (this.props.profile == null) return null;

        const role = this.props.match.params.type;

        // TODO: when removing co_applicants and/or guarantors implemented. Assign person based on this.props.match.params.type
        const person = this.props.profile.dependents.find(x => x.id === parseInt(this.props.match.params.id));
        return (
            <>
                <SkinnyH1>Remove Person</SkinnyH1>
                <SpacedH3>{`${person.first_name} ${person.last_name}`}</SpacedH3>
                <Divider />
                {this.state.errorSubmitting && (
                    <GenericFormMessage
                        type="error"
                        messages={['Oops! We had some trouble removing this person. Try again in a little bit.']}
                    />
                )}
                <Bold fontSize={18}>Are you sure you want to remove this person?</Bold><br/><br/>
                <P>{`You're about to remove ${person.first_name}. Removing a person prevents them from being able to apply for this unit as a ${role} or from being added to the lease.`}</P>
                <ActionButton disabled={this.state.submitting} onClick={this.onSubmit} marginBottom={20} marginTop={100}>
                    Remove Person
                </ActionButton>
                <ActionButton onClick={()=>this.props.history.push(this.returnLink)} variant="outlined" marginBottom={20}>
                    Cancel
                </ActionButton>
            </>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
});

export default connect(mapStateToProps, {fetchRenterProfile})(RemovePerson);
