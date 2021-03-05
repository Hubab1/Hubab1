import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import { ROUTES } from 'constants/constants';
import API from 'api/api';
import captureRoute from 'utils/captureRoute';
import { sessionIsValidForCommunityId } from 'utils/misc';

import { ScrollableTermsCardSection, Card } from 'assets/styles';
import UnauthenticatedPage from 'components//Pages/UnauthenticatedPage/UnauthenticatedPage';

export const TERMS_HEADER = styled.h1`
    font-weight: 600 !important;
    font-size: 23px !important;
    margin: 0 auto !important;
    padding: 0 !important;
    color: black;
    text-align: center;
`;

export function FunnelTermsPage(props) {
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
    }

    return <UnauthenticatedPage>{base}</UnauthenticatedPage>;
}

FunnelTermsPage.propTypes = {
    isSignedIn: PropTypes.bool,
    leaseSettingsId: PropTypes.string,
};

const mapStateToProps = (state) => ({
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
    leaseSettingsId: state.siteConfig.basename,
});

export default connect(mapStateToProps)(captureRoute(FunnelTermsPage, ROUTES.FUNNEL_TERMS));
