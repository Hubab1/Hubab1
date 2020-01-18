import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';

export default function ExistingPet({item}) {
    const typeLabel = item.service_animal ? `${item.pet_type} - Service Animal` : item.pet_type;

    const strBuilder = [];
    if (item.name) strBuilder.push(item.name);
    if (item.breed) strBuilder.push(item.breed);
    if (item.weight) strBuilder.push(`${item.weight}lbs`);
    if (item.description) strBuilder.push(item.description);
    const petDetails = strBuilder.join(', ');

    return <div>
        {typeLabel}
        <br/>
        <P color="#828796" fontSize={14}>{petDetails}</P>
    </div>;
}

ExistingPet.propTypes = { item: PropTypes.object };
