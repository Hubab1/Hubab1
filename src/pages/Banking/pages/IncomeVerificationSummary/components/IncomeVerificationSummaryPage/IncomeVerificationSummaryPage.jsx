import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ErrorIcon from '@material-ui/icons/Error';

import {
    ROUTES,
    ROLE_GUARANTOR,
    INCOME_TYPE_FINICITY_AUTOMATED,
    ALL_INCOME_OR_ASSET_TYPES,
    FINANCIAL_STREAM_STATUS_INCOMPLETE,
    FINANCIAL_STREAM_ASSET,
    APPLICANT_EVENTS,
    MILESTONE_APPLICANT_SUBMITTED,
    MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED,
} from 'constants/constants';
import { prettyCurrency } from 'utils/misc';
import { fetchApplicant } from 'reducers/applicant';

import SimplePopover from 'components//SimplePopover/SimplePopover';
import GenericFormMessage from 'components//GenericFormMessage/GenericFormMessage';
import Capsule from 'components//Capsule/Capsule';
import ActionButton from 'components//ActionButton/ActionButton';
import BackLink from 'components//BackLink/BackLink';
import ExistingItemsExpansionPanel from 'components//ExistingItemsExpansionPanel/ExistingItemsExpansionPanel';
import ResetApplicantFinancials from 'pages/Banking/pages/IncomeVerificationSummary/components/ResetApplicantFinancials/ResetApplicantFinancials';
import BankingContext from 'pages/Banking/BankingContext';

import { H1, H3 } from 'assets/styles';
import { styles, Spacer, infoIconRoot } from 'assets/styles';
import finance from 'assets/images/finance.png';
import piggyBank from 'assets/images/piggy-bank.png';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;
const linkStyle = {
    textDecoration: 'underline',
    fontSize: 14,
};

const totals = css`
    text-align: left;
    border-top: 1px solid #eeeeee;
    padding-top: 15px;
`;

const totalsValue = css`
    font-size: 16px;
    font-weight: bold;
`;

const totalsP = css`
    margin-top: 0px;
    font-size: 14px;
`;

const incomeOrAssetItemWarning = css`
    display: flex;
    flex-flow: row nowrap;
    margin-bottom: 10px;

    svg {
        color: #fb6d68;
        margin-right: 10px;
    }

    span {
        font-size: 12px;
        color: #fb6d68;
    }
`;

export const getIncompleteFinancialSourceWarning = (source, isAsset) => {
    const { adjusted_amount, status } = source;
    const isIncomplete = status === FINANCIAL_STREAM_STATUS_INCOMPLETE;

    if (!isIncomplete) return null;

    let warning;
    if (adjusted_amount) {
        if (isAsset) {
            warning = `The documents for this asset source show a value of ${prettyCurrency(adjusted_amount)}.`;
        } else {
            warning = `The documents for this income source show earnings of ${prettyCurrency(adjusted_amount)}/year.`;
        }
    } else {
        warning = `This ${
            isAsset ? 'asset' : 'income'
        } source has been marked as having incorrect or insufficient documents.`;
    }

    return warning;
};

export function IncomeOrAssetItemWarning({ source, isAsset }) {
    const warning = getIncompleteFinancialSourceWarning(source, isAsset);
    if (!warning) return null;

    return (
        <div className={incomeOrAssetItemWarning}>
            <ErrorIcon />
            <span>{warning}</span>
        </div>
    );
}

IncomeOrAssetItemWarning.propTypes = {
    source: PropTypes.object.isRequired,
    isAsset: PropTypes.bool.isRequired,
};

