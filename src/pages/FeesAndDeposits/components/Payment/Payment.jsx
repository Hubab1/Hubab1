import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Link } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import { prettyCurrency } from 'utils/misc';
import { ROUTES } from 'constants/constants';
import PaymentForm from 'pages/FeesAndDeposits/components/PaymentForm/PaymentForm';
import { H1, H3, LinkButton, blackLinkRoot, arrowIcon } from 'assets/styles';
import padlockImage from 'assets/images/connect-bank/padlock.png';
import creditCardImage from 'assets/images/credit-card.png';

const SpacedH3 = styled(H3)`
    margin: 15px 10% 30px 10%;
`;

const bodyRow = css`
    display: flex;
    color: #828796;
    font-size: 12px;
    margin: 30px 30px 0 30px;
    font-weight: 300;
    align-items: center;
`;

const bodyText = css`
    margin-left: 15px;
    text-align: left;
`;

const linkStyle = css`
    color: #828796;
    font-weight: 300;
`;

export const Payment = ({ applicant, totalPayment, payments, isOutstanding, handleSuccess, handleClickBack }) => {
    const [disableBack, setDisableBack] = useState(false);

    return (
        <>
            <H1>Almost There, {applicant.first_name}!</H1>
            {!isOutstanding && (
                <SpacedH3>
                    The application fee and holding deposit for this apartment is{' '}
                    {totalPayment ? prettyCurrency(totalPayment) : '$0'}. After payment, we’ll collect your SSN for
                    screening.
                </SpacedH3>
            )}
            {isOutstanding && (
                <SpacedH3>
                    The outstanding balance for this apartment is {totalPayment ? prettyCurrency(totalPayment) : '$0'}.
                </SpacedH3>
            )}
            <img src={creditCardImage} alt="credit card" />
            <div className={bodyRow}>
                <img src={padlockImage} alt="padlock" width="18" height="28" />
                <div className={bodyText}>
                    This app will never make any transaction on your behalf. We guard your data and you can read more
                    about our{' '}
                    <Link className={linkStyle} target="_blank" to={ROUTES.PRIVACY_POLICY}>
                        privacy policy here.
                    </Link>
                </div>
            </div>
            <Elements
                /* elements requires direct import of fonts */
                fonts={[
                    {
                        cssSrc: 'https://use.typekit.net/asb6wyn.css',
                    },
                ]}
            >
                <PaymentForm
                    setDisableBack={setDisableBack}
                    onSuccess={handleSuccess}
                    totalPayment={totalPayment}
                    payments={payments}
                />
            </Elements>
            <LinkButton disabled={disableBack} className={blackLinkRoot} onClick={handleClickBack}>
                <ArrowBackIos classes={{ root: arrowIcon }} /> Go Back
            </LinkButton>
        </>
    );
};

Payment.propTypes = {
    applicant: PropTypes.object,
    totalPayment: PropTypes.number,
    payments: PropTypes.array,
    isOutstanding: PropTypes.bool,
    handleSuccess: PropTypes.func,
    handleClickBack: PropTypes.func,
};

export default Payment;
