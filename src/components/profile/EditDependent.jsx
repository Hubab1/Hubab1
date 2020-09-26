import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { BackLink } from 'components/common/BackLink';
import { H1, H3 } from 'assets/styles';
import { ROUTES, RENTER_PROFILE_TYPE_CO_APPLICANTS } from 'app/constants';
import roommatesImage from 'assets/images/roommates.png';
import { InviteForm } from 'components/common/InviteForm';
import { connect } from 'react-redux';
import { updateRenterProfile } from 'reducers/renter-profile';
import { serializeDate } from 'utils/misc';
import get from 'lodash/get';

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export class EditDependent extends React.Component {
    state = { confirmSent: false, errors: null };

    updateDependant = (values, { setSubmitting, setErrors }) => {
        const serialized = Object.assign({}, values);
        const serializedBirthday = serializeDate(serialized.birthday);
        if (serializedBirthday) {
            serialized.birthday = serializedBirthday;
        }
        serialized.id = this.props.match.params.id;
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
                setSubmitting(false);
            })
            .catch(() => {
                this.setState({ errors: ['There was an error updating your dependent. Please Try again.'] });
                setSubmitting(false);
            });
    };

    render() {
        if (this.props.profile == null) return null;

        const dependent = this.props.profile.dependents.find((x) => x.id === parseInt(this.props.match.params.id));
        return (
            <Fragment>
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
            </Fragment>
        );
    }
}

EditDependent.propTypes = {
    profile: PropTypes.object,
    updateRenterProfile: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
});

export default connect(mapStateToProps, { updateRenterProfile })(EditDependent);
