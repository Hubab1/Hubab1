import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
    ROUTES,
    ROLE_PRIMARY_APPLICANT,
    ROLE_CO_APPLICANT,
    APPLICANT_EVENTS,
    APPLICATION_STATUS_APPROVED,
    APPLICATION_STATUS_COMPLETED,
    APPLICATION_STATUS_CONDITIONALLY_APPROVED,
    APPLICATION_STATUS_CANCELLED,
    MILESTONE_APPLICANT_SUBMITTED,
    EVENT_LEASE_TERMS_COMPLETED,
    MILESTONE_APPLICATION_FEE_COMPLETED,
    MILESTONE_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED,
    MILESTONE_APPLICANT_NEEDS_TO_REAGREE_TO_HD,
    MILESTONE_LEASE_VOIDED,
    MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED,
    MILESTONE_REQUEST_GUARANTOR,
    APPLICATION_STATUS_DENIED,
} from 'constants/constants';
import API from 'api/api';
import { applicationPath, fetchRenterProfile, renterProfileReceived, selectors } from 'reducers/renter-profile';
import { filterRentalOptionsByUnit } from 'reducers/configuration';
import { generatePath } from 'react-router';

describe('selectNav', () => {
    it('Builds list of nav routes and label objects', () => {
        const pages = selectors.selectNav({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(pages).toEqual([
            {
                name: 'Current Address',
                value: '/application/:application_id/address',
            },
            {
                name: 'Lease Terms',
                value: '/application/:application_id/lease-terms',
            },
            {
                name: 'Rental Profile',
                value: '/application/:application_id/rental-profile/options',
            },
            {
                name: 'Income & Employment',
                value: '/application/:application_id/income-employment/connect',
            },
            {
                name: 'Fees & Deposits',
                value: '/application/:application_id/fees-deposits',
            },
            {
                name: 'Screening',
                value: '/application/:application_id/screening',
            },
            {
                name: 'Application Complete',
                value: '/application/:application_id/application-complete',
            },
        ]);
    });
});

describe('canAccessRoute', () => {
    const state = {
        configuration: {
            enable_automatic_income_verification: true,
            collect_employer_information: true,
        },
        renterProfile: {
            co_applicants: null,
            occupants: null,
            guarantor: null,
            pets: null,
            lease_term: 6,
            id: 12,
        },
        applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
    };
    it('privacy policy is accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.PRIVACY_POLICY);
        expect(accessible).toBe(true);
    });
    it('FUNNEL_TERMS is accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.FUNNEL_TERMS);
        expect(accessible).toBe(true);
    });
    it('payment terms is not accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.PAYMENT_TERMS);
        expect(accessible).toBe(false);
    });
    it('account page is accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.ACCOUNT);
        expect(accessible).toBe(true);
    });
    it('terms are accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.TERMS);
        expect(accessible).toBe(true);
    });
    it('FAQ is accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.FAQ);
        expect(accessible).toBe(true);
    });
    // completed page accessible
    it('address page is accessible', () => {
        const accessible = selectors.canAccessRoute(state, applicationPath(ROUTES.ADDRESS, state.renterProfile.id));
        expect(accessible).toBe(true);
    });
    // completed page + 1 accessible
    it('lease terms page is accessible', () => {
        const accessible = selectors.canAccessRoute(state, applicationPath(ROUTES.LEASE_TERMS, state.renterProfile.id));
        expect(accessible).toBe(true);
    });
    // completed page + 2 inaccessible
    it('renter profile page is not accessible', () => {
        const accessible = selectors.canAccessRoute(
            state,
            applicationPath(ROUTES.RENTAL_PROFILE, state.renterProfile.id)
        );
        expect(accessible).toBe(false);
    });
    it('payment details page is not accessible', () => {
        const accessible = selectors.canAccessRoute(
            state,
            applicationPath(ROUTES.PAYMENT_DETAILS, state.renterProfile.id)
        );
        expect(accessible).toBe(false);
    });
    it('payment details page is accessible', () => {
        const accessible = selectors.canAccessRoute(
            {
                ...state,
                applicant: {
                    ...state.applicant,
                    events: [
                        {
                            application: state.renterProfile.id,
                            event: EVENT_LEASE_TERMS_COMPLETED,
                        },
                    ],
                },
            },
            ROUTES.PAYMENT_DETAILS
        );
        expect(accessible).toBe(true);
    });
});

