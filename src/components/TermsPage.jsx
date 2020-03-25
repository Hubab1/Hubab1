import React from 'react';
import { connect } from 'react-redux';

import captureRoute from 'app/captureRoute';
import { ROUTES } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, Bold, Card, ScrollableTermsCardSection } from 'assets/styles';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import { sessionIsValidForCommunityId } from 'utils/misc';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.`;


export function TermsPage (props) {
    function onAgree () {
        localStorage.setItem(`accepted-terms-${props.leaseSettingsId}`, true);
        props.history.push(ROUTES.SIGNUP);
    }
    
    const base = (
        <>
            <H1>Terms and Conditions</H1>
            <br/>
            <Card>
                <ScrollableTermsCardSection>
                    <div>Terms and Conditions</div>
                    <div>General Site Usage</div>
                    <div>Last Revised: December 16, 2013</div>
                    <br/>
                    <div>Welcome to 555 Waverly. {LOREM}</div>
                    <br/>
                    <Bold>1. YOUR AGREEMENT</Bold>
                    <br/>
                    <div>By using this site, {LOREM}</div>
                    <br/>
                    <Bold>PLEASE NOTE: </Bold><span>We reserve the right {LOREM}</span>
                    <br/>
                    <br/>
                    <Bold>2. PRIVACY</Bold>
                    <br/>
                    <div>Please {LOREM}</div>
                </ScrollableTermsCardSection>
            </Card>
        </>
    );
    if (props.isSignedIn) {
        return base;
    } else {
        return (
            <UnauthenticatedPage>
                {base}
                <ActionButton onClick={onAgree}>
                    Agree and Continue
                </ActionButton>
            </UnauthenticatedPage>
        );
    }
}

const mapStateToProps = state => ({
    leaseSettingsId: state.siteConfig.basename,
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
});

export default connect(mapStateToProps)(captureRoute(TermsPage, ROUTES.TERMS));
