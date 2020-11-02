import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ROUTES, TOS_TYPE_NESTIO, TOS_TYPE_ELECTRONIC_SIGNATURE } from 'app/constants';
import captureRoute from 'app/captureRoute';
import { sessionIsValidForCommunityId } from 'utils/misc';
import { ElectronicSignatureAgreement } from 'components/agreements/ElectronicSignatureAgreement';
import { FunnelTOSAgreement } from 'components/agreements/FunnelTOSAgreement';

export const PlatformAgreementsContainer = (props) => {
    const [currentPage, setCurrentPage] = useState('electronicTOS');

    function onAgreeFunnelTOSAgreement() {
        const generalTerms = {
            type: TOS_TYPE_NESTIO,
            context: {
                time: Date.now(),
            },
        };
        localStorage.setItem(`accepted-platform-terms-${props.leaseSettingsId}`, JSON.stringify(generalTerms));
        props.history.push(ROUTES.SIGNUP);
    }

    function onAgreeElectronicSignatureAgreement() {
        const terms = {
            type: TOS_TYPE_ELECTRONIC_SIGNATURE,
            context: {
                time: Date.now(),
            },
        };
        localStorage.setItem(`accepted-electronic-signature-terms-${props.leaseSettingsId}`, JSON.stringify(terms));
        setCurrentPage('FunnelTOS');
    }

    if (currentPage === 'FunnelTOS') {
        return <FunnelTOSAgreement isSignedIn={props.isSignedIn} onAgree={onAgreeFunnelTOSAgreement} />;
    } else {
        return (
            <ElectronicSignatureAgreement isSignedIn={props.isSignedIn} onAgree={onAgreeElectronicSignatureAgreement} />
        );
    }
};

const mapStateToProps = (state) => ({
    leaseSettingsId: state.siteConfig.basename,
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
});

export default connect(mapStateToProps)(captureRoute(PlatformAgreementsContainer, ROUTES.TERMS));
