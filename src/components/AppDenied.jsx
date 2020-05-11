import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import { H1, SpacedH3 } from 'assets/styles';
import cry from 'assets/images/cry.svg';
import ActionButton from 'components/common/ActionButton/ActionButton';
import clsx from 'clsx';
import DenialReason from 'components/AppDenialReason';
import API from 'app/api';

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

export class AppDenied extends React.Component {
    state = {
        viewDenialReason: false,
    };

    toggleViewDenialDecision = () => {
        this.setState({viewDenialReason: !this.state.viewDenialReason});
    };

    getDenialDecisionDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US');
    }

    render () {
        const { profile, configuration, applicant } = this.props;
        if (!profile || !configuration || !applicant) return null;

        const { viewDenialReason } = this.state;
        const {
            unit,
            last_status_change,
        } = profile;

        const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
        const unitNumber = (!!unit && !!unit.unit_number) ? ` Unit ${unit.unit_number}` : '';
        const denialDecisionDate = this.getDenialDecisionDate(last_status_change.created_at);
        const { name } = applicant.client.person;

        return (
            <>
                <div className={clsx({'hide-element': viewDenialReason})}>
                    <H1>Application Denied</H1>
                    <SpacedH3>Unfortunately, we were unable to approve your application.</SpacedH3>
                    <Img src={cry}/>
                    <div id="application-unit" className={applicationUnit}>{buildingName}{unitNumber}</div>
                    <ActionButton
                        marginTop={150}
                        onClick={this.toggleViewDenialDecision}
                    >Learn Why</ActionButton>
                </div>
                {viewDenialReason &&
                    <DenialReason
                        date={denialDecisionDate}
                        buildingName={buildingName}
                        unitNumber={unitNumber}
                        name={name}
                        onAgree={this.toggleViewDenialDecision}
                    />
                }
            </>
        )
    }
}
AppDenied.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    applicant: PropTypes.object,
};
const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    applicant: state.applicant,
});
export default connect(mapStateToProps)(withRelativeRoutes(AppDenied, ROUTES.APP_DENIED));
