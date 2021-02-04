import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import API from 'app/api';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import { isValid } from 'date-fns';
import { offsetDate } from 'utils/misc';

// Adjust box shawdow to match AvailableUnitSelector box shadow (elevation 8)
const useStyles = makeStyles((theme) => ({
    paper: {
        boxShadow: theme.shadows[8],
        maxHeight: 300,
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
    // const [didHideKeyboard, setDidHideKeyboard] = useState(false);
    const [leaseTerms, setLeaseTerms] = useState([]);
    const [isReady, setIsReady] = useState(false);

    // useEffect(() => {
    //     document.activeElement.blur();
    //     setDidHideKeyboard(true);
    // }, []);

    useEffect(() => {
        if (props.unitId && leaseTerms.length === 0) {
            const data = {
                unit_id: props.unitId,
                move_in_date: props.leaseStartDate?.toISOString().split('T')[0],
            };

            API.fetchAvailableLeaseTerms(data).then((res) => {
                if (res.lease_terms?.length) setLeaseTerms(res.lease_terms);
                setIsReady(true);
            });
        }
    }, [props, leaseTerms]);

    // if (!didHideKeyboard) return null;

    const [open, setOpen] = useState(false);

    return (
        <div>
            <FormControl
                fullWidth
                onClick={() => {
                    // eslint-disable-next-line no-console
                    console.log('Click select');

                    if (!open) {
                        document.activeElement.blur();

                        return setTimeout(() => {
                            setOpen(true);
                        }, 2000);
                    }

                    setOpen(false);
                }}
            >
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
                    {getMenuItems(isReady, leaseTerms, props.unitId)}
                    {getMenuItems(isReady, leaseTerms, props.unitId)}
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
};
