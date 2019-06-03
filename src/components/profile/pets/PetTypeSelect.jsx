import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { petTypeContainer, petTypeLabel, petButtonRoot } from './styles';

function PetTypeSelect(props) {
    const [petSelected, setPetSelected] = useState('');
  
    useEffect(() => {
        props.onChange(petSelected);
    }, [petSelected]);

    return (
        <Fragment>
            <div className={petTypeLabel}>Type</div>
            <div className={petTypeContainer}>
                {props.petTypeOptions.map(type => {
                    if (petSelected === type) {
                        return <Button 
                            key={type}
                            variant="contained"
                            color="primary"
                            classes={{root: petButtonRoot}}
                            onClick={() => setPetSelected('')}
                        >
                            {type}
                        </Button>
                    } else {
                        return <Button 
                            key={type}
                            classes={{root: petButtonRoot}}
                            variant="outlined"
                            onClick={() => setPetSelected(type)}
                        >
                            {type}
                        </Button>
                    }
                })}
            </div>
        </Fragment>
    );
}

PetTypeSelect.propTypes = {
    petTypeOptions: PropTypes.array,
    onChange: PropTypes.func,
    values: PropTypes.string,
};

PetTypeSelect.defaultProps = {
    petTypeOptions: ['Dog', 'Cat', 'Other'],
};

export default PetTypeSelect;