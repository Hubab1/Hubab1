import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import { H1, SpacedH3, P } from 'assets/styles';
import cancelled from 'assets/images/cancelled.png';
import { prettyFormatPhoneNumber } from 'utils/misc';
import captureRoute from 'app/captureRoute';

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

export const AppCancelled = ({profile, configuration}) => {
    if (!profile || ! configuration) return null;

    return (
        <>
            <H1>Application Cancelled</H1>
            <SpacedH3>You are no longer applying for unit {profile.unit.unit_number}.</SpacedH3>
            <Img src={cancelled}/>
            <P margin="90px 0 0 0" bold>Call us at <a href={`tel:${configuration.community.contact_phone}`}>{prettyFormatPhoneNumber(configuration.community.contact_phone)}</a>
                &nbsp;if you have any questions or if you’d like to start a new application.
            </P>
        </>
    )
};

AppCancelled.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
};


const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(captureRoute(AppCancelled, ROUTES.APP_CANCELLED));
