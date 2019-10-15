import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import { MultiSelect, MultiSelectChoice } from './MultiSelect';
import { H1, H3 } from 'assets/styles';
import withRelativeRoutes from 'app/withRelativeRoutes';
import guarantor from 'assets/images/guarantor.png';
import coapplicants from 'assets/images/coapplicants.png';
import doggie from 'assets/images/doggie.png';
import { BackLink } from 'components/common/BackLink';


const SkinnyH1 = styled(H1)`
    width: 70%;
`

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`

const optionConfig = {
    co_applicants: {
        prefix: <img alt="coapplicants" src={coapplicants}></img>,
        name: 'co_applicants',
        label: 'Other adults will live here'
    },
    pets: {
        prefix: <img alt="dog" src={doggie}></img>,
        name: 'pets',
        label: 'Pets will live here'
    },
    guarantor: {
        prefix: <img alt="coins" src={guarantor}></img>,
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
        this.props.updateRenterProfile({selected_rental_options: values.options}).then(() => {
            this.props._nextRoute();
            setSubmitting(false);
        });
    }

    render () {
        if (this.props.config == null || this.props.profile == null) return null;
        const options = Object.keys(this.props.config.rental_options_config);
        return (
            <Fragment>
                <SkinnyH1>Let's Talk About Your New Place</SkinnyH1>
                <SpacedH3>Select all that apply</SpacedH3>
                <Formik
                    initialValues={{ options: this.props.profile.selected_rental_options }}
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
                            <ActionButton disabled={isSubmitting} marginTop={60} marginBottom={27}>Continue</ActionButton>
                        </form>
                    )}
                </Formik>
                <BackLink to={this.props._prev}/>
            </Fragment>
        );
    }
}

RentalProfileOptions.propTypes = {
    updateRenterProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    config: state.configuration,
    profile: state.renterProfile,
})

export default connect(mapStateToProps, {updateRenterProfile})(withRelativeRoutes(RentalProfileOptions, ROUTES.PROFILE_OPTIONS));