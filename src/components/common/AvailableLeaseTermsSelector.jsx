import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import API from 'app/api';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { isValid } from 'date-fns';
import { offsetDate } from 'utils/misc';

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

function getLeaseEndDateText(lease_start_date, lease_term) {
    if (!lease_start_date || !lease_term) {
        return '';
    }

    if (!isValid(lease_start_date)) {
        return '';
    }

    return `Ends ${offsetDate(lease_start_date, lease_term)}`;
}

export default function AvailableLeaseTermsSelector(props) {
    const [leaseTerms, setLeaseTerms] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (props.unitId) {
            const data = {
                unit_id: props.unitId,
                move_in_date: props.lease_start_date?.toISOString().split('T')[0],
            };

            API.fetchAvailableLeaseTerms(data).then((res) => {
                if (res.lease_terms?.length) setLeaseTerms(res.lease_terms);
                setIsReady(true);
            });
        }
    }, [props]);

    return (
        <div>
            <FormControl fullWidth>
                <InputLabel htmlFor="lease-term">Lease Term</InputLabel>
                <Select
                    fullWidth
                    value={props.leaseTerm}
                    onChange={props.handleChange}
                    disabled={!props.isPrimaryApplicant}
                    inputProps={{
                        name: 'lease_term',
                        id: 'lease-term',
                    }}
                >
                    {getMenuItems(isReady, leaseTerms, props.unitId)}
                </Select>
                <FormHelperText>{getLeaseEndDateText(props.lease_start_date, props.leaseTerm)}</FormHelperText>
            </FormControl>
        </div>
    );
}

AvailableLeaseTermsSelector.propTypes = {
    unitId: PropTypes.number,
    leaseTerm: PropTypes.number,
    handleChange: PropTypes.func.isRequired,
    isPrimaryApplicant: PropTypes.bool.isRequired,
    lease_start_date: PropTypes.any,
};
