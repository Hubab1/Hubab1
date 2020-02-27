import styled from '@emotion/styled';
import Grid from '@material-ui/core/Grid';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import approvedSign from 'assets/images/approvedSign.svg';
import { H1, leftText, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import lightbulb from 'assets/images/lightbulb.png';
import { prettyCurrency } from 'utils/misc';

export const ApprovedImage = styled.img`
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

export const BulbImage = styled.img`
  width: 46px;
  height: 42px;
`;

export const securityDepositHelpText = css`
  color: #454B57;
  font-size: 14px;
  line-height: 17px;
  text-align: left;
`;

export const gridContainer = css`
    padding-top: 35px;
    min-height: 100px;
`;

export const AppApproved = ({profile, configuration}) => {
    if (!profile || ! configuration) return null;

    const {
        unit,
        security_deposit: securityDeposit,
        security_deposit_multiplier: securityDepositMultiplier,
    } = profile;
    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = (!!unit && !!unit.unit_number) ? ` Unit ${unit.unit_number}` : '';

    return (
        <Fragment>
            <H1>You've Been Approved!</H1>
            <SpacedH3>All that's left to do is sign the lease.</SpacedH3>
            <ApprovedImage src={approvedSign}/>
            <div id="application-unit" className={applicationUnit}>{buildingName}{unitNumber}</div>
            <div className={gridContainer}>
                {securityDeposit &&
                <Grid container justify={'center'} className="security-deposit-container">
                    <Grid item xs={2}>
                        <BulbImage alt="light bulb" src={lightbulb} />
                    </Grid>
                    <Grid item xs={9} classes={{ root: leftText }}>
                        <span className={securityDepositHelpText}>
                            You've been approved under the condition that you agree to
                            a {prettyCurrency(securityDeposit)} security deposit
                            ({securityDepositMultiplier}x the rent).
                        </span>
                    </Grid>
                </Grid>}
                <ActionButton marginTop={securityDeposit ? 30 : 90}>
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
