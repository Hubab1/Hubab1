import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Formik } from 'formik';
import Box from '@material-ui/core/Box';

import { ROUTES, RENTER_PROFILE_TYPE_PARKING } from 'constants/constants';
import { rentalOptionsInitialValues, getRentalOptionSubtitleItemAdder, rentalOptionCTALabel } from 'utils/misc';

import { updateRenterProfile } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import PriceBreakdown from 'components//PriceBreakdown/PriceBreakdown';
import GenericFormMessage from 'components//GenericFormMessage/GenericFormMessage';
import { BackLink } from 'components//BackLink/BackLink';
import ItemAdder from 'components//ItemAdder/ItemAdder';
import ActionButton from 'components//ActionButton/ActionButton';
import { H1, SpacedH3 } from 'assets/styles';
import parkingImage from 'assets/images/parking.png';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 123px;
        max-width: 123px;
    }
`;

export const ParkingPage = (props) => {
    const [errorSubmitting, setErrorSubmitting] = useState(false);
    if (!props.config || !props.application) return null;

    const onSubmit = (values, { setSubmitting, setErrors }) => {
        setErrorSubmitting(false);
        const selectedRentalOptionsArray = [];
        Object.entries(values).forEach((option) => {
            selectedRentalOptionsArray.push({
                rental_option: { id: parseInt(option[0]) },
                quantity: option[1].quantity,
            });
        });
        const selectedRentalOptions = Object.assign({}, { selected_rental_options: selectedRentalOptionsArray });

        props.toggleLoader(true);

        return props
            .updateRenterProfile(selectedRentalOptions)
            .then((res) => {
                if (res.errors) {
                    setErrors(res.errors);
                    setErrorSubmitting(true);
                } else {
                    props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_PARKING}`);
                }
            })
            .finally(() => {
                props.toggleLoader(false);
                setSubmitting(false);
            });
    };
    const initialParkingOptions = props.application.selected_rental_options.parking;
    const parkingOptions = props.config.rental_options.parking || [];

    const getSubtitles = (option) => {
        const subtitles = getRentalOptionSubtitleItemAdder(option, 'parking space');
        return subtitles.split('\n').map((item, key) => {
            return (
                <span key={key}>
                    {item}
                    <br />
                </span>
            );
        });
    };

    return (
        <>
            <H1>Parking</H1>
            <SpacedH3>This is a request for parking. All parking is based on availability.</SpacedH3>
            <ImageContainer>
                <img src={parkingImage} alt="car parking" />
            </ImageContainer>
            <Formik
                onSubmit={onSubmit}
                initialValues={rentalOptionsInitialValues(initialParkingOptions, parkingOptions)}
            >
                {({ values, handleSubmit, setFieldValue, dirty, isSubmitting }) => {
                    const submitLabel = rentalOptionCTALabel(initialParkingOptions, 'Add Parking');
                    return (
                        <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                            {errorSubmitting && (
                                <GenericFormMessage
                                    type="error"
                                    messages={['We couldn’t save your parking options. Please try again.']}
                                />
                            )}
                            {parkingOptions.map((option) => (
                                <ItemAdder
                                    key={option.id}
                                    title={option.name}
                                    subtitle={getSubtitles(option)}
                                    value={values[option.id].quantity}
                                    limit={option.limit}
                                    onChange={(e) => {
                                        setFieldValue(`[${option.id}].quantity`, e);
                                    }}
                                />
                            ))}
                            {Object.values(values).reduce((a, b) => a + b.quantity, 0) > 0 && (
                                <PriceBreakdown
                                    selectedOptions={values}
                                    application={props.application}
                                    category={'Parking'}
                                    categoryHelperText={'parking spaces'}
                                    moveInDate={props.application.lease_start_date}
                                />
                            )}
                            <ActionButton marginTop={68} disabled={!dirty || isSubmitting}>
                                {submitLabel}
                            </ActionButton>
                        </form>
                    );
                }}
            </Formik>
            <Box padding="20px">
                <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_PARKING}`} />
            </Box>
        </>
    );
};

ParkingPage.propTypes = {
    config: PropTypes.object,
    application: PropTypes.object,
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
    updateRenterProfile: PropTypes.func,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
    application: state.renterProfile,
});

const mapDispatchToProps = {
    updateRenterProfile,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingPage);
