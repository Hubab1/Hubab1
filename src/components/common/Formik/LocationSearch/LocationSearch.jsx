import React, { useCallback } from 'react';
import { isEmpty } from 'lodash';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import { Paper, TextField, MenuList, MenuItem } from '@material-ui/core';
import styled from '@emotion/styled';
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
    streetName: 'route',
    streetNumber: 'street_number',
    postalCode: 'postal_code',
    state: 'administrative_area_level_1',
    county: 'country',
};

export const LocationSearch = ({ form, field, submitCount, ...props }) => {
    const errors = form.errors[field.name];
    let error = null;
    if (!isEmpty(errors)) {
        error = errors[Object.keys(errors)[0]];
    }

    const getMockedOnChangeEvent = useCallback(
        (values) => {
            return {
                target: {
                    value: {
                        ...field.value,
                        ...values,
                    },
                    name: field.name,
                },
            };
        },
        [field]
    );

    const handleChange = useCallback(
        (address) => {
            const event = getMockedOnChangeEvent({ search: address });
            field.onChange(event);
        },
        [field]
    );

    const handleSelect = useCallback(
        async (address) => {
            try {
                const [result] = await geocodeByAddress(address);
                const { formatted_address, address_components } = result;
                handleChange(address);

                let city = undefined;
                let streetName = undefined;
                let streetNumber = undefined;
                let postalCode = undefined;
                let state = undefined;
                let county = undefined;

                address_components.forEach((a) => {
                    if (a.types.indexOf(TYPES.city) !== -1) {
                        city = a.long_name;
                    } else if (a.types.indexOf(TYPES.streetName) !== -1) {
                        streetName = a.long_name;
                    } else if (a.types.indexOf(TYPES.streetNumber) !== -1) {
                        streetNumber = a.long_name;
                    } else if (a.types.indexOf(TYPES.postalCode) !== -1) {
                        postalCode = a.long_name;
                    } else if (a.types.indexOf(TYPES.state) !== -1) {
                        state = a.long_name;
                    } else if (a.types.indexOf(TYPES.county) !== -1) {
                        county = a.long_name;
                    }
                });

                const event = getMockedOnChangeEvent({
                    search: formatted_address,
                    address_street: streetName,
                    address_city: city,
                    address_state: state,
                    address_postal_code: postalCode,
                });

                field.onChange(event);
            } catch (error) {
                // TODO: handle error
            }
        },
        [handleChange]
    );

    return (
        <PlacesAutocomplete debounce={300} value={field.value.search} onChange={handleChange} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                const hasSuggestions = suggestions.length > 0;
                const showSuggestions = loading || hasSuggestions;
                const inputProps = getInputProps();

                return (
                    <>
                        <TextField
                            {...field}
                            {...props}
                            {...inputProps}
                            error={submitCount > 0 && !!error}
                            helperText={submitCount > 0 && error}
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
                                        <img src={GoogleImg} />
                                    </PoweredBy>
                                </MenuList>
                            </Paper>
                        )}
                    </>
                );
            }}
        </PlacesAutocomplete>
    );
};

export default LocationSearch;
