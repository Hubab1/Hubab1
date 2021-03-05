import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from 'emotion';
import clsx from 'clsx';

import { ACTION_BUTTON, AdverseActionNoticeButton } from 'components//AdverseActionNoticeButton/AdverseActionNoticeButton';
import { H1, SpacedH3 } from 'assets/styles';
import cry from 'assets/images/cry.svg';

export const Img = styled.img`
    padding-top: 10px;
    height: 200px;
`;

export const applicationUnit = css`
    color: #454b57;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    padding-top: 10px;
`;

export const ApplicationDeniedPage = (props) => {
    const { profile, configuration, applicant } = props;
    if (!profile || !configuration || !applicant) return null;

    const { unit } = profile;

    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = !!unit && !!unit.unit_number ? ` Unit ${unit.unit_number}` : '';

    return (
        <div className={clsx({ 'hide-element': false })}>
            <H1>Application Denied</H1>
            <SpacedH3>Unfortunately, we were unable to approve your application.</SpacedH3>
            <Img src={cry} />
            <div id="application-unit" className={applicationUnit}>
                {buildingName}
                {unitNumber}
            </div>
            <AdverseActionNoticeButton componentType={ACTION_BUTTON} marginTop={50} />
        </div>
    );
};

ApplicationDeniedPage.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    applicant: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    applicant: state.applicant,
});

export default connect(mapStateToProps)(ApplicationDeniedPage);
