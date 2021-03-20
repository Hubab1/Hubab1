import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import { ROUTES } from 'constants/constants';
import captureRoute from 'utils/captureRoute';
import { prettyFormatPhoneNumber } from 'utils/misc';
import { H1, SpacedH3, P } from 'assets/styles';
import cancelled from 'assets/images/cancelled.png';

export const Img = styled.img`
    padding-top: 10px;
    height: 200px;
`;

export const ApplicationCancelledPage = ({ profile, configuration }) => {
    if (!profile || !configuration) return null;

    return (
        <>
            <H1>Application Cancelled</H1>
            {profile.unit ? (
                <SpacedH3>You are no longer applying for unit {profile.unit.unit_number}.</SpacedH3>
            ) : (
                <SpacedH3>Your application at {configuration.community.building_name} have been cancelled.</SpacedH3>
            )}

            <Img src={cancelled} />
            <P margin="90px 0 0 0" bold>
                Call us at{' '}
                <a href={`tel:${configuration.community.contact_phone}`}>
                    {prettyFormatPhoneNumber(configuration.community.contact_phone)}
                </a>
                &nbsp;if you have any questions or if you’d like to start a new application.
            </P>
        </>
    );
};

ApplicationCancelledPage.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(captureRoute(ApplicationCancelledPage, ROUTES.APP_CANCELLED));
