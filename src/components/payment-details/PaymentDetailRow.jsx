import PropTypes from 'prop-types';
import React from 'react';
import { styles } from './styles';

export function PaymentDetailRows({ paymentObject, paymentType }) {
    const rows = paymentObject.items.map(item => (
        <PaymentDetailRow
            key={`${item.name}-${paymentType}`}
            name={item.name}
            paymentTotal={item.amount}
            quantity={item.quantity}
            price={item.price}
            included={item.included}
            className={styles.paymentDetailRow}
        />
    ));

    rows.push(
        <PaymentDetailRow
            key={`total${paymentType}`}
            name="Total"
            paymentTotal={paymentObject.total}
            className={styles.paymentDetailTotal}
        />);

    return rows;
}

PaymentDetailRows.propTypes = {
    paymentObject: PropTypes.object.isRequired,
    paymentType: PropTypes.string.isRequired,
};

export const PaymentDetailRow = ({ name, paymentTotal, quantity = 1, price, included = 0, className }) => {
    if (quantity < 1) return null;

    return (
        <div className={className}>
            <div>{getRentalOptionFeeDisplayName(name, price, quantity, included)}</div>
            <div>${paymentTotal}</div>
        </div>
    );
};

PaymentDetailRow.propTypes = {
    className: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    paymentTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    quantity: PropTypes.number,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    included: PropTypes.number,
};


// This should match the logic in chuck
export function getRentalOptionFeeDisplayName(name, price, quantity = 1, included = 0) {
    if (quantity < 1) return null;

    const feesBreakdown = [];
    const num_included = quantity > included ? included : quantity;
    if (num_included > 0) {
        feesBreakdown.push(`${num_included} incl.`);
    }

    const num_charged = quantity > included ? quantity - included : 0;
    if (num_charged > 0 && quantity > 1) {
        feesBreakdown.push(`${num_charged} x $${price}`);
    }

    let displayName = `${name}`;

    if (feesBreakdown.length > 0) {
        displayName += ` (${feesBreakdown.join(', ')})`;
    }

    return displayName;
}