describe('selectOrderedRoutes', () => {
    it('Shows correct pages for primary applicant', () => {
        const pages = selectors.selectOrderedRoutes({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                occupants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(pages).toEqual([
            '/application/:application_id/address',
            '/application/:application_id/lease-terms',
            '/application/:application_id/rental-profile/options',
            '/application/:application_id/income-employment/connect',
            '/application/:application_id/fees-deposits',
            '/application/:application_id/screening',
            '/application/:application_id/application-complete',
        ]);
    });
    it('Shows correct pages for secondary applicants', () => {
        const pages = selectors.selectOrderedRoutes({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                occupants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_CO_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(pages).toEqual([
            '/application/:application_id/address',
            '/application/:application_id/lease-terms',
            '/application/:application_id/income-employment/connect',
            '/application/:application_id/fees-deposits',
            '/application/:application_id/screening',
            '/application/:application_id/application-complete',
        ]);
    });
    it('doesnt show income-employment page if enable_automatic_income_verification=false', () => {
        const pages = selectors.selectOrderedRoutes({
            configuration: {
                enable_automatic_income_verification: false,
                collect_employer_information: false,
            },
            renterProfile: {
                co_applicants: null,
                occupants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(pages).toEqual([
            '/application/:application_id/address',
            '/application/:application_id/lease-terms',
            '/application/:application_id/rental-profile/options',
            '/application/:application_id/fees-deposits',
            '/application/:application_id/screening',
            '/application/:application_id/application-complete',
        ]);
    });
});

describe('selectInitialPage', () => {
    it('computes initial page based on profile data', () => {
        let initialPage;
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: false,
            },
            renterProfile: {
                co_applicants: null,
                occupants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.LEASE_TERMS, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: false,
            },
            renterProfile: {
                unit_available: false,
                co_applicants: null,
                occupants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED }],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.UNIT_UNAVAILABLE, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: false,
            },
            renterProfile: {
                unit_available: true,
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: MILESTONE_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED, application: 12 }],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.INCOME_VERIFICATION_SUMMARY, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: false,
            },
            renterProfile: {
                unit_available: true,
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: MILESTONE_APPLICANT_NEEDS_TO_REAGREE_TO_HD, application: 12 },
                    { event: MILESTONE_LEASE_VOIDED, application: 12 },
                    { event: APPLICATION_STATUS_APPROVED, application: 12 },
                    { event: APPLICATION_STATUS_CONDITIONALLY_APPROVED, application: 12 },
                ],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                unit_available: true,
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                events: [{ event: MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED }],
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.INCOME_VERIFICATION_SUMMARY, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                occupants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 }],
            },
        });

        expect(initialPage).toEqual(generatePath(ROUTES.PROFILE_OPTIONS, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: [{ name: 'bob' }],
                pets: [
                    { name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog' },
                    { name: 'garfield', pet_type: 'Cat' },
                ],
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_PET_ADDED, application: 12 },
                ],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.INCOME_VERIFICATION_CONNECT, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: false,
            },
            renterProfile: {
                co_applicants: null,
                pets: [
                    { name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog' },
                    { name: 'garfield', pet_type: 'Cat' },
                ],
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED, application: 12 },
                ],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.FEES_AND_DEPOSITS, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                pets: [
                    { name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog' },
                    { name: 'garfield', pet_type: 'Cat' },
                ],
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED, application: 12 },
                ],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.INCOME_VERIFICATION_CONNECT, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: false,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED, application: 12 },
                ],
                receipt: { id: 123 },
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.SCREENING, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED, application: 12 },
                    { event: MILESTONE_APPLICANT_SUBMITTED, application: 12 },
                ],
                outstanding_balances: [],
                receipt: { id: 123 },
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.APP_COMPLETE, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED, application: 12 },
                    { event: MILESTONE_APPLICATION_FEE_COMPLETED, application: 12 },
                ],
                outstanding_balances: [
                    { receipt: 123, paid: false },
                    { receipt: 1234, paid: false },
                ],
                receipt: { id: 123 },
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.OUTSTANDING_BALANCE, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_APPROVED,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                ],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.APP_APPROVED, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_CONDITIONALLY_APPROVED,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                ],
            },
        });

        expect(initialPage).toEqual(generatePath(ROUTES.APP_APPROVED, { application_id: 12 }));
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_CONDITIONALLY_APPROVED,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                ],
            },
        });

        expect(initialPage).toEqual(generatePath(ROUTES.LEASE_SIGNED, { application_id: 12 }));
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_COMPLETED,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                ],
            },
        });

        expect(initialPage).toEqual(generatePath(ROUTES.LEASE_EXECUTED, { application_id: 12 }));
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_CANCELLED,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                ],
            },
        });

        expect(initialPage).toEqual(generatePath(ROUTES.APP_CANCELLED, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_DENIED,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED, application: 12 },
                ],
            },
        });

        expect(initialPage).toEqual(generatePath(ROUTES.APP_DENIED, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: APPLICANT_EVENTS.MILESTONE_LEASE_VOIDED, application: 12 }],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.LEASE_VOIDED, { application_id: 12 }));

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                events: [{ event: MILESTONE_REQUEST_GUARANTOR }],
                id: 12,
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED, application: 12 }],
            },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.GUARANTOR_REQUESTED, { application_id: 12 }));
    });

    it('selects direct route correctly', () => {
        delete window.location;
        window.location = {
            pathname: '/application/12/payment-details',
        };
        const initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                occupants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.PAYMENT_DETAILS, { application_id: 12 }));
    });
});

