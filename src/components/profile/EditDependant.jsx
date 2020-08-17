import React, {Fragment} from 'react';
import styled from '@emotion/styled';

import { BackLink } from 'components/common/BackLink';
import { H1, H3 } from 'assets/styles';
import { ROUTES, RENTER_PROFILE_TYPE_CO_APPLICANTS } from 'app/constants';
import roommatesImage from 'assets/images/roommates.png';
import { InviteForm } from 'components/common/InviteForm';
import {connect} from "react-redux";
import { updateRenterProfile } from 'reducers/renter-profile';
//import { serializeDate } from 'utils/misc';

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export class EditDependant extends React.Component {
    state = {confirmSent: false, errors: null};

    updateDependant = (values, { setSubmitting, setErrors }) => {
        this.props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`);
        setSubmitting(false);
        // const serialized = Object.assign({}, values);
        // serialized.birthday = serializeDate(serialized.birthday);
    };

    render () {
        if (this.props.profile == null) return null;

        const dependant = this.props.profile.dependents.find(x => x.id === parseInt(this.props.match.params.id));

        return (
            <Fragment>
                <H1>Edit a Person</H1>
                <SpacedH3>Enter their info below.</SpacedH3>
                <img src={roommatesImage} alt="hand with smartphone in it"/>
                <InviteForm
                    initialIsDependent={true}
                    dependantOnly={true}
                    initialValues={dependant}
                    onSubmitDependent={this.updateDependant}
                    handleOnSubmit={()=> {}}
                    displayedErrors={this.state.errors}
                    buttonText="Save Changes"
                />
                <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`}/>
            </Fragment>
        );
    }
}
const mapStateToProps = state => ({
    profile: state.renterProfile,
});

export default connect(mapStateToProps, {updateRenterProfile})(EditDependant);
