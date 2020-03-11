import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Formik } from 'formik';
import Box from '@material-ui/core/Box';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import ItemAdder from 'components/common/ItemAdder';
import parkingImage from 'assets/images/parking.png';
import { H1, SpacedH3 } from 'assets/styles';
import { ROUTES, RENTER_PROFILE_TYPE_PARKING } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import { rentalOptionsInitialValues } from 'utils/misc';
import PriceBreakdown from "./options/PriceBreakdown";


const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 123px;
        max-width: 123px;
    }
`;

export const Parking = props => {
    if (!props.config || !props.application) return null;

    const onSubmit = (values, { setSubmitting, setErrors }) => {
        const selectedRentalOptionsArray = [];
        Object.entries(values).forEach(option => {
            selectedRentalOptionsArray.push({ rental_option: {id: parseInt(option[0])}, quantity: option[1]});
        });
        const selectedRentalOptions = Object.assign({}, {selected_rental_options: selectedRentalOptionsArray});

        return props.updateRenterProfile(selectedRentalOptions).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_PARKING}`);
            }
            setSubmitting(false);
        });
    };

    const getPriceBreakdown = (selectedOptions) => {
        return (
            <PriceBreakdown
                selectedOptions={selectedOptions}
                application={props.application}
            />);
    };

    const initialParkingOptions = props.application.selected_rental_options.parking;
    const parkingOptions = props.config.rental_options.parking || [];
    return <>
        <H1>Parking</H1>
        <SpacedH3>This is a request for parking. All parking is based on availability.</SpacedH3>
        <ImageContainer>
            <img src={parkingImage} alt="car parking"/>
        </ImageContainer>
        <Formik
            onSubmit={onSubmit}
            initialValues={rentalOptionsInitialValues(initialParkingOptions)}
        >
            {({
                values,
                handleSubmit,
                setFieldValue,
            }) => (
                <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                    { parkingOptions.map(option =>
                        <ItemAdder
                            key={option.id}
                            title={option.name}
                            subtitle={`$${option.monthly_amount}/mo per parking space`}
                            value={values[option.id]}
                            limit={option.limit}
                            onChange={e => setFieldValue(option.id, e)}
                        />
                    )}
                    {getPriceBreakdown(values)}
                    <ActionButton>Add Parking</ActionButton>
                </form>
            )}
        </Formik>
        <Box padding="20px">
            <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_PARKING}`}/>
        </Box>
    </>;
};

const mapStateToProps = state => ({
    config: state.configuration,
    application: state.renterProfile,
});

export default connect(mapStateToProps, { updateRenterProfile })(Parking);
