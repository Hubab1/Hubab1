import React from 'react';
import PropTypes from 'prop-types';
import { styles } from '../styles';

import { getPaymentItemName } from 'utils/misc';

export function PaymentDetailSavingsRows({ paymentObject, paymentType }) {
    const rows = paymentObject.items.map((item) => (
        <PaymentDetailSavingsRow
            key={`${item.name}-${paymentType}`}
            name={item.name}
            paymentTotal={item.amount}
            pricePerMonth={item.price}
            months={item.months}
            className={styles.paymentDetailRow}
        />
    ));
    rows.push(
        <PaymentDetailSavingsRow
            key={`total${paymentType}`}
            name={'Total'}
            paymentTotal={paymentObject.total}
            className={styles.paymentDetailTotal}
        />
    );
    return rows;
}

PaymentDetailSavingsRows.propTypes = {
    paymentObject: PropTypes.object.isRequired,
    paymentType: PropTypes.string.isRequired,
};

export const PaymentDetailSavingsRow = ({ paymentTotal, name, months, pricePerMonth, className }) => {
    const monthsPlural = months > 1 ? 's' : '';

    return (
        <div className={className}>
            <div>
                {getPaymentItemName(name)}
                {months && `: ${months} month${monthsPlural} at $${pricePerMonth}/month`}
            </div>
            <div>${paymentTotal}</div>
        </div>
    );
};

PaymentDetailSavingsRow.propTypes = {
    name: PropTypes.string.isRequired,
    paymentTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    months: PropTypes.number,
    pricePerMonth: PropTypes.string,
};
