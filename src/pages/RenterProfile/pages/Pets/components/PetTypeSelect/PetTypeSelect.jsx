import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import Button from '@material-ui/core/Button';
import Cancel from '@material-ui/icons/Cancel';

import {
    RENTAL_OPTIONS_PETS_DOGS,
    RENTAL_OPTIONS_PETS_CATS,
    RENTAL_OPTIONS_PETS_OTHER,
    PET_RENTAL_OPTION_TYPE_TO_LABEL_MAP,
} from 'constants/constants';
import { petTypeContainer, petTypeLabel, petButtonRoot, petTypeLabelHeader } from './styles';

const cancelButton = css`
    color: #828796;
    cursor: pointer;
`;

function PetTypeSelect(props) {
    const { onDelete, onChange, petTypeOptions, hideCancelButton, value } = props;
    const sortedPetTypeOptions = [
        RENTAL_OPTIONS_PETS_DOGS,
        RENTAL_OPTIONS_PETS_CATS,
        RENTAL_OPTIONS_PETS_OTHER,
    ].filter((petType) => petTypeOptions.includes(petType));

    return (
        <Fragment>
            <div className={petTypeLabelHeader}>
                <span className={petTypeLabel}>Type</span>
                {!hideCancelButton && (
                    <Cancel role="button" style={{ fontSize: 17 }} className={cancelButton} onClick={onDelete} />
                )}
            </div>
            <div className={petTypeContainer}>
                {sortedPetTypeOptions.map((type) => {
                    const label = PET_RENTAL_OPTION_TYPE_TO_LABEL_MAP[type];
                    if (value === type) {
                        return (
                            <Button key={type} variant="contained" color="primary" classes={{ root: petButtonRoot }}>
                                {label}
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={type}
                            classes={{ root: petButtonRoot }}
                            variant="outlined"
                            onClick={() => onChange(type)}
                        >
                            {label}
                        </Button>
                    );
                })}
            </div>
        </Fragment>
    );
}

PetTypeSelect.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    petTypeOptions: PropTypes.array.isRequired,
    hideCancelButton: PropTypes.bool.isRequired,
    value: PropTypes.string,
};

PetTypeSelect.defaultProps = {
    petTypeOptions: [RENTAL_OPTIONS_PETS_DOGS, RENTAL_OPTIONS_PETS_CATS, RENTAL_OPTIONS_PETS_OTHER],
};

export default PetTypeSelect;
