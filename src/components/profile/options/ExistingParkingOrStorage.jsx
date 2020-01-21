import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { formatCurrency } from 'utils/misc';


export default function ExistingParkingOrStorage({item, options}) {
    const { quantity, rental_option } = item;
    const rentalOption = options.find(option => option.id === rental_option.id);

    const { included, monthly_amount, name } = rentalOption;
    
    let details = '';
    let additionalPaymentQuantity = 0;

    if (!!included) {
        const includedQuantity = (included >= quantity) ? quantity : (quantity - included);
        details += `${includedQuantity} Included`;
        additionalPaymentQuantity = (included > quantity) ? 0 : quantity - included;
    } else {
        additionalPaymentQuantity = quantity;
    }

    if (additionalPaymentQuantity > 0) {
        const priceShouldShowDecimal = monthly_amount.substring(monthly_amount.length-2) !== '00';
        const priceLabel = priceShouldShowDecimal ? `$${monthly_amount}` : formatCurrency(parseInt(monthly_amount), 0);
        const additionalPaymentDetails = included ? `, ${additionalPaymentQuantity} x ${priceLabel}/mo` : `${additionalPaymentQuantity} x ${priceLabel}/mo`;
        details += additionalPaymentDetails;
    }



    return <div>
        {name}
        <br/>
        <P color="#828796" fontSize={14}>{details}</P>
    </div>;
}

ExistingParkingOrStorage.propTypes = { 
    item: PropTypes.object,
    options: PropTypes.array,
};


