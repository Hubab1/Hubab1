import React from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { prettyCurrency } from 'utils/misc';

export default function ExistingGenericRentalOption({ quantity, rentalOption }) {
    const { included, monthly_amount, name } = rentalOption;

    let detailsArray = [];
    let additionalPaymentQuantity = quantity;

    if (!!included) {
        const includedQuantity = included >= quantity ? quantity : quantity - included;
        detailsArray = [`${includedQuantity} Included`];
        additionalPaymentQuantity = included > quantity ? 0 : quantity - included;
    }

    if (additionalPaymentQuantity > 0) {
        const priceLabel = prettyCurrency(parseFloat(monthly_amount || 0));
        const additionalPaymentDetails = `${additionalPaymentQuantity} x ${priceLabel}/mo`;
        detailsArray.push(additionalPaymentDetails);
    }

    const details = detailsArray.join(', ');

    return (
        <div>
            {name}
            <br />
            <P color="#828796" fontSize={14}>
                {details}
            </P>
        </div>
    );
}

ExistingGenericRentalOption.propTypes = {
    quantity: PropTypes.number,
    rentalOption: PropTypes.shape({
        included: PropTypes.number,
        monthly_amount: PropTypes.string,
        name: PropTypes.string,
    }),
};
