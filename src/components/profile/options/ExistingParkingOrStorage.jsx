import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { formatCurrency } from 'utils/misc';


export default function ExistingParkingOrStorage({item, options}) {
    const rentalOption = options.find(option => option.id === item.rental_option.id);

    const priceShouldShowDecimal = rentalOption.monthly_amount.substring(rentalOption.monthly_amount.length-2) !== '00';
    const priceLabel = priceShouldShowDecimal ? `$${rentalOption.monthly_amount}` : formatCurrency(parseInt(rentalOption.monthly_amount), 0);
    const selectedDetails = `${item.quantity} x ${priceLabel}/mo`;
    
    const included = rentalOption.included;
    const details = included ? `${included} Included - ${selectedDetails}` : selectedDetails;
    return <div>
        {rentalOption.name}
        <br/>
        <P color="#828796" fontSize={14}>{details}</P>
    </div>;
}

ExistingParkingOrStorage.propTypes = { 
    item: PropTypes.object,
    options: PropTypes.array,
};
