import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import API from 'api/api';
import { ROUTES } from 'constants/constants';
import captureRoute from 'utils/captureRoute';
import { sessionIsValidForCommunityId } from 'utils/misc';

import UnauthenticatedPage from 'pages/Unauthenticated';
import { ScrollableTermsCardSection, Card } from 'assets/styles';

export const TERMS_HEADER = styled.h1`
    font-weight: 600 !important;
    font-size: 23px !important;
    margin: 0 auto !important;
    padding: 0 !important;
    color: black;
    text-align: center;
`;

export function PrivacyPolicyPage(props) {
    const [html, setHtml] = useState(null);

    useEffect(() => {
        API.fetchPrivacyPolicy()
            .then((res) => {
                return res.text();
            })
            .then((res) => {
                setHtml(res);
            });
    }, []);

    if (!html) return null;

    const base = (
        <>
            <TERMS_HEADER>Privacy Policy</TERMS_HEADER>
            <br />
            <Card>
                <ScrollableTermsCardSection>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: html,
                        }}
                    />
                </ScrollableTermsCardSection>
            </Card>
        </>
    );

    if (props.isSignedIn) {
        return base;
    }

    return <UnauthenticatedPage>{base}</UnauthenticatedPage>;
}

const mapStateToProps = (state) => ({
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
});

export default connect(mapStateToProps)(captureRoute(PrivacyPolicyPage, ROUTES.PRIVACY_POLICY));
