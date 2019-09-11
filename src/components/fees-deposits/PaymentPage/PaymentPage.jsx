import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Link } from 'react-router-dom';
import { Elements } from  'react-stripe-elements';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'

import padlockImage from 'assets/images/connect-bank/padlock.png';
import creditCardImage from 'assets/images/credit-card.png';
import { H1, H3, LinkButton, blackLinkRoot, arrowIcon } from 'assets/styles';
import PaymentForm from './PaymentForm';
import { formatCurrency } from 'utils/misc';

const SpacedH3 = styled(H3)`
    margin: 15px 10% 30px 10%;
`

const bodyRow = css`
    display: flex;
    color: #828796;
    font-size: 12px;
    margin: 30px 30px 0 30px;
    font-weight: 300;
    align-items: center;
`

const bodyText = css`
    margin-left: 15px;
    text-align: left;
`

const linkStyle = css`
    color: #828796;
    font-weight: 300;
`

export const PaymentPage = ({applicant, totalPayment, payments, handleSuccess, handleClickBack}) =>  {
    return (
        <Fragment>
            <H1>Almost There, {applicant.client.person.first_name}!</H1>
            <SpacedH3>The application fee and holding deposit for this apartment is {totalPayment ? formatCurrency(totalPayment) : '$0'}. After payment, we’ll collect your SSN for screening.</SpacedH3>
            <img src={creditCardImage} alt="credit card"></img>
            <div className={bodyRow}>
                <img src={padlockImage} alt="padlock" width="18" height="28"/>
                <div className={bodyText}>
                    {/* TODO: design owes us updated copy on this... at the very least, the link should go somewhere */}
                    This app will never make any transaction on your behalf. We guard your data and you can read more about our <Link className={linkStyle} to="">privacy policy here.</Link>
                </div>
            </div>
            <Elements
                /* elements requires direct import of fonts */
                fonts={[{
                    cssSrc: 'https://use.typekit.net/asb6wyn.css'
                }]}
            >
                <PaymentForm
                    onSuccess={handleSuccess}
                    totalPayment={totalPayment}
                    payments={payments}
                />
            </Elements> 
            <LinkButton className={blackLinkRoot} onClick={handleClickBack}>
                <ArrowBackIos classes={{root: arrowIcon}}/> Go Back
            </LinkButton>
        </Fragment>
    );
}

export default PaymentPage;


