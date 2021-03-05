import React from 'react';

import { ROUTES } from 'constants/constants';
import captureRoute from 'utils/captureRoute';

import PaymentTerms from 'components//PaymentTerms/PaymentTerms';

export const PaymentTermsPage = () => {
    return <PaymentTerms />;
};

export default captureRoute(PaymentTerms, ROUTES.PAYMENT_TERMS);
