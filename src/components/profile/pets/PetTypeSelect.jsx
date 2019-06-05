import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { petTypeContainer, petTypeLabel, petButtonRoot, petTypeLabelHeader } from './styles';

function PetTypeSelect(props) {
    const { onChange, petTypeOptions, value } = props;
    return (
        <Fragment>
            <div className={petTypeLabelHeader}>
                <span className={petTypeLabel}>Type</span>
                <span>{props.topAdornment}</span>
            </div>
            <div className={petTypeContainer}>
                {petTypeOptions.map(type => {
                    if (value === type) {
                        return <Button 
                            key={type}
                            variant="contained"
                            color="primary"
                            classes={{root: petButtonRoot}}
                            onClick={() => onChange('')}
                        >
                            {type}
                        </Button>
                    } else {
                        return <Button 
                            key={type}
                            classes={{root: petButtonRoot}}
                            variant="outlined"
                            onClick={() => onChange(type)}
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
    value: PropTypes.string,
};

PetTypeSelect.defaultProps = {
    petTypeOptions: ['Dog', 'Cat', 'Other'],
};

export default PetTypeSelect;