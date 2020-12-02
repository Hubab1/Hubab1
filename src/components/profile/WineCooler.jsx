import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Formik } from 'formik';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import ItemAdder from 'components/common/ItemAdder';
import wineCoolerImage from 'assets/images/fridge.png';
import { H1, SpacedH3 } from 'assets/styles';
import { ROUTES, RENTER_PROFILE_TYPE_WINE_COOLER } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import { getRentalOptionSubtitleItemAdder, rentalOptionsInitialValues, rentalOptionCTALabel } from 'utils/misc';
import PriceBreakdown from 'components/profile/options/PriceBreakdown';
import GenericFormMessage from 'components/common/GenericFormMessage';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 123px;
        max-width: 123px;
    }
`;

export const WineCooler = (props) => {
    const [errorSubmitting, setErrorSubmitting] = useState(false);
    if (!props.config || !props.application) return null;

    const onSubmit = (values, { setSubmitting, setErrors }) => {
        setErrorSubmitting(false);
        const selectedRentalOptionsArray = [];
        Object.entries(values).forEach((option) => {
            selectedRentalOptionsArray.push({ rental_option: { id: parseInt(option[0]) }, quantity: option[1] });
        });
        const selectedRentalOptions = Object.assign({}, { selected_rental_options: selectedRentalOptionsArray });

        return props.updateRenterProfile(selectedRentalOptions).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
                setErrorSubmitting(true);
            } else {
                props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_WINE_COOLER}`);
            }
            setSubmitting(false);
        });
    };

    const getSubtitles = (option) => {
        const subtitles = getRentalOptionSubtitleItemAdder(option, 'wine cooler');
        return subtitles.split('\n').map((item, key) => {
            return (
                <span key={key}>
                    {item}
                    <br />
                </span>
            );
        });
    };

    const initialWineCoolerOptions = props.application.selected_rental_options['wine-cooler'];
    const wineCoolerOptions = props.config.rental_options['wine-cooler'] || [];
    const submitLabel = rentalOptionCTALabel(initialWineCoolerOptions, 'Add Wine Cooler');

    return (
        <>
            <H1>Wine Cooler Request</H1>
            <SpacedH3>Wine coolers are based on availability, but we’ll do our best to get you one.</SpacedH3>
            <ImageContainer>
                <img src={wineCoolerImage} alt="wine cooler" />
            </ImageContainer>
            <Formik
                onSubmit={onSubmit}
                initialValues={rentalOptionsInitialValues(initialWineCoolerOptions, wineCoolerOptions)}
            >
                {({ values, handleSubmit, setFieldValue, dirty, isSubmitting }) => (
                    <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                        {errorSubmitting && (
                            <GenericFormMessage
                                type="error"
                                messages={['We couldn’t save your wine cooler options. Please try again.']}
                            />
                        )}
                        {wineCoolerOptions.map((option) => (
                            <ItemAdder
                                key={option.id}
                                title={option.name}
                                subtitle={getSubtitles(option)}
                                value={values[option.id]}
                                limit={option.limit}
                                onChange={(e) => setFieldValue(option.id, e)}
                            />
                        ))}
                        {Object.values(values).reduce((a, b) => a + b, 0) > 0 && (
                            <PriceBreakdown
                                selectedOptions={values}
                                application={props.application}
                                category={'Wine Cooler'}
                                categoryHelperText={'wine coolers'}
                            />
                        )}
                        <ActionButton marginTop={68} disabled={!dirty || isSubmitting}>
                            {submitLabel}
                        </ActionButton>
                    </form>
                )}
            </Formik>
            <Box padding="20px">
                <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_WINE_COOLER}`} />
            </Box>
        </>
    );
};

WineCooler.propTypes = {
    config: PropTypes.object,
    application: PropTypes.object,
    updateRenterProfile: PropTypes.func,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
    application: state.renterProfile,
});

export default connect(mapStateToProps, { updateRenterProfile })(WineCooler);
