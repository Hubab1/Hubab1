import React from 'react';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import { sessionIsValidForCommunityId } from 'utils/misc';
import captureRoute from 'app/captureRoute';

import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import FAQ from 'components/FAQ/FAQ';

export function FAQPage({ isSignedIn }) {
    if (!isSignedIn) {
        return (
            <UnauthenticatedPage>
                <FAQ />
            </UnauthenticatedPage>
        );
    }

    return <FAQ />;
}

const mapStateToProps = (state) => ({
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
});

export default connect(mapStateToProps, null)(captureRoute(FAQPage, ROUTES.FAQ));
