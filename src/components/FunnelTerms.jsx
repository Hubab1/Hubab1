import React from 'react';
import { connect } from 'react-redux';
import captureRoute from 'app/captureRoute';
import { ROUTES } from 'app/constants';
import { useEffect } from 'react';
import { useState } from 'react';
import API from 'app/api';
import PropTypes from 'prop-types';
import { ScrollableTermsCardSection, Card } from 'assets/styles';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import { sessionIsValidForCommunityId } from 'utils/misc';
import styled from '@emotion/styled';

export const TERMS_HEADER = styled.h1`
    font-weight: 600 !important;
    font-size: 23px !important;
    margin: 0 auto !important;
    padding: 0 !important;
    color: black;
    text-align: center;
`;

export function FunnelTerms(props) {
    const [html, setHtml] = useState(null);
    useEffect(() => {
        API.fetchFunnelTerms(props.leaseSettingsId)
            .then((res) => {
                return res.text();
            })
            .then((res) => {
                setHtml(res);
            });
    }, [props.leaseSettingsId]);
    if (!html) return null;
    const base = (
        <>
            <TERMS_HEADER>Funnel Leasing Inc. Terms of Service</TERMS_HEADER>
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
    } else {
        return <UnauthenticatedPage>{base}</UnauthenticatedPage>;
    }
}

FunnelTerms.propTypes = {
    isSignedIn: PropTypes.bool,
    leaseSettingsId: PropTypes.string,
};

const mapStateToProps = (state) => ({
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
    leaseSettingsId: state.siteConfig.basename,
});

export default connect(mapStateToProps)(captureRoute(FunnelTerms, ROUTES.FUNNEL_TERMS));
