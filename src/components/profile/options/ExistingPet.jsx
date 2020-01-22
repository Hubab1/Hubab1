import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { PET_RENTAL_OPTION_TYPE_TO_LABEL_MAP } from 'app/constants';

export default function ExistingPet({item}) {
    const typeLabel = PET_RENTAL_OPTION_TYPE_TO_LABEL_MAP[item.pet_type]
    const mainLabel = JSON.parse(item.service_animal) ? `${typeLabel} - Service Animal` : typeLabel;

    const strBuilder = [];
    if (item.name) strBuilder.push(item.name);
    if (item.breed) strBuilder.push(item.breed);
    if (item.weight) strBuilder.push(`${item.weight}lbs`);
    if (item.description) strBuilder.push(item.description);
    const petDetails = strBuilder.join(', ');

    return <div>
        {mainLabel}
        <br/>
        <P color="#828796" fontSize={14}>{petDetails}</P>
    </div>;
}

ExistingPet.propTypes = { item: PropTypes.object };
