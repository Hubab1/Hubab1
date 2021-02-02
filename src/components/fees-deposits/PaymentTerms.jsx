import React, { Fragment, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import PropTypes from 'prop-types';
import { ROUTES, TOS_TYPE_PAYMENTS } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { Card, H1, LinkButton, ScrollableTermsCardSection, blackLinkRoot, arrowIcon } from 'assets/styles';
import captureRoute from 'app/captureRoute';
import { prettyCurrency } from 'utils/misc';
import moment from 'moment';
import API from 'app/api';
import auth from 'utils/auth';

const SpacedH1 = styled(H1)`
    margin: 15px 10% 15px 10%;
`;

export const CHUCK_BASE_URL = process.env.REACT_APP_CHUCK_DOMAIN;

export const PaymentTerms = ({
    handleClickBack,
    goToPayment,
    holdingDepositAmount = 0,
    unitNumber,
    communityName,
    leaseStartDate,
    canProceedToPayment,
}) => {
    const [html, setHtml] = useState(<div>HTML</div>);
    const moveInDate = moment(leaseStartDate).format('LL');
    const holdingDepositDisplayedAmount = prettyCurrency(holdingDepositAmount);

    const fetchHoldingDepositTerms = async () => {
        try {
            const apiUrl = `${CHUCK_BASE_URL}/api/onlineleasing/holding_deposit_terms?can_proceed_to_payment=${
                canProceedToPayment ? 1 : 0
            }`;
            const headers = {
                Authorization: `Token ${auth.getToken()}`,
            };
            console.log({ apiUrl, headers });

            const res2 = await fetch(apiUrl, {
                method: 'GET',
                headers,
            });

            console.log({ res2 });

            debugger;

            const res = await API.fetchHoldingDepositTerms(canProceedToPayment);
            console.log('res: ', res);
            // .then((res) => {
            //     return res.text();
            // })
            // .then((res) => {
            //     setHtml(res);
            // });
        } catch (e) {
            console.log('E: ', e);
        }
    };

    // useEffect(() => {
    //     (async () => {
    //
    //     })();
    // }, [canProceedToPayment]);

    if (!html) return null;

    const handleContinueClick = () => {
        const data = {
            type: TOS_TYPE_PAYMENTS,
            context: {
                time: Date.now(),
                move_in_date: moveInDate,
                holding_deposit: holdingDepositDisplayedAmount,
                community_name: communityName,
                unit_number: unitNumber,
            },
        };

        goToPayment(data);
    };

    return (
        <Fragment>
            <SpacedH1>Payment and Holding Deposit Terms</SpacedH1>
            <button onClick={() => fetchHoldingDepositTerms()}>Fetch data</button>
            <Card>
                <ScrollableTermsCardSection>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: html,
                        }}
                    />
                </ScrollableTermsCardSection>
            </Card>
            {!!handleClickBack && (
                <Fragment>
                    {canProceedToPayment ? (
                        <>
                            <ActionButton onClick={handleContinueClick} marginTop={25} marginBottom={20}>
                                Agree and Continue
                            </ActionButton>
                            <LinkButton className={blackLinkRoot} onClick={handleClickBack}>
                                <ArrowBackIos classes={{ root: arrowIcon }} /> Go Back
                            </LinkButton>
                        </>
                    ) : (
                        <ActionButton onClick={handleClickBack} marginTop={25} marginBottom={20}>
                            Go Back
                        </ActionButton>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

PaymentTerms.propTypes = {
    handleClickBack: PropTypes.func.isRequired,
    goToPayment: PropTypes.func,
    holdingDepositAmount: PropTypes.number.isRequired,
    unitNumber: PropTypes.string.isRequired,
    communityName: PropTypes.string.isRequired,
    leaseStartDate: PropTypes.string.isRequired,
    canProceedToPayment: PropTypes.bool.isRequired,
};

export default captureRoute(PaymentTerms, ROUTES.PAYMENT_TERMS);
