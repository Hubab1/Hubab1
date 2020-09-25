import React from 'react';
import { connect } from 'react-redux';
import captureRoute from 'app/captureRoute';
import { ROUTES } from 'app/constants';
import { useEffect } from 'react';
import { useState } from 'react';
import API from 'app/api';

import { ScrollableTermsCardSection, Card, H1 } from 'assets/styles';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import { sessionIsValidForCommunityId } from 'utils/misc';

export function PrivacyPolicy(props) {
    const [html, setHtml] = useState(null);
    useEffect(() => {
        API.fetchPrivacyPolicy().then((res) => {
            return res.text();
        }).then((res) => {
            setHtml(res);
        });
    }, []);
    if (!html) return null;
    const base = (
        <>
            <H1>Privacy Policy</H1>
            <br/>
            <Card>
                <ScrollableTermsCardSection>
                    <div dangerouslySetInnerHTML={{
                        __html: html
                    }}/>
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
            </UnauthenticatedPage>
        );
    }
}

const mapStateToProps = state => ({
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
});

export default connect(mapStateToProps)(captureRoute(PrivacyPolicy, ROUTES.PRIVACY_POLICY));
