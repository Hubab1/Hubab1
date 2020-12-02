import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Formik } from 'formik';
import Box from '@material-ui/core/Box';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import ItemAdder from 'components/common/ItemAdder';
import storageImage from 'assets/images/storage.png';
import { H1, SpacedH3 } from 'assets/styles';
import { ROUTES, RENTER_PROFILE_TYPE_STORAGE } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import { getRentalOptionSubtitleItemAdder, rentalOptionsInitialValues } from 'utils/misc';
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

export const Storage = (props) => {
    const [errorSubmitting, setErrorSubmitting] = useState(false);
    if (!props.config || !props.application) return null;

    const onSubmit = (values, { setSubmitting, setErrors }) => {
        setErrorSubmitting(false);
        const selectedRentalOptionsArray = [];
        Object.entries(values).forEach((option) => {
            selectedRentalOptionsArray.push({ rental_option: { id: parseInt(option[0]) }, quantity: option[1].quantity });
        });
        const selectedRentalOptions = Object.assign({}, { selected_rental_options: selectedRentalOptionsArray });
        return props.updateRenterProfile(selectedRentalOptions).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
                setErrorSubmitting(true);
            } else {
                props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_STORAGE}`);
            }
            setSubmitting(false);
        });
    };

    const getSubtitles = (option) => {
        const subtitles = getRentalOptionSubtitleItemAdder(option, 'storage space');
        return subtitles.split('\n').map((item, key) => {
            return (
                <span key={key}>
                    {item}
                    <br />
                </span>
            );
        });
    };

    const initialStorageOptions = props.application.selected_rental_options.storage;

    const storageOptions = props.config.rental_options.storage || [];
    return (
        <>
            <H1>Storage</H1>
            <SpacedH3>We help you make room for what matters most.</SpacedH3>
            <ImageContainer>
                <img src={storageImage} alt="storage" />
            </ImageContainer>
            <Formik
                onSubmit={onSubmit}
                initialValues={rentalOptionsInitialValues(initialStorageOptions, storageOptions)}
            >
                {({ values, handleSubmit, setFieldValue, dirty, isSubmitting }) => (
                    <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                        {errorSubmitting && (
                            <GenericFormMessage
                                type="error"
                                messages={['We couldn’t save your storage options. Please try again.']}
                            />
                        )}
                        {storageOptions.map((option) => (
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
                                category={'Storage'}
                                categoryHelperText={'storage spaces'}
                            />
                        )}
                        <ActionButton marginTop={68} disabled={!dirty || isSubmitting}>
                            Add Storage
                        </ActionButton>
                    </form>
                )}
            </Formik>
            <Box padding="20px">
                <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_STORAGE}`} />
            </Box>
        </>
    );
};

Storage.propTypes = {
    application: PropTypes.object,
    config: PropTypes.object,
    updateRenterProfile: PropTypes.func,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
    application: state.renterProfile,
});

export default connect(mapStateToProps, { updateRenterProfile })(Storage);
