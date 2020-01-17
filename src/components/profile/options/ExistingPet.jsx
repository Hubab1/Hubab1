import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';

export default function ExistingPet({item}) {
    const pet = item.leasing_context.pets[0];

    const typeLabel = pet.service_animal ? `${pet.pet_type} - Service Animal` : pet.pet_type;

    const strBuilder = [];
    if (pet.name) strBuilder.push(pet.name);
    if (pet.breed) strBuilder.push(pet.breed);
    if (pet.weight) strBuilder.push(`${pet.weight}lbs`);
    if (pet.description) strBuilder.push(pet.description);
    const petDetails = strBuilder.join(', ');

    return <div>
        {typeLabel}
        <br/>
        <P color="#828796" fontSize={14}>{petDetails}</P>
    </div>;
}

ExistingPet.propTypes = { item: PropTypes.object };
