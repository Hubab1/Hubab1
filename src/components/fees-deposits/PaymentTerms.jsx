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

const SpacedH1 = styled(H1)`
    margin: 15px 10% 15px 10%;
`;

export const PaymentTerms = ({
    handleClickBack,
    goToPayment,
    holdingDepositAmount = 0,
    unitNumber,
    communityName,
    leaseStartDate,
    canProceedToPayment,
    isReagreeing = false,
    reagree,
}) => {
    const [html, setHtml] = useState(null);
    const moveInDate = moment(leaseStartDate).format('LL');
    const holdingDepositDisplayedAmount = prettyCurrency(holdingDepositAmount);

    useEffect(() => {
        API.fetchHoldingDepositTerms(canProceedToPayment)
            .then((res) => {
                return res.text();
            })
            .then((res) => {
                setHtml(res);
            });
    }, [canProceedToPayment]);

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
        if (!isReagreeing) {
            goToPayment(data);
        } else {
            reagree(data);
        }
    };

    return (
        <Fragment>
            <SpacedH1>Payment and Holding Deposit Terms</SpacedH1>
            <Card>
                <ScrollableTermsCardSection>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: html,
                        }}
                    />
                </ScrollableTermsCardSection>
            </Card>
            {!!handleClickBack && !isReagreeing && (
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
            {isReagreeing && (
                <Fragment>
                    <ActionButton onClick={handleContinueClick} marginTop={25} marginBottom={20}>
                        Agree and Continue
                    </ActionButton>
                </Fragment>
            )}
        </Fragment>
    );
};

PaymentTerms.propTypes = {
    handleClickBack: PropTypes.func,
    goToPayment: PropTypes.func,
    holdingDepositAmount: PropTypes.number.isRequired,
    unitNumber: PropTypes.string.isRequired,
    communityName: PropTypes.string.isRequired,
    leaseStartDate: PropTypes.string.isRequired,
    canProceedToPayment: PropTypes.bool.isRequired,
    isReagreeing: PropTypes.bool,
    reagree: PropTypes.func,
};

export default captureRoute(PaymentTerms, ROUTES.PAYMENT_TERMS);
