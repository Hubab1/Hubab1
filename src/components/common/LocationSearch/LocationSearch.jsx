import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import { Paper, TextField, MenuList, MenuItem } from '@material-ui/core';
import styled from '@emotion/styled';

import useOutsideComponentClickCallback from 'hooks/useOutsideComponentClickCallback';
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

export const LocationSearch = ({ value, validationError, didSubmit, onChange, onAddressPicked, ...props }) => {
    const componentRef = useRef(null);
    const [error, setErrors] = useState(undefined);
    const [chooseASuggestion, setChooseASuggestion] = useState(false);

    const reset = useCallback(() => {
        onChange('');
    }, [onChange]);

    useOutsideComponentClickCallback(componentRef, reset);

    const handleAddressSearched = useCallback(
        async (address) => {
            if (!address || address === '') {
                return;
            }

            setErrors(undefined);
            setChooseASuggestion(true);

            try {
                const [result] = await geocodeByAddress(address);
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
                setErrors(['Oops! We’re having trouble finding that address. Please try again.']);
            }
        },
        [onAddressPicked, setErrors]
    );

    const handleChange = useCallback(
        (address) => {
            setChooseASuggestion(false);
            onChange(address);
        },
        [onChange]
    );

    const handleError = useCallback((status, clearSuggestions) => {
        clearSuggestions();
    }, []);

    return (
        <PlacesAutocomplete
            debounce={100}
            value={value}
            onChange={handleChange}
            onSelect={handleAddressSearched}
            onError={handleError}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                const hasSuggestions = suggestions.length > 0;
                const showSuggestions = loading || hasSuggestions;
                const showErrror = didSubmit && chooseASuggestion && (error || validationError);
                const errorMessage = showErrror ? error || validationError : null;
                const inputProps = getInputProps();

                return (
                    <div ref={componentRef}>
                        <TextField
                            {...props}
                            {...inputProps}
                            value={value}
                            error={showErrror}
                            helperText={errorMessage}
                        />
                        {showSuggestions && (
                            <Paper elevation={8}>
                                <MenuList>
                                    {loading && <MenuItem>Loading...</MenuItem>}
                                    {suggestions.map((suggestion, i) => {
                                        const suggestionProps = getSuggestionItemProps(suggestion);

                                        return (
                                            <MenuItem {...suggestionProps} key={i}>
                                                {suggestion.description}
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
            }}
        </PlacesAutocomplete>
    );
};

LocationSearch.propTypes = {
    value: PropTypes.string,
    validationError: PropTypes.string,
    didSubmit: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onAddressPicked: PropTypes.func.isRequired,
};

export default LocationSearch;
