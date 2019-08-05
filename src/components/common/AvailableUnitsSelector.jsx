import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import API from 'app/api';

export default class AvailableUnitsSelector extends React.Component {
    state = {availableUnits: []}
    componentDidMount() {
        API.fetchAvailableUnits().then(units => {
            this.setState({availableUnits: units});
        })
    }
    
    render () {
        return (
            <div>
                <Select
                    fullWidth
                    inputProps={{
                        name: 'unit',
                        id: 'available-units',
                    }}
                >
                    {
                        this.state.availableUnits.map(unit => (
                            <MenuItem value={unit.id} key={unit.id}>{unit.unit_number}</MenuItem>
                        ))
                    }
                </Select>
            </div>
        );
    }
}