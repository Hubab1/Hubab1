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
} from 'app/constants';
import { fetchRenterProfile, renterProfileReceived, selectors } from 'reducers/renter-profile';
import { filterRentalOptionsByUnit } from 'reducers/configuration';
import API from '../../app/api';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

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
                value: '/address',
            },
            {
                name: 'Lease Terms',
                value: '/lease-terms',
            },
            {
                name: 'Rental Profile',
                value: '/rental-profile/options',
            },
            {
                name: 'Income & Employment',
                value: '/income-employment',
            },
            {
                name: 'Fees & Deposits',
                value: '/fees-deposits',
            },
            {
                name: 'Screening',
                value: '/screening',
            },
            {
                name: 'Application Complete',
                value: '/application-complete',
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
        const accessible = selectors.canAccessRoute(state, ROUTES.ADDRESS);
        expect(accessible).toBe(true);
    });
    // completed page + 1 accessible
    it('lease terms page is accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.LEASE_TERMS);
        expect(accessible).toBe(true);
    });
    // completed page + 2 inaccessible
    it('renter profile page is not accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.PROFILE_OPTIONS);
        expect(accessible).toBe(false);
    });
    it('payment details page is not accessible', () => {
        const accessible = selectors.canAccessRoute(state, ROUTES.PAYMENT_DETAILS);
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
            '/address',
            '/lease-terms',
            '/rental-profile/options',
            '/income-employment',
            '/fees-deposits',
            '/screening',
            '/application-complete',
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
            '/address',
            '/lease-terms',
            '/income-employment',
            '/fees-deposits',
            '/screening',
            '/application-complete',
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
            '/address',
            '/lease-terms',
            '/rental-profile/options',
            '/fees-deposits',
            '/screening',
            '/application-complete',
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
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(initialPage).toEqual(ROUTES.LEASE_TERMS);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED }],
            },
        });
        expect(initialPage).toEqual(ROUTES.UNIT_UNAVAILABLE);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: MILESTONE_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED }],
            },
        });
        expect(initialPage).toEqual(ROUTES.INCOME_AND_EMPLOYMENT);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: MILESTONE_APPLICANT_NEEDS_TO_REAGREE_TO_HD },
                    { event: MILESTONE_LEASE_VOIDED },
                    { event: APPLICATION_STATUS_APPROVED },
                    { event: APPLICATION_STATUS_CONDITIONALLY_APPROVED },
                ],
            },
        });
        expect(initialPage).toEqual(ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [],
            },
        });
        expect(initialPage).toEqual(ROUTES.INCOME_AND_EMPLOYMENT);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED }],
            },
        });
        expect(initialPage).toEqual(ROUTES.PROFILE_OPTIONS);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_PET_ADDED },
                ],
            },
        });
        expect(initialPage).toEqual(ROUTES.INCOME_AND_EMPLOYMENT);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED },
                ],
            },
        });
        expect(initialPage).toEqual(ROUTES.FEES_AND_DEPOSITS);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED },
                ],
            },
        });
        expect(initialPage).toEqual(ROUTES.INCOME_AND_EMPLOYMENT);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED },
                ],
                receipt: { id: 123 },
            },
        });
        expect(initialPage).toEqual(ROUTES.SCREENING);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED },
                    { event: MILESTONE_APPLICANT_SUBMITTED },
                ],
                outstanding_balances: [],
                receipt: { id: 123 },
            },
        });
        expect(initialPage).toEqual(ROUTES.APP_COMPLETE);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                    { event: APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED },
                    { event: MILESTONE_APPLICATION_FEE_COMPLETED },
                ],
                outstanding_balances: [
                    { receipt: 123, paid: false },
                    { receipt: 1234, paid: false },
                ],
                receipt: { id: 123 },
            },
        });
        expect(initialPage).toEqual(ROUTES.OUTSTANDING_BALANCE);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                ],
            },
        });
        expect(initialPage).toEqual(ROUTES.APP_APPROVED);

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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                ],
            },
        });

        expect(initialPage).toEqual(ROUTES.APP_APPROVED);
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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE },
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                ],
            },
        });

        expect(initialPage).toEqual(ROUTES.LEASE_SIGNED);
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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE },
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                ],
            },
        });

        expect(initialPage).toEqual(ROUTES.LEASE_EXECUTED);
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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [
                    { event: APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE },
                    { event: APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED },
                    { event: APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED },
                ],
            },
        });

        expect(initialPage).toEqual(ROUTES.APP_CANCELLED);
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
            },
            applicant: {
                role: ROLE_PRIMARY_APPLICANT,
                address_street: 'some street',
                events: [{ event: APPLICANT_EVENTS.MILESTONE_LEASE_VOIDED }],
            },
        });
        expect(initialPage).toEqual(ROUTES.LEASE_VOIDED);
    });

    it('selects direct route correctly', () => {
        delete window.location;
        window.location = {
            pathname: '/payment-details',
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
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(initialPage).toEqual(ROUTES.PAYMENT_DETAILS);
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
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [] },
        });
        expect(initialPage).toEqual(ROUTES.LEASE_TERMS);
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
