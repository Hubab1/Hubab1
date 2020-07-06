import React from 'react';
import { generatePath } from "react-router";
import styled from '@emotion/styled';

import { BackLink } from 'components/common/BackLink';
import ActionButton from 'components/common/ActionButton/ActionButton';
import Capsule from 'components/common/Capsule/Capsule';
import { H1, H3 } from 'assets/styles';
import finance from 'assets/images/finance.png';
import piggyBank from 'assets/images/piggy-bank.png';
import captureRoute from 'app/captureRoute';
import { ROUTES } from 'app/constants';
import ExistingItemsExpansionPanel from 'components/profile/options/ExistingItemsExpansionPanel';
import { styles, Spacer } from 'assets/styles';
import BankingContext from './BankingContext';
import { ALL_INCOME_OR_ASSET_TYPES } from 'app/constants';
import { prettyCurrency } from 'utils/misc';
import { Link } from 'react-router-dom';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;
const linkStyle = {
    textDecoration: 'underline',
    fontSize: 14
};

export function ManualIncomeVerificationPage (props) {
    const context = React.useContext(BankingContext);
    const setScrollPosition = () => {
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
    }
    React.useEffect(() => {
        setScrollPosition();
    }, [])
    const hashValue = props.location?.hash?.substring?.(1) ?? '';
    return (
        <>
            <SkinnyH1>Income and Asset Verification</SkinnyH1>
            <SpacedH3>Add at least one income source or asset below.</SpacedH3>
            <Capsule
                name="income"
                prefix={<img alt="coin" src={finance}></img>}
                label="Income"
                buttonLabel="Add an Income Source"
                tip="TBD"
                route={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME}
                expansionPanel={
                    <ExistingItemsExpansionPanel
                        label="Income Source"
                        labelQuantity={context.bankingData?.income_sources.length}
                        defaultExpanded={hashValue === 'income'}
                    >
                        {
                            context.bankingData?.income_sources?.map((source, i) => (
                                <div key={source.id}>
                                    <div>{ALL_INCOME_OR_ASSET_TYPES[source.income_or_asset_type]?.label}</div>
                                    <div className={styles.colorManatee}>{prettyCurrency(source.estimated_amount)}/year</div>
                                    <Spacer height={10}/>
                                    <Link style={linkStyle} to={generatePath(ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE, {
                                        id: source.id,
                                    })}>Edit</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Link style={linkStyle} to={generatePath(ROUTES.REMOVE_FINANCIAL_SOURCE, {
                                        id: source.id,
                                    })}>Remove</Link>
                                </div>
                            ))
                        }
                    </ExistingItemsExpansionPanel>
                }
            />
            <Capsule
                name="asset"
                prefix={<img alt="piggy bank" src={piggyBank}></img>}
                label="Assets"
                buttonLabel="Add an Asset"
                tip="TBD"
                route={ROUTES.MANUAL_ASSET_ENTRY_ADD_ASSET}
                expansionPanel={
                    <ExistingItemsExpansionPanel
                        label="Asset"
                        labelQuantity={context.bankingData?.asset_sources.length}
                        defaultExpanded={hashValue === 'asset'}
                    >
                        {
                            context.bankingData?.asset_sources?.map((source, i) => (
                                <div key={source.id}>
                                    <div>{ALL_INCOME_OR_ASSET_TYPES[source.income_or_asset_type]?.label}</div>
                                    <div className={styles.colorManatee}>{prettyCurrency(source.estimated_amount)}</div>
                                    <Spacer height={10}/>
                                    <Link style={linkStyle} to={generatePath(ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE, {
                                        id: source.id,
                                    })}>Edit</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Link style={linkStyle} to={generatePath(ROUTES.REMOVE_FINANCIAL_SOURCE, {
                                        id: source.id,
                                    })}>Remove</Link>
                                </div>
                            ))
                        }
                    </ExistingItemsExpansionPanel>
                }
            />
            <ActionButton marginTop={68} marginBottom={20}>
                Continue
            </ActionButton>
            <BackLink to={ROUTES.INCOME_AND_EMPLOYMENT} />
        </>
    );
}

ManualIncomeVerificationPage.route = ROUTES.MANUAL_INCOME_VERIFICATION;

export default captureRoute(ManualIncomeVerificationPage)
