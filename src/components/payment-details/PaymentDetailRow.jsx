import PropTypes from 'prop-types';
import React from 'react';
import { styles } from './styles';
import { getPaymentItemName } from 'utils/misc';

export function PaymentDetailRows({ paymentObject, paymentType }) {
    const rows = paymentObject.items.map((item) => (
        <PaymentDetailRow
            key={`${item.name}-${paymentType}`}
            className={styles.paymentDetailRow}
            name={item.name}
            paymentTotal={item.amount}
            quantity={item.quantity}
            price={item.price}
            included={item.included}
            perDay={item.per_day}
            prorated={item.prorated}
            days={item.days}
        />
    ));

    rows.push(
        <PaymentDetailRow
            key={`total${paymentType}`}
            name="Total"
            paymentTotal={paymentObject.total}
            className={styles.paymentDetailTotal}
        />
    );

    return rows;
}

PaymentDetailRows.propTypes = {
    paymentObject: PropTypes.object.isRequired,
    paymentType: PropTypes.string.isRequired,
};

export const PaymentDetailRow = ({
    name,
    paymentTotal,
    quantity = 1,
    price,
    included = 0,
    className,
    prorated,
    days,
    perDay,
}) => {
    if (!quantity) return null;

    return (
        <div className={className}>
            <div>{getRentalOptionFeeDisplayName(name, price, quantity, included, prorated, days, perDay)}</div>
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
    prorated: PropTypes.bool,
    days: PropTypes.number,
    perDay: PropTypes.string,
};

// This should match the logic in chuck
export function getRentalOptionFeeDisplayName(name, price, quantity = 1, included = 0, prorated, days, perDay) {
    if (quantity < 1) return null;

    const feesBreakdown = [];
    const num_included = quantity > included ? included : quantity;
    if (num_included > 0) {
        feesBreakdown.push(`${num_included} incl.`);
    }

    const num_charged = quantity > included ? quantity - included : 0;
    if (num_charged > 0 && quantity > 1 && !prorated) {
        feesBreakdown.push(`${num_charged} x $${price}`);
    }

    let displayName = `${getPaymentItemName(name)}`;

    if (prorated && num_charged > 0 && quantity > 0) {
        displayName += `: ${days} days at $${perDay}/day`;
    }

    if (feesBreakdown.length > 0) {
        displayName += ` (${feesBreakdown.join(', ')})`;
    }

    return displayName;
}
