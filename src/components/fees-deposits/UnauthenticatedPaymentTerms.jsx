import React from 'react';

import PaymentTerms from './PaymentTerms';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';


export const UnauthenticatedPaymentTerms = () => {
    return <UnauthenticatedPage>
        <PaymentTerms/>
    </UnauthenticatedPage>;
};

export default UnauthenticatedPaymentTerms;
