import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import API from 'app/api';
import { Link } from 'react-router-dom';
import { ROUTES } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, P, Card, CardSection, CardRow, Bold } from 'assets/styles';

export const Subtitle = styled.small`
    color: #818797;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
`;

const Header = styled.div`
    border-bottom: 1px solid #eeeeee;
    padding: 20px;
`;

const CreditScore = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 22px;
    border: 1px solid;
    font-weight: bold;
    color: #828796;
    color: ${(props) => props.color || '#828796'};
    border-color: ${(props) => props.color || '#828796'};
    margin-left: 1px;
    margin-right: 9px;
`;

const CreditScoreDetails = styled.div`
    padding-top: 3px;
`;

const Decision = styled.div`
    margin-top: 13px;
    white-space: pre-line;
    text-align: left;
    overflow-wrap: normal;
`;

const AdverseActionsFactors = styled.ul`
    padding-left: 16px;
    margin-top: 5px;
    margin-bottom: 0;
    li {
        font-size: 16px;
        letter-spacing: 0;
        line-height: 20px;
        margin-bottom: 12px;
    }
    li:last-child {
        margin-bottom: 0;
    }
`;

const IndentedRow = styled(CardRow)`
    justify-content: initial;
`;

export function AppAdverseActions(props) {
    const { configuration, profile } = props;
    const [adverseFactors, setAdverseFactors] = useState([]);
    const [requestDate, setRequestDate] = useState(null);
    const [creditScore, setCreditScore] = useState('N/A');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        API.getAdverseActions()
            .then((res) => {
                if (res.adverse_factors) setAdverseFactors(res.adverse_factors);
                if (res.request_date) {
                    const formattedDate = new Date(res.request_date);
                    setRequestDate(
                        formattedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
                    );
                }
                if (res.credit_score) setCreditScore(res.credit_score);
                setIsReady(true);
            })
            .catch(() => {
                setIsReady(true);
            });
    }, []);

    const getButtonText = () => {
        if (isReady) return 'OK';
        return 'Loading...';
    };

    const formatAdverseActionDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const getCreditScoreColor = (score) => {
        const ratingConfig = configuration.credit_score_rating_config;

        if (!ratingConfig || !ratingConfig.length || !score || isNaN(score)) return '#828796';

        let index = 0;

        for (let i = ratingConfig.length - 1; i >= 0; i--) {
            if (score >= ratingConfig[i][0]) break;
            index++;
        }

        switch (index) {
            case 0:
                return '#60C28D';
            case 1:
                return '#FCC022';
            default:
                return '#D0021B';
        }
    };

    const guarantor_income_requirement_multiplier = configuration.guarantor_income_requirement_multiplier;

    const displayGenericMessage =
        !props.securityDeposit && !props.guarantorRequested && !profile?.applicant_matches_dnr_list;

    const companyName = configuration.community.company.name;

    return (
        <div>
            <Header>
                <H1>Reason for Our Decision</H1>
                <br />
                <Subtitle>Adverse action notice</Subtitle>
            </Header>
            {isReady && (
                <Decision>
                    <P color="#818797">{formatAdverseActionDate(props.date)}</P>
                    <br />
                    <P>Dear {props.name},</P>
                    <br />
                    <P>
                        Thank you for your recent rental application for {props.buildingName}
                        {props.buildingName && props.unitNumber && <>,</>}
                        {props.unitNumber}.
                    </P>
                    <br />
                    {props.securityDeposit && !props.guarantorRequested && (
                        <>
                            {props.hasInternationalApplicant ? (
                                <P>
                                    Unfortunately, {companyName} is unable to approve your rental application under our
                                    standard terms and conditions because there is an international applicant.
                                </P>
                            ) : (
                                <P>
                                    Unfortunately, {companyName} is unable to approve your rental application under our
                                    standard terms and conditions because there is a guarantor that lives out-of-state.
                                </P>
                            )}
                            <br />
                            <P>
                                We can, however, approve your rental application if you agree to pay a security deposit
                                in the amount of {props.securityDeposit} prior to move-in.
                            </P>
                        </>
                    )}

                    {props.guarantorRequested && (
                        <>
                            <P>
                                Unfortunately, {companyName} is unable to approve your rental application under our
                                standard terms and conditions because you do not meet the required household income.
                            </P>
                            <br />
                            <P>
                                {`We can, however, reevaluate your rental application if you add a guarantor. Guarantors are required to make ${guarantor_income_requirement_multiplier}x the monthly rent.`}
                            </P>
                        </>
                    )}

                    {profile?.applicant_matches_dnr_list && (
                        <P>
                            Unfortunately, {companyName} is unable to approve your rental application for{' '}
                            {configuration.community.building_name} because of one or more applicant&apos;s prior rental
                            history with {companyName}.
                        </P>
                    )}

                    {displayGenericMessage && (
                        <P>Unfortunately, {companyName} is unable to approve your rental application.</P>
                    )}

                    <br />
                    {adverseFactors && adverseFactors.length > 0 && (
                        <Card>
                            <CardSection>
                                <CardRow>
                                    <P>Factors affecting our decision:</P>
                                </CardRow>
                                <CardRow>
                                    <AdverseActionsFactors>
                                        {adverseFactors.map((factor) => (
                                            <li key={factor}>{factor}</li>
                                        ))}
                                    </AdverseActionsFactors>
                                </CardRow>
                            </CardSection>
                        </Card>
                    )}
                    {requestDate && (
                        <Card>
                            <CardSection>
                                <IndentedRow>
                                    <CreditScore color={getCreditScoreColor(creditScore)}>{creditScore}</CreditScore>
                                    <CreditScoreDetails>
                                        <P>Your credit score as of {requestDate}</P>
                                        <P color="#818797" fontSize={14}>
                                            This score has a range of 350 to 850
                                        </P>
                                    </CreditScoreDetails>
                                </IndentedRow>
                            </CardSection>
                        </Card>
                    )}
                    <P>
                        This adverse action notice is in accordance with the requirements of the FCRA 15 U.S.C. Sec.
                        1681m (a) and clearly defines your rights as a consumer under the federal Fair Credit Reporting
                        Act. This notice is further in accord with California Investigative Consumer Reporting Agencies
                        Act (Calif. Civil Code 1786.10 et seq.)(“ICRAA”).
                    </P>
                    <br />
                    <P>
                        In evaluating your application, <Bold fontWeight={600}>TransUnion Consumer Solutions</Bold>{' '}
                        provided information that in whole or in part influenced {companyName}&apos;s decision.{' '}
                        <Bold fontWeight={600}>
                            The reporting agency played no part in our decision other than providing {companyName} with
                            information about you.
                        </Bold>
                    </P>
                    <br />
                    <P>
                        Under the Fair Credit Reporting Act and ICRAA, you have the right to know the information
                        provided to us, which can be obtained by contacting:
                    </P>
                    <br />
                    <P>
                        <Bold fontWeight={600}>TransUnion Consumer Solutions</Bold>
                        <br />
                        P.O. Box 2000
                        <br />
                        Chester, PA. 19022-2000
                        <br />
                        <a href="tel:1-800-916-8800">1-800-916-8800</a>
                    </P>
                    <br />
                    <P>
                        Background Data Solutions
                        <br />
                        <a href="tel:1-800-568-5665">1-800-568-5665</a>
                        <br />
                    </P>
                    <br />
                    <P>
                        You have the right to a free copy of your report from the reporting agency, if you request it no
                        later than 60 days after you receive this notice.
                    </P>
                    <br />
                    <P>
                        In addition, if you find that any information contained in the TransUnion report you receive is
                        inaccurate or incomplete, you have the right to dispute the matter with Funnel or through the
                        reporting agency:
                    </P>
                    <br />
                    <P>
                        TransUnion Rental Screening Solutions
                        <br />
                        Attn: Consumer Dispute Team
                        <br />
                        Box 800
                        <br />
                        Woodlyn, PA 19094
                        <br />
                        <a href="tel:1-800-230-9376">1-800-230-9376</a>
                        <br />
                        <a href="mailto:TURSSDispute@transunion.com">TURSSDispute@transunion.com</a>
                        <br />
                        <a
                            href="https://www.transunion.com/client-support/rental-screening-disputes"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://www.transunion.com/client-support/rental-screening-disputes
                        </a>
                    </P>
                    <br />
                    <P>
                        Funnel Leasing
                        <br />
                        Attn: Consumer Inquiries <br />
                        150 W. 22nd St. - 8th Fl.
                        <br />
                        New York, NY 10011
                        <br />
                        (833) 979-3074
                        <br />
                        <a href="mailto:consumer@funnelleasing.com">consumer@funnelleasing.com</a>
                    </P>
                    <br />
                    <P>
                        For more information on your rights under the Fair Credit Reporting Act,
                        please visit our <Link to={ROUTES.FAQ}>Consumer Rights and FAQ</Link>.
                    </P>
                </Decision>
            )}
            <ActionButton disabled={!isReady} marginTop={39} onClick={props.onAgree}>
                {getButtonText()}
            </ActionButton>
        </div>
    );
}
AppAdverseActions.propTypes = {
    date: PropTypes.string,
    buildingName: PropTypes.string,
    unitNumber: PropTypes.string,
    name: PropTypes.string,
    securityDeposit: PropTypes.string,
    onAgree: PropTypes.func.isRequired,
    configuration: PropTypes.object,
    guarantorRequested: PropTypes.bool,
    hasInternationalApplicant: PropTypes.bool,
    profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
    configuration: state.configuration,
    profile: state.renterProfile,
});

export default connect(mapStateToProps)(AppAdverseActions);
