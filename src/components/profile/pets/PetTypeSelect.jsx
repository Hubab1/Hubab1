import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import Button from '@material-ui/core/Button';
import Cancel from '@material-ui/icons/Cancel';

import { petTypeContainer, petTypeLabel, petButtonRoot, petTypeLabelHeader } from './styles';

import { RENTAL_OPTIONS_PETS_DOGS, RENTAL_OPTIONS_PETS_CATS, RENTAL_OPTIONS_PETS_OTHER, PET_RENTAL_OPTION_TYPE_TO_LABEL_MAP } from 'app/constants';

const cancelButton = css`
    color: #828796;
    cursor: pointer;
`

function PetTypeSelect(props) {
    const { onCancel, onChange, petTypeOptions, showCancelButton, value } = props;
    return (
        <Fragment>
            <div className={petTypeLabelHeader}>
                <span className={petTypeLabel}>Type</span>
                {showCancelButton && <Cancel role="button" style={{fontSize: 17}} className={cancelButton} onClick={onCancel}/>}
            </div>
            <div className={petTypeContainer}>
                {petTypeOptions.map(type => {
                    if (value === type) {
                        return <Button 
                            key={type}
                            variant="contained"
                            color="primary"
                            classes={{root: petButtonRoot}}
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
                            {PET_RENTAL_OPTION_TYPE_TO_LABEL_MAP[type]}
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
    petTypeOptions: [RENTAL_OPTIONS_PETS_DOGS, RENTAL_OPTIONS_PETS_CATS, RENTAL_OPTIONS_PETS_OTHER],
};

export default PetTypeSelect;