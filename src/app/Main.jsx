import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ROUTES } from 'constants/constants';
import { initLaunchDarkly } from 'utils/launchdarkly';
import { sessionIsValidForCommunityId } from 'utils/misc';
import auth from 'utils/auth';

import { fetchRenterProfile, selectors } from 'reducers/renter-profile';
import { fetchConfiguration } from 'reducers/configuration';
import { fetchApplicant } from 'reducers/applicant';
import { actions as mainActions } from 'reducers/store';
import { selectors as configSelectors } from 'reducers/configuration';

import AppContextProvider from 'app/AppContextProvider';
import NavDrawer from 'common-components/NavDrawer/NavDrawer';
import ResendLinkForm from 'common-components/ResendLinkForm/ResendLinkForm';

import CriticalErrorPage from 'pages/CriticalError';
import WelcomePage from 'pages/Welcome';
import LoginPage from 'pages/Login';
import SignupPage from 'pages/Signup';
import PasswordPages from 'pages/Password';
import UnitUnavailablePage from 'pages/UnitUnavailable';
import PrivacyPolicyPage from 'pages/PrivacyPolicy';
import FAQPage from 'pages/FAQ';
import TermsPage from 'pages/Terms';
import Address from 'pages/Address';
import LeaseTermsPage from 'pages/LeaseTerms';
import AccountPage from 'pages/Account';
import RenterProfilePages from 'pages/RenterProfile';
import BankingPages from 'pages/Banking';
import FeesAndDepositsPages from 'pages/FeesAndDeposits';
import HoldingDepositAgreementPage from 'pages/HoldingDepositAgreement';
import HoldingDepositReagreementPage from 'pages/HoldingDepositReagreement';
import ScreeningPage from 'pages/Screening';
import ApplicationApprovedPage from 'pages/ApplicationApproved';
import ApplicationCancelledPage from 'pages/ApplicationCancelled';
import ApplicationCompletePage from 'pages/ApplicationComplete';
import ApplicationDeniedPage from 'pages/ApplicationDenied';
import LeaseExecutedPage from 'pages/LeaseExecuted';
import LeaseSignedPage from 'pages/LeaseSigned';
import LeaseVoidedPage from 'pages/LeaseVoided';
import FunnelTermsPage from 'pages/FunnelTerms';
import GuarantorRequestedPage from 'pages/GuarantorRequested';
import PaymentDetailsPage from 'pages/PaymentDetails';
import PaymentTermsPage from 'pages/PaymentTerms';
import ApplicationsPage from 'pages/Applications';

export class Main extends Component {
    state = { error: null };

    async initializeApp(isAuthenticated, configuration) {
        const { history, location } = this.props;
        const pathname = location.pathname;

        initLaunchDarkly(configuration?.community?.company);

        if (!isAuthenticated) {
            if (
                pathname.includes('login') ||
                pathname.includes('signup') ||
                pathname.includes('password') ||
                pathname.includes('terms') ||
                pathname.includes('privacy-policy') ||
                pathname.includes('faq')
            )
                return;

            if (configuration.unit?.is_unavailable) {
                history.replace(ROUTES.UNAUTHENTICATED_UNIT_UNAVAILABLE);
            } else {
                history.replace(ROUTES.WELCOME);
            }
        } else {
            let applicationId = pathname.split('/')[2];
            const { has_multiple_active_applications } = await this.props.fetchApplicant();

            if (!applicationId && has_multiple_active_applications) {
                return history.replace(ROUTES.APPLICATIONS);
            }

            applicationId = this.props.applicant.application;
            await this.props.fetchRenterProfile(applicationId);

            if (!this.props.canAccessCurrentRoute()) {
                history.replace(this.props.initialPage);
            }
        }
    }

    async componentDidMount() {
        const communityId = this.props.communityId;
        const hash = this.props.hash;
        const isLoggedIn = auth.isAuthenticated() && sessionIsValidForCommunityId(communityId);

        let configuration;
        try {
            configuration = await this.props.fetchConfiguration(communityId, hash);
        } catch (error) {
            return this.setState({ hasError: true });
        }
        await this.initializeApp(isLoggedIn, configuration);
        this.resetTimer();
        this.addIdleEventListeners();
    }

    addIdleEventListeners = () => {
        // assign document events
        ['mousemove', 'touchstart', 'scroll', 'touchend', 'click', 'touchmove', 'keypress'].forEach((eventType) => {
            document.addEventListener(eventType, this.resetTimer);
        });

        // assign window events
        ['load', 'scroll'].forEach((eventType) => {
            window.addEventListener(eventType, this.resetTimer);
        });
    };

    removeIdleEventListeners = () => {
        ['mousemove', 'touchstart', 'scroll', 'touchend', 'click', 'touchmove', 'keypress'].forEach((eventType) => {
            document.removeEventListener(eventType, this.resetTimer);
        });

        // assign window events
        ['load', 'scroll'].forEach((eventType) => {
            window.removeEventListener(eventType, this.resetTimer);
        });
    };

    componentWillUnmount() {
        this.removeIdleEventListeners();
    }