export function IncomeOrAssetsItem({ source }) {
    const isAsset = source.stream_type === FINANCIAL_STREAM_ASSET;

    const getSourceLabel = useCallback((source) => {
        if (source.finicity_income_stream_id && source.other) {
            return source.other;
        }
        return ALL_INCOME_OR_ASSET_TYPES[source.income_or_asset_type]?.label;
    }, []);

    const getProofString = useCallback((source) => {
        if (source.income_or_asset_type === INCOME_TYPE_FINICITY_AUTOMATED) {
            return 'Linked bank account';
        }

        // find all document type labels
        const typesSet =
            source.uploaded_documents?.reduce((accum, doc) => {
                if (doc.type?.label) {
                    accum.add(doc.type.label);
                }
                return accum;
            }, new Set()) || new Set();

        // join labels together with comma
        const proofs = Array.from(typesSet).join(', ');
        if (!proofs) return 'None';
        return proofs;
    }, []);

    return (
        <div>
            <IncomeOrAssetItemWarning source={source} isAsset={isAsset} />
            <div>{getSourceLabel(source)}</div>
            <div className={styles.colorManatee}>{prettyCurrency(source.estimated_amount)}</div>
            <div className={styles.colorManatee}>
                {`Proof of ${isAsset ? 'asset' : 'income'}: ${getProofString(source)}`}
            </div>
            {source.income_or_asset_type !== INCOME_TYPE_FINICITY_AUTOMATED && (
                <>
                    <Spacer height={10} />
                    <Link
                        style={linkStyle}
                        to={generatePath(ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE, {
                            id: source.id,
                        })}
                    >
                        Edit
                    </Link>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link style={linkStyle} to={generatePath(ROUTES.REMOVE_FINANCIAL_SOURCE, { id: source.id })}>
                        Remove
                    </Link>
                </>
            )}
        </div>
    );
}

IncomeOrAssetsItem.propTypes = {
    source: PropTypes.object.isRequired,
};

