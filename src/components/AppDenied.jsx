import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import { H1, SpacedH3, P } from 'assets/styles';
import cry from 'assets/images/cry.svg';
import { prettyFormatPhoneNumber } from 'utils/misc';

export const Img = styled.img`
    padding-top: 10px;
    height: 200px;
`;

export const applicationUnit = css`
  color: #454B57;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  padding-top: 10px;
`;

export const AppDenied = ({profile, configuration}) => {
    if (!profile || ! configuration) return null;

    const {
        unit,
    } = profile;
    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = (!!unit && !!unit.unit_number) ? ` Unit ${unit.unit_number}` : '';

    return (
        <>
            <H1>Application Denied</H1>
            <SpacedH3>Unfortunately, we were unable to approve your application.</SpacedH3>
            <Img src={cry}/>
            <div id="application-unit" className={applicationUnit}>{buildingName}{unitNumber}</div>
            <P margin="90px 0 0 0" bold>You should have received an email explaining our decision.
                &nbsp;Please call us at {prettyFormatPhoneNumber(configuration.community.contact_phone)}
                &nbsp;if you have not received it or have any questions.
            </P>
        </>
    )
};

AppDenied.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
};


const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(withRelativeRoutes(AppDenied, ROUTES.APP_DENIED));
