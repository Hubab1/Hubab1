import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import { H1, SpacedH3, P } from 'assets/styles';
import tooslow from 'assets/images/tooslow.png';
import { prettyFormatPhoneNumber } from 'utils/misc';
import captureRoute from 'app/captureRoute';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';

export const Img = styled.img`
    padding-top: 10px;
    margin-bottom: 76px;
`;

export const UnitUnavailable = ({ configuration, profile }) => {
    if (!configuration && !profile) {
        return null;
    }

    const unit = configuration?.unit || profile?.unit;
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

UnitUnavailable.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(captureRoute(UnitUnavailable, ROUTES.UNIT_UNAVAILABLE));
