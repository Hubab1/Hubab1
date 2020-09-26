import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { H1, SpacedH3, Spacer } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';


import contract from 'assets/images/contract.svg';
import {css} from 'emotion';

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

export const HoldingDepositAgreementView = ({profile, configuration, handleContinue, handleClickBack}) => {
    if (!profile) return null;

    const {
        unit,
    } = profile;
    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = (!!unit && !!unit.unit_number) ? ` Unit ${unit.unit_number}` : '';

    return (
        <Fragment>
            <H1>Holding Deposit Agreement</H1>
            <SpacedH3>You&apos;ll have to agree to some terms to move forward with the application process.</SpacedH3>
            <Img src={contract}/>
            <div className={applicationUnit}>{buildingName}{unitNumber}</div>
            <Spacer height={40}/>
            <ActionButton onClick={handleContinue} marginTop={30} marginBottom={20}>View and Sign Agreement</ActionButton>
            <BackLink to={handleClickBack}/>
        </Fragment>
    );
};

HoldingDepositAgreementView.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    handleContinue: PropTypes.func,
    handleClickBack: PropTypes.string,
};

export default HoldingDepositAgreementView;
