import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import ActionButton from 'components/common/ActionButton/ActionButton';

import { ROUTES } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import { MultiSelect, MultiSelectChoice } from './MultiSelect';
import { H1, P } from 'assets/styles';
import withRelativeRoutes from 'app/withRelativeRoutes';

const optionConfig = {
    roommates: {
        prefix: '👪',
        name: 'roommates',
        label: 'Other adults will live here'
    },
    pets: {
        prefix: '🐶',
        name: 'pets',
        label: 'Pets will live here'
    },
    guarantor: {
        prefix: '💰',
        name: 'guarantor',
        label: 'I\'ll need a guarantor'
    },
    parking: {
        prefix: '🚗',
        name: 'parking',
        label: 'I\'d like a parking space'
    },
    storage: {
        prefix: '🛍️',
        name: 'storage',
        label: 'I\'ll need extra storage'
    }
}

export class RentalProfileOptions extends React.Component {
    onSubmit = (values, { setSubmitting }) => {
        setSubmitting(false);
        this.props.updateRenterProfile({selected_rental_options: values.options});
        this.props._nextRoute();
    }

    render () {
        const options = this.props.profile ? Object.keys(this.props.profile.rental_options_config) : [];
        return (
            <Fragment>
                <H1>Let's talk about your new place</H1>
                <P>Select all that apply</P>
                <Formik
                    initialValues={{ options: [] }}
                    validate={values => {
                        let errors = {};
                        // todo
                        return errors;
                    }}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        setFieldValue,
                        isSubmitting,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <MultiSelect
                                onChange={(value) => setFieldValue('options', value)}
                                value={values.options}
                            >
                                {options.map(option => (
                                    <MultiSelectChoice
                                        key={option}
                                        {...optionConfig[option]}
                                    />
                                ))}
                            </MultiSelect>
                            <ActionButton disabled={isSubmitting} marginTop="31px" marginBottom="10px">Continue</ActionButton>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

RentalProfileOptions.propTypes = {
    updateRenterProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    profile: state.renterProfile
})

export default connect(mapStateToProps, {updateRenterProfile})(withRelativeRoutes(RentalProfileOptions, ROUTES.PROFILE_OPTIONS));