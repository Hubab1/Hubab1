import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import moment from 'moment';

import API from 'api/api';
import { TOS_TYPE_PAYMENTS } from 'constants/constants';
import { prettyCurrency } from 'utils/misc';

import ActionButton from 'components/ActionButton/ActionButton';
import GenericFormMessage from 'components/GenericFormMessage/GenericFormMessage';
import { Card, H1, LinkButton, ScrollableTermsCardSection, blackLinkRoot, arrowIcon } from 'assets/styles';

const SpacedH1 = styled(H1)`
    margin: 15px 10% 15px 10%;
`;

export const PaymentTerms = ({
    handleClickBack,
    handleTermsAccepted,
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

        handleTermsAccepted(data);
    }, [moveInDate, holdingDepositDisplayedAmount, communityName, unitNumber, handleTermsAccepted]);

    return (
        <>
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
            <>
                {canProceedToPayment ? (
                    <>
                        <ActionButton disabled={errors} onClick={handleContinueClick} marginTop={25} marginBottom={20}>
                            Agree and Continue
                        </ActionButton>
                        {!!handleClickBack && (
                            <LinkButton className={blackLinkRoot} onClick={handleClickBack}>
                                <ArrowBackIos classes={{ root: arrowIcon }} /> Go Back
                            </LinkButton>
                        )}
                    </>
                ) : (
                    !!handleClickBack && (
                        <ActionButton onClick={handleClickBack} marginTop={25} marginBottom={20}>
                            Go Back
                        </ActionButton>
                    )
                )}
            </>
        </>
    );
};

PaymentTerms.propTypes = {
    handleClickBack: PropTypes.func.isRequired,
    handleTermsAccepted: PropTypes.func,
    holdingDepositAmount: PropTypes.number.isRequired,
    unitNumber: PropTypes.string.isRequired,
    communityName: PropTypes.string.isRequired,
    leaseStartDate: PropTypes.string.isRequired,
    canProceedToPayment: PropTypes.bool.isRequired,
};

export default PaymentTerms;
