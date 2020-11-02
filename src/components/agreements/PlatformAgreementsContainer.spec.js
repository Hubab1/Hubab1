import React from 'react';
import { shallow } from 'enzyme';
import { PlatformAgreementsContainer } from './PlatformAgreementsContainer';
import { ROUTES } from 'app/constants';
import { TOS_TYPE_NESTIO, TOS_TYPE_ELECTRONIC_SIGNATURE } from 'app/constants';
import { ElectronicSignatureAgreement } from 'components/agreements/ElectronicSignatureAgreement';
import { FunnelTOSAgreement } from 'components/agreements/FunnelTOSAgreement';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        leaseSettingsId: 10,
        history: {
            push: jest.fn(),
        },
        isSignedIn: false,
    };
});

it('sets localStorage and navigates', () => {
    const wrapper = shallow(<PlatformAgreementsContainer {...defaultProps} />);

    // Accepting Electronic terms
    wrapper.find(ElectronicSignatureAgreement).props().onAgree();
    expect(global.localStorage.getItem('accepted-electronic-signature-terms-10')).toBeTruthy();
    const acceptedElectronicTerms = JSON.parse(global.localStorage.getItem('accepted-electronic-signature-terms-10'));
    expect(acceptedElectronicTerms.type).toEqual(TOS_TYPE_ELECTRONIC_SIGNATURE);

    // Accepting Funnel Leasing Platform Terms
    wrapper.find(FunnelTOSAgreement).props().onAgree();
    expect(global.localStorage.getItem('accepted-platform-terms-10')).toBeTruthy();
    const acceptedFunnelTerms = JSON.parse(global.localStorage.getItem('accepted-platform-terms-10'));
    expect(acceptedFunnelTerms.type).toEqual(TOS_TYPE_NESTIO);

    // Going to signup page
    expect(defaultProps.history.push).toHaveBeenCalledWith(ROUTES.SIGNUP);
});
