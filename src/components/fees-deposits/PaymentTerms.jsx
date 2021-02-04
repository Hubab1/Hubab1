import React, { Fragment, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import moment from 'moment';

import API from 'app/api';
import { ROUTES, TOS_TYPE_PAYMENTS } from 'app/constants';
import captureRoute from 'app/captureRoute';
import { prettyCurrency } from 'utils/misc';
import ActionButton from 'components/common/ActionButton/ActionButton';
import GenericFormMessage from 'components/common/GenericFormMessage';
import { Card, H1, LinkButton, ScrollableTermsCardSection, blackLinkRoot, arrowIcon } from 'assets/styles';

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
}) => {
    const [html, setHtml] = useState(undefined);
    const [errors, setErrors] = useState(null);
    const moveInDate = moment(leaseStartDate).format('LL');
    const holdingDepositDisplayedAmount = prettyCurrency(holdingDepositAmount);

    useEffect(() => {
        (async () => {
            try {
                const html = await API.fetchHoldingDepositTerms(canProceedToPayment);
                setHtml(html);
            } catch (e) {
                setErrors([
                    "Oops! we're having troubles finding your Payment and Holiding Deposit Terms. Try again in a bit.",
                ]);
            }
        })();
    }, [canProceedToPayment]);

    const handleContinueClick = useCallback(() => {
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
    }, [moveInDate, holdingDepositDisplayedAmount, communityName, unitNumber, goToPayment]);

    return (
        <Fragment>
            <SpacedH1>Payment and Holding Deposit Terms</SpacedH1>
            {errors && <GenericFormMessage type="error" messages={errors} />}
            {html && (
                <Card>
                    <ScrollableTermsCardSection>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: html,
                            }}
                        />
                    </ScrollableTermsCardSection>
                </Card>
            )}
            {!!handleClickBack && (
                <Fragment>
                    {canProceedToPayment ? (
                        <>
                            <ActionButton
                                disabled={errors}
                                onClick={handleContinueClick}
                                marginTop={25}
                                marginBottom={20}
                            >
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