export function IncomeVerificationSummaryPage(props) {
    const context = React.useContext(BankingContext);
    const [showResetFinancials, setShowResetFinancials] = useState(false);

    const hasIncompleteIncomeSources = useMemo(() => {
        if (!context.bankingData?.income_sources) {
            return false;
        }

        return context.bankingData.income_sources.some(({ status }) => status === FINANCIAL_STREAM_STATUS_INCOMPLETE);
    }, [context.bankingData]);

    const hasIncompleteAssetSources = useMemo(() => {
        if (!context.bankingData?.asset_sources) {
            return false;
        }

        return context.bankingData.asset_sources.some(({ status }) => status === FINANCIAL_STREAM_STATUS_INCOMPLETE);
    }, [context.bankingData]);

    const showIncompleteFinancialSourcesWarning = hasIncompleteIncomeSources || hasIncompleteAssetSources;

    const showRequestAdditionalInfoWarning = props.profile?.events?.find(
        ({ event }) => event === MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED
    );

    const setScrollPosition = useCallback(() => {
        // taken from https://github.com/ReactTraining/react-router/issues/394#issuecomment-128148470
        window.location.hash = window.decodeURIComponent(window.location.hash);
        const scrollToAnchor = () => {
            const hashParts = window.location.hash.split('#');
            if (hashParts.length > 1) {
                const hash = hashParts[1];
                const hashElement = document.querySelector(`#${hash}`);
                if (!!hashElement) {
                    hashElement.scrollIntoView();
                }
            }
        };
        scrollToAnchor();
        window.onhashchange = scrollToAnchor;
    }, []);

    useEffect(() => {
        setScrollPosition();
    }, [setScrollPosition]);

    const hashValue = props.location?.hash?.substring?.(1) ?? '';

    const getIncomeTipText = () => {
        return (
            <>
                Proof of legal, verifiable income in an amount equal to 2.0 – 3.0 times the monthly rent per household
                will be required based on pre-established requirements at the property, along with any necessary
                supporting documents.
                <br />
                Proof of income includes, but is not limited to, the following:
                <ul>
                    <li>
                        Proof of current employment (e.g., three most current paystubs within the last 45 or 90 days,
                        depending on the payment cycle);
                    </li>
                    <li>Prior year tax return;</li>
                    <li>
                        Proof of receipt of government income (e.g., social security, disability, welfare, unemployment,
                        etc.);
                    </li>
                    <li>Proof of receipt of retirement and/or investment income;</li>
                    <li>Proof of US based assets;</li>
                    <li>Student loan income;</li>
                    <li>Child/spousal support</li>
                    <li>Any other legal, verifiable income.</li>
                </ul>
            </>
        );
    };

    const getAssetTip = () => {
        return (
            <>
                If no current income, proof of liquid assets (which includes bank statements with deposits) at 2.0 – 3.0
                the net rent for the entire lease term is required.
            </>
        );
    };

    const getIncomeRequirementText = useCallback((config, profile, applicant) => {
        if (!profile || !applicant || !config) return <div />;

        const { guarantor_income_requirement_multiplier, applicant_income_requirements } = config;

        const guarantor_income_amount = guarantor_income_requirement_multiplier * profile.unit.price;
        const applicant_income_amount = applicant_income_requirements * profile.unit.price;

        if (applicant.role === ROLE_GUARANTOR) {
            return (
                <p className={totalsP}>
                    {prettyCurrency(guarantor_income_amount)} is the required income for guarantors.
                    {
                        <SimplePopover
                            text={`The required income for a guarantor is ${guarantor_income_requirement_multiplier}x the monthly rent`}
                        >
                            <InfoIcon classes={{ root: infoIconRoot }} style={{ color: '#828796', width: 16 }} />
                        </SimplePopover>
                    }
                </p>
            );
        }

        return (
            <p className={totalsP}>
                {prettyCurrency(applicant_income_amount)} is the recommended household income.
                <SimplePopover
                    text={`It’s recommended that the yearly combined income of all applicants be ${applicant_income_requirements}x the monthly rent.`}
                >
                    <InfoIcon classes={{ root: infoIconRoot }} style={{ color: '#828796', width: 16 }} />
                </SimplePopover>
            </p>
        );
    }, []);

    const hasNotAddedFinancialSources =
        !context.bankingData?.asset_sources.length && !context.bankingData?.income_sources.length;
    const reportedNoIncomeAssets = context.bankingData?.reported_no_income_assets;
    const canContinue = !hasNotAddedFinancialSources || reportedNoIncomeAssets;

    const updatesWereRequested = !!props.applicant.events?.find(
        (e) =>
            String(e.event) ===
            String(APPLICANT_EVENTS.EVENT_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED_EMAIL_SENT)
    );

    const applicantSubmittedApplication = !!props.applicant.events?.find(
        (e) => String(e.event) === String(MILESTONE_APPLICANT_SUBMITTED)
    );

    const applicantUpdatedEmployerInfo = !!props.applicant.events?.find(
        (e) => String(e.event) === String(APPLICANT_EVENTS.EVENT_APPLICANT_UPDATED_EMPLOYER_INFO)
    );

    const onContinue = useCallback(async () => {
        if (applicantSubmittedApplication || updatesWereRequested) {
            if (!reportedNoIncomeAssets && !applicantUpdatedEmployerInfo) {
                props.history.push(ROUTES.EMPLOYER_DETAILS);
                return;
            }
            window.location.reload();
            return;
        }
        if (props.config.collect_employer_information && !reportedNoIncomeAssets) {
            props.history.push(ROUTES.EMPLOYER_DETAILS);
        } else {
            fetchApplicant();
            context.history.push(ROUTES.FEES_AND_DEPOSITS);
        }
    }, [
        context,
        props.history,
        props.config,
        reportedNoIncomeAssets,
        updatesWereRequested,
        applicantSubmittedApplication,
        applicantUpdatedEmployerInfo,
    ]);

    if (showResetFinancials) {
        return (
            <ResetApplicantFinancials
                onSubmit={() => {
                    context.clearFinancialSources();
                    props.history.push(ROUTES.INCOME_AND_EMPLOYMENT);
                }}
                onCancel={() => setShowResetFinancials(false)}
            />
        );
    }

    return (
        <>
            <SkinnyH1>
                {reportedNoIncomeAssets ? `Confirm Income and Assets` : `Income and Asset Verification`}
            </SkinnyH1>
            <SpacedH3>
                {reportedNoIncomeAssets
                    ? `Easy, right? Now just review the info below.`
                    : `Add at least one income source or asset below.`}
            </SpacedH3>
            {showRequestAdditionalInfoWarning && (
                <GenericFormMessage
                    type="error"
                    messages={["We're requesting additional info to verify your income/assets."]}
                />
            )}
            {showIncompleteFinancialSourcesWarning && (
                <GenericFormMessage
                    type="error"
                    messages={['Oops! We found some issues with one or more of your income/assets sources.']}
                />
            )}
            <Capsule
                name="income"
                prefix={<img alt="coin" src={finance} />}
                label="Income"
                buttonLabel={
                    !context.bankingData?.income_sources?.length ? 'Add an Income Source' : 'Add Another Income Source'
                }
                tip={getIncomeTipText()}
                route={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME}
                expansionPanel={
                    <>
                        {context.bankingData?.income_total && (
                            <div className={totals}>
                                <div className={totalsValue}>
                                    {prettyCurrency(parseInt(context.bankingData?.income_total))} Total Annual Income
                                </div>
                                {getIncomeRequirementText(props.config, props.profile, props.applicant)}
                            </div>
                        )}
                        <ExistingItemsExpansionPanel
                            label="Income Source"
                            labelQuantity={context.bankingData?.income_sources.length}
                            defaultExpanded={hashValue === 'income' || hasIncompleteIncomeSources}
                        >
                            {context.bankingData?.income_sources?.map((source) => (
                                <IncomeOrAssetsItem key={source.id} source={source} />
                            ))}
                        </ExistingItemsExpansionPanel>
                    </>
                }
            />
            <Capsule
                name="asset"
                prefix={<img alt="piggy bank" src={piggyBank} />}
                label="Assets"
                buttonLabel={!context.bankingData?.asset_sources?.length ? 'Add an Asset' : 'Add Another Asset'}
                tip={getAssetTip()}
                route={ROUTES.MANUAL_ASSET_ENTRY_ADD_ASSET}
                expansionPanel={
                    <>
                        {context.bankingData?.asset_total && (
                            <div className={totals}>
                                <div className={totalsValue}>
                                    {prettyCurrency(parseInt(context.bankingData?.asset_total))} Total Asset Balance
                                </div>
                                <p className={totalsP}>
                                    We’ll take this number into consideration in addition to or in place of income.
                                </p>
                            </div>
                        )}
                        <ExistingItemsExpansionPanel
                            label="Asset"
                            labelQuantity={context.bankingData?.asset_sources.length}
                            defaultExpanded={hashValue === 'asset' || hasIncompleteAssetSources}
                        >
                            {context.bankingData?.asset_sources?.map((source) => (
                                <IncomeOrAssetsItem key={source.id} source={source} />
                            ))}
                        </ExistingItemsExpansionPanel>
                    </>
                }
            />
            <ActionButton disabled={!canContinue} marginTop={68} marginBottom={20} onClick={onContinue}>
                Continue
            </ActionButton>
            {hasNotAddedFinancialSources ? (
                <BackLink
                    to={{
                        pathname: ROUTES.INCOME_AND_EMPLOYMENT,
                        state: {
                            redirectToFirstPage: true,
                        },
                    }}
                />
            ) : (
                <Typography
                    classes={{ root: styles.cursor }}
                    onClick={() => setShowResetFinancials(true)}
                    color="primary"
                >
                    Start Income Verification Over
                </Typography>
            )}
        </>
    );
}

IncomeVerificationSummaryPage.propTypes = {
    config: PropTypes.object,
    profile: PropTypes.object,
    applicant: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    fetchApplicant: PropTypes.func,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
    profile: state.renterProfile,
    applicant: state.applicant,
});

export default connect(mapStateToProps, { fetchApplicant })(IncomeVerificationSummaryPage);
