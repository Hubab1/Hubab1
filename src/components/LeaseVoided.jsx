import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import { H1, SpacedH3, P } from 'assets/styles';
import leaseVoided from 'assets/images/leaseVoided.png';
import { prettyFormatPhoneNumber } from 'utils/misc';

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

export const LeaseVoided = ({profile, configuration}) => {
    if (!profile || ! configuration) return null;

    const {
        unit,
    } = profile;
    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = (!!unit && !!unit.unit_number) ? ` Unit ${unit.unit_number}` : '';

    return (
        <>
            <H1>We&apos;re Revising Your Lease</H1>
            <SpacedH3>We voided your lease because we&apos;re making some corrections. Don&apos;t worry, we&apos;ll have the new lease ready soon!</SpacedH3>
            <Img src={leaseVoided}/>
            <div id="application-unit" className={applicationUnit}>{buildingName}{unitNumber}</div>
            <P margin="90px 0 0 0" bold>Call us at <a href={`tel:${configuration.community.contact_phone}`}>{prettyFormatPhoneNumber(configuration.community.contact_phone)}</a>
                &nbsp;if you have any questions.
            </P>
        </>
    )
};

LeaseVoided.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
};


const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(withRelativeRoutes(LeaseVoided, ROUTES.LEASE_VOIDED));
