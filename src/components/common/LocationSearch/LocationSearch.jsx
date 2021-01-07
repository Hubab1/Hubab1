import React, { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { Paper, TextField, MenuList, MenuItem } from '@material-ui/core';
import styled from '@emotion/styled';

import * as utils from './utils';
import GoogleImg from 'assets/images/google.png';

const PoweredBy = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    padding: 5px;

    img {
        margin-left: 5px;
        width: 40px;
    }
`;

// https://developers.google.com/maps/documentation/geocoding/intro#Types
const TYPES = {
    city: 'locality',
    cityFallback: 'sublocality',
    streetName: 'route',
    streetNumber: 'street_number',
    postalCode: 'postal_code',
    state: 'administrative_area_level_1',
    county: 'country',
};

const FETCH_ERROR = 'Oops! We’re having trouble finding that address. Please try again.';

const LocationSearch = ({
    value,
    delay = 300,
    submitCount = 0,
    validationError = undefined,
    searchOptions = {},
    onChange,
    onAddressPicked,
    resetValidationErrors,
    ...props
}) => {
    const autocompleteService = useRef(undefined);
    const autocompleteOK = useRef(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [predictions, setPredictions] = useState([]);
    const [hidePredictions, setHidePredictions] = useState(false);
    const showValidaitonError = submitCount > 0 && validationError;
    const errorMessage = error ? error : showValidaitonError ? validationError : undefined;

    useEffect(() => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        autocompleteOK.current = window.google.maps.places.PlacesServiceStatus.OK;
    }, []);

    const fetchSuggestions = useCallback(
        debounce(() => {
            if (!value) return;

            setError(undefined);
            setIsLoading(true);

            autocompleteService.current.getPlacePredictions(
                {
                    ...searchOptions,
                    input: value,
                },
                (predictions, status) => {
                    if (status === autocompleteOK.current) {
                        setPredictions(predictions);
                    }

                    setIsLoading(false);
                }
            );
        }, delay),
        [value]
    );

    const handleChange = useCallback(
        (e) => {
            onChange(e.target.value);
            resetValidationErrors();
            fetchSuggestions();
        },
        [onChange, resetValidationErrors, fetchSuggestions]
    );

    const handleFocus = useCallback(() => {
        setHidePredictions(false);
    }, []);

    const handleBlur = useCallback(() => {
        // Note: timeout to take into account clicking a prediction before the dissapear
        setTimeout(() => {
            setHidePredictions(true);
        }, 200);
    }, []);

    const handlePredictionClick = useCallback(
        async (prediction) => {
            const { description } = prediction;

            if (!description || description === '') {
                return;
            }

            setError(undefined);

            try {
                const [result] = await utils.geocodeByAddress(description);
                const { formatted_address, address_components } = result;
                let city = undefined;
                let streetName = undefined;
                let streetNumber = undefined;
                let postalCode = undefined;
                let state = undefined;
                let addressStreet = undefined;

                address_components.forEach((a) => {
                    if (a.types.indexOf(TYPES.city) !== -1) {
                        city = a.long_name;
                    } else if (!city && a.types.indexOf(TYPES.cityFallback) !== -1) {
                        city = a.long_name;
                    } else if (a.types.indexOf(TYPES.streetName) !== -1) {
                        streetName = a.long_name;
                    } else if (a.types.indexOf(TYPES.streetNumber) !== -1) {
                        streetNumber = a.long_name;
                    } else if (a.types.indexOf(TYPES.postalCode) !== -1) {
                        postalCode = a.long_name;
                    } else if (a.types.indexOf(TYPES.state) !== -1) {
                        state = a.long_name;
                    }
                });

                const addressStreetBuilder = [];
                if (streetNumber) addressStreetBuilder.push(streetNumber);
                if (streetName) addressStreetBuilder.push(streetName);
                addressStreet = addressStreetBuilder.join(' ');

                onAddressPicked({
                    search: formatted_address,
                    addressStreet,
                    city,
                    state,
                    postalCode,
                });
            } catch {
                setError(FETCH_ERROR);
            } finally {
                setPredictions([]);
            }
        },
        [onAddressPicked, setPredictions, setError]
    );

    return (
        <div>
            <TextField
                {...props}
                value={value}
                error={Boolean(error || showValidaitonError)}
                helperText={errorMessage}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
            {!hidePredictions && predictions.length > 0 && (
                <Paper elevation={8}>
                    <MenuList>
                        {isLoading && <MenuItem>Loading...</MenuItem>}
                        {predictions.map((prediction, i) => {
                            return (
                                <MenuItem key={i} onClick={() => handlePredictionClick(prediction)}>
                                    {prediction.description}
                                </MenuItem>
                            );
                        })}
                        <PoweredBy>
                            <span>Powered by</span>
                            <img src={GoogleImg} alt="powered-by-google" />
                        </PoweredBy>
                    </MenuList>
                </Paper>
            )}
        </div>
    );
};

LocationSearch.propTypes = {
    value: PropTypes.string,
    delay: PropTypes.number,
    validationError: PropTypes.string,
    searchOptions: PropTypes.object,
    submitCount: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onAddressPicked: PropTypes.func.isRequired,
    resetValidationErrors: PropTypes.func.isRequired,
};

export default LocationSearch;