describe('select default initial page', () => {
    it('selects default initial page correctly, ignoring direct route', () => {
        delete window.location;
        window.location = {
            pathname: '/payment-details',
        };
        const initialPage = selectors.selectDefaultInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            renterProfile: {
                co_applicants: null,
                occupants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                id: 12,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(initialPage).toEqual(generatePath(ROUTES.LEASE_TERMS, { application_id: 12 }));
    });
});

describe('fetch renter profile', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);

    it('dispatches the correct actions', () => {
        const store = mockStore({ renterProfile: {} });
        const profile = {
            id: 123,
        };

        API.fetchRenterProfile = jest.fn().mockReturnValue(
            Promise.resolve({
                profile,
            })
        );

        return store.dispatch(fetchRenterProfile()).then(() => {
            expect(store.getActions()).toEqual([
                renterProfileReceived({ profile }),
                filterRentalOptionsByUnit({ profile }),
            ]);
        });
    });
});

describe('selectUnit', () => {
    it('should return null when no renter profile', () => {
        const actual = selectors.selectUnit({});
        expect(actual).toBeUndefined();
    });

    it('should return the unit when profile loaded', () => {
        const unit = { unit_number: '1B' };
        const actual = selectors.selectUnit({
            renterProfile: { unit },
        });
        expect(actual).toBe(unit);
    });
});

describe('selectDefaultBankingPage', () => {
    it("returns connect page if applicant hasn't provided any income yet", () => {
        const bankingPage = selectors.selectDefaultBankingPage({
            applicant: {},
            application: {
                events: [],
            },
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            banking: {
                asset_sources: [],
                income_sources: [],
                reported_no_income_assets: false,
            },
        });

        expect(bankingPage).toBe(ROUTES.INCOME_VERIFICATION_CONNECT);
    });

    it('returns connect page if agent requested income', () => {
        const bankingPage = selectors.selectDefaultBankingPage({
            applicant: {},
            application: {
                events: [{ event: MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED }],
            },
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            banking: {
                asset_sources: [],
                income_sources: [],
                reported_no_income_assets: false,
            },
        });

        expect(bankingPage).toBe(ROUTES.INCOME_VERIFICATION_CONNECT);
    });

    it('returns summary page if agent requested income and assets were submitted', () => {
        const bankingPage = selectors.selectDefaultBankingPage({
            applicant: {},
            application: {
                events: [{ event: MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED }],
            },
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            banking: {
                asset_sources: [{ id: 1 }, { id: 2 }],
                income_sources: [],
                reported_no_income_assets: false,
            },
        });

        expect(bankingPage).toBe(ROUTES.INCOME_VERIFICATION_SUMMARY);
    });

    it('returns summary page if agent requested income and income was submitted', () => {
        const bankingPage = selectors.selectDefaultBankingPage({
            applicant: {},
            application: {
                events: [{ event: MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED }],
            },
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            banking: {
                asset_sources: [],
                income_sources: [{ id: 1 }, { id: 2 }],
                reported_no_income_assets: false,
            },
        });

        expect(bankingPage).toBe(ROUTES.INCOME_VERIFICATION_SUMMARY);
    });

    it('returns summary page if employee page disabled in configuration', () => {
        const bankingPage = selectors.selectDefaultBankingPage({
            applicant: {
                events: [],
            },
            application: {
                events: [],
            },
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: false,
            },
            banking: {
                asset_sources: [{ id: 1 }, { id: 2 }],
                income_sources: [{ id: 1 }, { id: 2 }],
                reported_no_income_assets: false,
            },
        });

        expect(bankingPage).toBe(ROUTES.INCOME_VERIFICATION_SUMMARY);
    });

    it('returns summary page if employee page already submitted', () => {
        const bankingPage = selectors.selectDefaultBankingPage({
            applicant: {
                events: [{ event: APPLICANT_EVENTS.EVENT_APPLICANT_UPDATED_EMPLOYER_INFO }],
            },
            application: {
                events: [],
            },
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            banking: {
                asset_sources: [{ id: 1 }, { id: 2 }],
                income_sources: [{ id: 1 }, { id: 2 }],
                reported_no_income_assets: false,
            },
        });

        expect(bankingPage).toBe(ROUTES.INCOME_VERIFICATION_SUMMARY);
    });

    it('returns summary page if reported no income', () => {
        const bankingPage = selectors.selectDefaultBankingPage({
            applicant: {
                events: [{ event: APPLICANT_EVENTS.EVENT_INCOME_REPORTED_NONE }],
            },
            application: {
                events: [],
            },
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            banking: {
                asset_sources: [],
                income_sources: [],
                reported_no_income_assets: true,
            },
        });

        expect(bankingPage).toBe(ROUTES.INCOME_VERIFICATION_SUMMARY);
    });

    it('returns employee page if none of the previous conditions is met', () => {
        const bankingPage = selectors.selectDefaultBankingPage({
            applicant: {
                events: [],
            },
            application: {
                events: [],
            },
            configuration: {
                enable_automatic_income_verification: true,
                collect_employer_information: true,
            },
            banking: {
                asset_sources: [{ id: 1 }, { id: 2 }],
                income_sources: [{ id: 1 }, { id: 2 }],
                reported_no_income_assets: false,
            },
        });

        expect(bankingPage).toBe(ROUTES.EMPLOYER_DETAILS);
    });
});
