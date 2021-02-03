import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { filter } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import API from 'app/api';

export default function AvailableUnitsSelector({
    value,
    disabled,
    error,
    helperText,
    application,
    leaseStartDate,
    onChange,
}) {
    const [units, setUnits] = useState([]);
    const [availableUnits, setAvailableUnits] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        API.fetchAvailableUnits().then((units) => {
            if (units.length) {
                // The available units returned by our request might not contain the application's unit if this unit has been marked as below-market-rate.
                // This may happen when an applicant was invited with a personalized link for a unit that is actually below-market-rate.
                // In that case, we manually add it to the list of available units.
                const availableUnits = [...units];
                const applicationUnitIsInListOfUnits =
                    application?.unit && availableUnits.findIndex((u) => u.id === application.unit.id) === -1;

                if (application?.unit_available && applicationUnitIsInListOfUnits) {
                    availableUnits.push(application.unit);
                }

                setUnits(availableUnits);
            }
            setIsReady(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const availableAtLeaseDate = (unit) => {
            if (leaseStartDate === null) {
                return true;
            }
            return moment(leaseStartDate).isAfter(unit.date_available);
        };

        const availableUnits = filter(units, availableAtLeaseDate);
        setAvailableUnits(availableUnits);
    }, [units, leaseStartDate]);

    const isLoading = !isReady || availableUnits.length === 0;
    const loadingText = !isReady ? 'Loading ...' : availableUnits.length === 0 ? 'No results found' : undefined;

    const handleChange = useCallback(
        (_, u) => {
            onChange(u);
        },
        [onChange]
    );

    return (
        <Autocomplete
            options={availableUnits}
            getOptionLabel={(u) => u.unit_number}
            getOptionSelected={(option, value) => option.id === value.id}
            value={value}
            disabled={disabled}
            loading={isLoading}
            loadingText={loadingText}
            onChange={handleChange}
            includeInputInList
            disableClearable
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        fullWidth
                        label="Select Unit"
                        error={error}
                        helperText={helperText}
                        disabled={disabled}
                    />
                );
            }}
        />
    );
}

AvailableUnitsSelector.propTypes = {
    value: PropTypes.object,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.bool,
    application: PropTypes.object.isRequired,
    leaseStartDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
};
