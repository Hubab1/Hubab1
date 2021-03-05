import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import get from 'lodash/get';

import { ROUTES, RENTER_PROFILE_TYPE_CO_APPLICANTS } from 'constants/constants';
import { serializeDate } from 'utils/misc';

import { updateRenterProfile } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import { BackLink } from 'components//BackLink/BackLink';
import InviteForm from 'components//Forms/InviteForm/InviteForm';
import { H1, H3 } from 'assets/styles';
import roommatesImage from 'assets/images/roommates.png';

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export class EditDependentPage extends Component {
    state = { confirmSent: false, errors: null };

    updateDependant = (values, { setSubmitting, setErrors }) => {
        const serialized = Object.assign({}, values);
        const serializedBirthday = serializeDate(serialized.birthday);
        if (serializedBirthday) {
            serialized.birthday = serializedBirthday;
        }
        serialized.id = this.props.match.params.id;

        this.props.toggleLoader(true);

        this.props
            .updateRenterProfile({ dependents: [serialized] })
            .then((res) => {
                if (res.errors) {
                    const errorsObj = get(res, 'errors.dependents');
                    const errors = errorsObj && Object.values(errorsObj)[0];
                    errors
                        ? setErrors(errors)
                        : this.setState({
                              errors: ['There was an error updating your dependent. Please Try again.'],
                          });
                } else {
                    this.props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`);
                }
            })
            .catch(() => {
                this.setState({ errors: ['There was an error updating your dependent. Please Try again.'] });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    render() {
        if (this.props.profile == null) return null;

        const dependent = this.props.profile.dependents.find((x) => x.id === parseInt(this.props.match.params.id));
        return (
            <>
                <H1>Edit a Person</H1>
                <SpacedH3>Enter their info below.</SpacedH3>
                <img src={roommatesImage} alt="hand with smartphone in it" />
                <InviteForm
                    initialIsDependent={true}
                    disableTypeChange={true}
                    initialValues={dependent}
                    onSubmitDependent={this.updateDependant}
                    handleOnSubmit={() => {}}
                    displayedErrors={this.state.errors}
                    buttonText="Save Changes"
                />
                <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_CO_APPLICANTS}`} />
            </>
        );
    }
}

EditDependentPage.propTypes = {
    profile: PropTypes.object,
    match: PropTypes.object,
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

export default connect(mapStateToProps, mapDispatchToProps)(EditDependentPage);
