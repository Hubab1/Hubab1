import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from 'emotion';
import clsx from 'clsx';

import { ROUTES, ROLE_PRIMARY_APPLICANT } from 'constants/constants';
import { prettyFormatPhoneNumber } from 'utils/misc';
import captureRoute from 'utils/captureRoute';

import {
    ACTION_BUTTON,
    LINK_BUTTON,
    AdverseActionNoticeButton,
} from 'common-components/AdverseActionNoticeButton/AdverseActionNoticeButton';
import ActionButton from 'common-components/ActionButton/ActionButton';
import GuarantorExplanation from 'pages/GuarantorRequested/components/GuarantorExplanation';
import { H1, SpacedH3, LinkButton } from 'assets/styles';
import addGuarantor from 'assets/images/add-guarantor.png';

export const requestGuarantorHelpText = css`
    color: #454b57;
    font-size: 14px;
    line-height: 17px;
    text-align: left;
    margin-top: 24px;
`;

export const Img = styled.img`
    padding-top: 10px;
    height: 200px;
`;

export const explanationLink = css`
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    padding-top: 10px;
`;

const Contact = styled.div`
    text-align: left;
    font-weight: 600;
    font-size: 16px;
`;

const DescriptionMessage = styled.div`
    margin-top: 103px;
    margin-bottom: 36px;
    text-align: left;
`;

export class GuarantorRequestedPage extends React.Component {
    state = {
        viewRequestReason: false,
        viewGuarantorExplanation: false,
        error: false,
    };

    toggleViewRequestReason = () => {
        this.setState({
            viewRequestReason: !this.state.viewRequestReason,
        });
    };

    toggleViewGuarantorExplanation = () => {
        this.setState({
            viewGuarantorExplanation: !this.state.viewGuarantorExplanation,
        });
    };

    addGuarantor = () => {
        this.props.history.push(ROUTES.GUARANTOR);
    };

    render() {
        const { profile, configuration, applicant, isPrimaryApplicant } = this.props;
        if (!profile || !configuration || !applicant) return null;

        const { viewRequestReason, viewGuarantorExplanation } = this.state;

        const contactPhone = configuration.community.contact_phone;
        const guarantor_income_requirement_multiplier = configuration.guarantor_income_requirement_multiplier;
        const primaryApplicantFullName = `${profile.primary_applicant.first_name} ${profile.primary_applicant.last_name}`;

        return (
            <>
                <div className={clsx({ 'hide-element': viewRequestReason || viewGuarantorExplanation })}>
                    <H1>Please Add a Guarantor</H1>
                    <SpacedH3>
                        {`We're requiring that you add a guarantor in order to move forward with your application.`}
                    </SpacedH3>
                    <Img src={addGuarantor} />
                    <div id="application-unit" className={explanationLink}>
                        <LinkButton onClick={this.toggleViewGuarantorExplanation}>{`What's a guarantor?`}</LinkButton>
                    </div>
                    <DescriptionMessage>
                        {isPrimaryApplicant ? (
                            <>
                                <span className={requestGuarantorHelpText}>
                                    Unfortunately, we will not be able to approve your application without a
                                    guarantor.&nbsp;
                                </span>
                                <AdverseActionNoticeButton componentType={LINK_BUTTON} application={profile} />
                            </>
                        ) : (
                            <span className={requestGuarantorHelpText}>
                                {`Unfortunately, we will not be able to approve your application without a guarantor. If you’d like to add a guarantor, the primary applicant, ${primaryApplicantFullName}, can do so on behalf of everyone by logging into their account.`}
                            </span>
                        )}
                    </DescriptionMessage>
                    <Contact>
                        Call us at&nbsp;
                        <a href={`tel:${contactPhone}`}>{prettyFormatPhoneNumber(contactPhone)}</a> if you have any
                        questions or if you are unable or unwilling to add a guarantor.
                    </Contact>
                    {isPrimaryApplicant ? (
                        <ActionButton onClick={this.addGuarantor} marginTop={65}>
                            Add a Guarantor
                        </ActionButton>
                    ) : (
                        <AdverseActionNoticeButton componentType={ACTION_BUTTON} marginTop={65} application={profile} />
                    )}
                </div>
                {viewGuarantorExplanation && (
                    <GuarantorExplanation
                        onAgree={this.toggleViewGuarantorExplanation}
                        contactPhone={contactPhone}
                        multiplier={guarantor_income_requirement_multiplier}
                    />
                )}
            </>
        );
    }
}

GuarantorRequestedPage.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    applicant: PropTypes.object,
    isPrimaryApplicant: PropTypes.bool,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    applicant: state.applicant,
    isPrimaryApplicant: state.applicant.role === ROLE_PRIMARY_APPLICANT,
});

export default connect(mapStateToProps)(captureRoute(GuarantorRequestedPage, ROUTES.GUARANTOR_REQUESTED));
