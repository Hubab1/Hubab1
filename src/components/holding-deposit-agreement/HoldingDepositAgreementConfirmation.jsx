import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import { H1, SpacedH3, Spacer } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

import contract from 'assets/images/contract.svg';
import {css} from "emotion";

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
            <div id="application-unit" className={applicationUnit}>{buildingName}{unitNumber}</div>
            <Spacer height={40}/>
            <ActionButton onClick={() => handleContinue()} marginTop={30} marginBottom={20}>Continue</ActionButton>
            <ActionButton onClick={() => viewDocument()} variant="outlined" marginBottom={20}>
                Review Holding Deposit Agreement
            </ActionButton>
        </Fragment>
    )
};

export default HoldingDepositAgreementConfirmation;
