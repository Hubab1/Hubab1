import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'constants/constants';
import { sessionIsValidForCommunityId } from 'utils/misc';
import captureRoute from 'utils/captureRoute';

import UnauthenticatedPage from 'pages/Unauthenticated';
import FAQ from 'pages/FAQ/components/FAQ';

export function FAQPage({ config, isSignedIn }) {
    if (!isSignedIn) {
        return (
            <UnauthenticatedPage>
                <FAQ community={config.community} />
            </UnauthenticatedPage>
        );
    }

    return <FAQ community={config.community} />;
}

FAQPage.propTypes = {
    config: PropTypes.object.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
});

export default connect(mapStateToProps, null)(captureRoute(FAQPage, ROUTES.FAQ));
