import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import { H1, SpacedH3, P } from 'assets/styles';
import tooslow from 'assets/images/tooslow.png';
import { prettyFormatPhoneNumber } from 'utils/misc';

export const Img = styled.img`
    padding-top: 10px;
    margin-bottom: 76px;
`;

export const applicationUnit = css`
  color: #454B57;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  padding-top: 10px;
`;

export const UnitUnavailable = ({profile, configuration}) => {
    if (!profile || ! configuration) return null;

    return (
        <>
            <H1>Someone Beat You To It!</H1>
            <SpacedH3>Sorry, unit {profile.unit.unit_number} is no longer available.</SpacedH3>
            <Img src={tooslow}/>
            <div className="align-left">
                <P>Looks like someone else swiped this unit off the market. Don't worry though, we can help you find a similar one!</P>
                <br/>
                <P bold>Call us at <a href={`tel:${configuration.community.contact_phone}`}>{prettyFormatPhoneNumber(configuration.community.contact_phone)}</a>
                    &nbsp;so we can discuss other options.
                </P>
            </div>
        </>
    )
};

UnitUnavailable.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
};


const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(withRelativeRoutes(UnitUnavailable, ROUTES.UNIT_UNAVAILABLE));
