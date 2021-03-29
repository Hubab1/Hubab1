import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isValid } from 'date-fns';
import { FormControl, InputLabel, FormHelperText, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import API from 'api/api';
import { offsetDate } from 'utils/misc';
import { isDesktop } from 'utils/mobileDetect';

const KEYBOARD_CLOSE_DURATION_MS = 30;

// Adjust box shawdow to match AvailableUnitSelector box shadow (elevation 8)
const useStyles = makeStyles((theme) => ({
    paper: {
        boxShadow: theme.shadows[8],
    },
}));

function getMenuItems(isReady, leaseTerms, unitId) {
    if (!unitId) {
        return <MenuItem key="not-ready">Please select a unit</MenuItem>;
    }
    if (!isReady) {
        return <MenuItem key="not-ready">Loading...</MenuItem>;
    }
    if (leaseTerms.length === 0) {
        return <MenuItem key="no-results">No results found</MenuItem>;
    }
    return leaseTerms.map((choice) => (
        <MenuItem key={choice} value={choice}>
            {choice} Months
        </MenuItem>
    ));
}

function getLeaseEndDateText(leaseStartDate, leaseTerm) {
    if (!leaseStartDate || !leaseTerm) {
        return '';
    }

    if (!isValid(leaseStartDate)) {
        return '';
    }

    const offsetDay = -1;
    return `Ends ${offsetDate(leaseStartDate, leaseTerm, offsetDay)}`;
}

export default function AvailableLeaseTermsSelector(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [leaseTerms, setLeaseTerms] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (props.unitId && leaseTerms.length === 0) {
            const data = {
                unit_id: props.unitId,
                move_in_date: props.leaseStartDate?.toISOString().split('T')[0],
            };

            API.fetchAvailableLeaseTerms(props.application.id, data).then((res) => {
                if (res.lease_terms?.length) setLeaseTerms(res.lease_terms);
                setIsReady(true);
            });
        }
    }, [props.unitId, props.leaseStartDate, props.application.id, leaseTerms]);

    const handleClick = useCallback(async () => {
        if (isDesktop) {
            return setOpen(!open);
        }

        if (!open) {
            // Close keyboard and wait for it to close before showing lease term options
            document.activeElement.blur();
            await new Promise((resolve) => setTimeout(resolve, KEYBOARD_CLOSE_DURATION_MS));
            return setOpen(true);
        }

        setOpen(false);
    }, [open]);

    return (
        <div>
            <FormControl fullWidth onClick={handleClick}>
                <InputLabel htmlFor="lease-term">Lease Term</InputLabel>
                <Select
                    open={open}
                    fullWidth
                    value={isReady && props.leaseTerm ? props.leaseTerm : ''}
                    onChange={props.handleChange}
                    disabled={props.disabled}
                    MenuProps={{ classes: { paper: classes.paper } }}
                    inputProps={{
                        name: 'lease_term',
                        id: 'lease-term',
                    }}
                >
                    {getMenuItems(isReady, leaseTerms, props.unitId)}
                </Select>
                <FormHelperText>{getLeaseEndDateText(props.leaseStartDate, props.leaseTerm)}</FormHelperText>
            </FormControl>
        </div>
    );
}

AvailableLeaseTermsSelector.propTypes = {
    unitId: PropTypes.number,
    leaseTerm: PropTypes.any,
    handleChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    leaseStartDate: PropTypes.any,
    application: PropTypes.object.isRequired,
};