    resetTimer = () => {
        clearTimeout(this.time);
        const SECOND = 1000;
        this.time = setTimeout(this.logout, SECOND * 60 * 15);
    };

    logout = () => {
        if (this.props.isLoggedIn) {
            this.props.logout();
            localStorage.clear();
            this.props.history.push({
                pathname: ROUTES.LOGIN,
                state: { errors: 'Oops, your session has timed-out. Please log back in to continue.' },
            });
        }
    };

    render() {
        const { theme, isLoggedIn } = this.props;
        const { hasError } = this.state;

        if (hasError) return <CriticalErrorPage />;
        if (!theme) return null;

        return (
            <AppContextProvider theme={theme}>
                <Switch>
                    <Route path={ROUTES.WELCOME} component={WelcomePage} />
                    <Route path={ROUTES.LOGIN} component={LoginPage} />
                    <Route path={ROUTES.SIGNUP} component={SignupPage} />
                    <Route path={ROUTES.PASSWORD} component={PasswordPages} />
                    {!isLoggedIn && (
                        <>
                            <Route path={ROUTES.UNAUTHENTICATED_UNIT_UNAVAILABLE} component={UnitUnavailablePage} />
                            <Route path={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyPage} />
                            <Route path={ROUTES.FAQ} component={FAQPage} />
                            <Route path={ROUTES.TERMS} component={TermsPage} />
                        </>
                    )}
                    {isLoggedIn && (
                        <NavDrawer>
                            <Route path={ROUTES.ADDRESS} component={Address} />
                            <Route path={ROUTES.LEASE_TERMS} component={LeaseTermsPage} />
                            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                            <Route path={ROUTES.RENTAL_PROFILE} component={RenterProfilePages} />
                            <Route path={ROUTES.BANKING} component={BankingPages} />
                            <Route
                                path={ROUTES.FEES_AND_DEPOSITS}
                                component={FeesAndDepositsPages.FeesAndDepositsPage}
                            />
                            <Route path={ROUTES.HOLDING_DEPOSIT_AGREEMENT} component={HoldingDepositAgreementPage} />
                            <Route
                                path={ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT}
                                component={HoldingDepositReagreementPage}
                            />
                            <Route path={ROUTES.SCREENING} component={ScreeningPage} />
                            <Route path={ROUTES.APP_APPROVED} component={ApplicationApprovedPage} />
                            <Route path={ROUTES.APP_CANCELLED} component={ApplicationCancelledPage} />
                            <Route path={ROUTES.APP_COMPLETE} component={ApplicationCompletePage} />
                            <Route path={ROUTES.APP_DENIED} component={ApplicationDeniedPage} />
                            <Route path={ROUTES.LEASE_EXECUTED} component={LeaseExecutedPage} />
                            <Route path={ROUTES.LEASE_SIGNED} component={LeaseSignedPage} />
                            <Route path={ROUTES.LEASE_VOIDED} component={LeaseVoidedPage} />
                            <Route path={ROUTES.FUNNEL_TERMS} component={FunnelTermsPage} />
                            <Route path={ROUTES.GUARANTOR_REQUESTED} component={GuarantorRequestedPage} />
                            <Route path={ROUTES.RESEND_INVITE} component={ResendLinkForm} />
                            <Route path={ROUTES.PAYMENT_DETAILS} component={PaymentDetailsPage} />
                            <Route path={ROUTES.PAYMENT_TERMS} component={PaymentTermsPage} />
                            <Route
                                path={ROUTES.OUTSTANDING_BALANCE}
                                component={FeesAndDepositsPages.OutstandingBalancePage}
                            />
                            <Route path={ROUTES.APPLICATIONS} component={ApplicationsPage} />
                            <Route path={ROUTES.UNIT_UNAVAILABLE} component={UnitUnavailablePage} />
                            <Route path={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyPage} />
                            <Route path={ROUTES.FAQ} component={FAQPage} />
                            <Route path={ROUTES.TERMS} component={TermsPage} />
                        </NavDrawer>
                    )}
                </Switch>
            </AppContextProvider>
        );
    }
}

Main.propTypes = {
    profile: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    configuration: PropTypes.object,
    communityId: PropTypes.string,
    hash: PropTypes.string,
    initialPage: PropTypes.string,
    canAccessCurrentRoute: PropTypes.func,
    theme: PropTypes.object,
    fetchRenterProfile: PropTypes.func,
    fetchConfiguration: PropTypes.func,
    fetchApplicant: PropTypes.func,
    logout: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    applicant: PropTypes.object,
    match: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    applicant: state.applicant,
    isLoggedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
    configuration: state.configuration,
    communityId: state.siteConfig.basename,
    hash: state.siteConfig.hash,
    initialPage: selectors.selectInitialPage(state),
    canAccessCurrentRoute: () => selectors.canAccessRoute(state, state.siteConfig.currentRoute),
    theme: configSelectors.selectTheme(state),
});

const mapDispatchToProps = {
    fetchRenterProfile,
    fetchConfiguration,
    fetchApplicant,
    logout: mainActions.logout,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
