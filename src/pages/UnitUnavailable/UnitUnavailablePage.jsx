import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'constants/constants';
import { prettyFormatPhoneNumber } from 'utils/misc';
import captureRoute from 'utils/captureRoute';

import UnauthenticatedPage from 'common-components/Pages/UnauthenticatedPage/UnauthenticatedPage';
import { H1, SpacedH3, P } from 'assets/styles';
import tooslow from 'assets/images/tooslow.png';

export const Img = styled.img`
    padding-top: 10px;
    margin-bottom: 76px;
`;

export const UnitUnavailablePage = ({ configuration, profile }) => {
    if (!configuration) {
        return null;
    }
    const unit = configuration?.unit || profile?.unit;
    if (!unit) {
        return null;
    }
    const Wrapper = profile ? React.Fragment : UnauthenticatedPage;

    return (
        <Wrapper>
            <H1>Someone Beat You To It!</H1>
            <SpacedH3>Sorry, unit {unit.unit_number} is no longer available.</SpacedH3>
            <Img src={tooslow} />
            <div className="align-left">
                <P>{`Looks like someone else swiped this unit off the market. Don't worry though, we can help you find a similar one!`}</P>
                <br />
                <P bold>
                    Call us at{' '}
                    <a href={`tel:${configuration.community.contact_phone}`}>
                        {prettyFormatPhoneNumber(configuration.community.contact_phone)}
                    </a>
                    &nbsp;so we can discuss other options.
                </P>
            </div>
        </Wrapper>
    );
};

UnitUnavailablePage.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(captureRoute(UnitUnavailablePage, ROUTES.UNIT_UNAVAILABLE));
