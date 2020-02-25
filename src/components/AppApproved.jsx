import styled from '@emotion/styled';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import approvedSign from 'assets/images/approvedSign.svg';
import { H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

export const ApprovedImage = styled.img`
    padding-top: 20px;
    height: 200px;
`;

export const applicationUnit = css`
  color: #454B57;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  padding-top: 10px;
`;

export const gridContainer = css`
    padding: 20px 0 20px 0;
`;

export const AppApproved = ({profile, configuration}) => {
    if (!profile || ! configuration) return null;

    const { unit } = profile;
    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = (!!unit && !!unit.unit_number) ? ` Unit ${unit.unit_number}` : '';

    return (
        <Fragment>
            <H1>You've Been Approved!</H1>
            <SpacedH3>All that's left to do is sign the lease.</SpacedH3>
            <ApprovedImage src={approvedSign}/>
            <div id="application-unit" className={applicationUnit}>{buildingName}{unitNumber}</div>
            <div className={gridContainer}>
                <ActionButton marginTop={80} marginBottom={20}>
                    Review &amp; Sign Lease
                </ActionButton>
            </div>
        </Fragment>
    )
};

AppApproved.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
};


const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps, null)(withRelativeRoutes(AppApproved, ROUTES.APP_APPROVED));
