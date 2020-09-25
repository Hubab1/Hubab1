import React, {Fragment, useEffect, useState} from 'react';
import styled from '@emotion/styled';

import { H1, SpacedH3, Spacer } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

import contract from 'assets/images/contract.svg';
import {css} from 'emotion';
import API from 'app/api';
import { DOCUMENT_TYPE_HOLDING_DEPOSIT } from 'app/constants';
import GenericFormMessage from 'components/common/GenericFormMessage';

export const Img = styled.img`
    padding-top: 14px;
    height: 157px;
`;

export const applicationUnit = css`
  color: #454B57;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  padding-top: 10px;
`;

export const HoldingDepositAgreementConfirmation = ({profile, configuration, handleContinue, viewDocument}) => {
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retried, setRetried] = useState(false);

    const fetchLeaseDocumentUrl = async ()=>{
        setLoading(true);
        const response = await API.leaseDocumentUrl(DOCUMENT_TYPE_HOLDING_DEPOSIT);
        setUrl(response ? response.url : undefined);
        setError(response.url ? undefined : 'Holding Deposit Agreement is still processing. Please try again later.');
        setLoading(false);
    };

    useEffect(() => {
        fetchLeaseDocumentUrl();
    }, []);

    const onClick = () => {
        if (!url) {
            setRetried(true);
            fetchLeaseDocumentUrl();
        }
    };

    const getButtonText = () => {
        if (loading) {
            return 'Loading...';
        }
        if (url) {
            return 'Review Holding Deposit Agreement';
        }
        return 'Retrieve Holding Deposit Agreement...';
    };

    if (!profile || ! configuration) return null;

    const {
        unit,
    } = profile;
    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = (!!unit && !!unit.unit_number) ? ` Unit ${unit.unit_number}` : '';

    return (
        <Fragment>
            <H1>Thanks for Signing!</H1>
            <SpacedH3>We&apos;ll send you an email with a copy of the signed agreement.</SpacedH3>
            <Img src={contract}/>
            <div className={applicationUnit}>{buildingName}{unitNumber}</div>
            <Spacer height={40}/>
            {retried && !!error && <GenericFormMessage type="error" messages={error}/>}
            <ActionButton onClick={handleContinue} marginTop={30} marginBottom={20}>Continue</ActionButton>
            <ActionButton disabled={loading} onClick={url ? undefined : onClick} href={url} variant="outlined" marginBottom={20}>
                {getButtonText()}
            </ActionButton>
        </Fragment>
    );
};

export default HoldingDepositAgreementConfirmation;
