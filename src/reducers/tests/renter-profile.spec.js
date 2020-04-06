import { APPLICATION_EVENTS, APPLICATION_STATUS_APPROVED, APPLICATION_STATUS_COMPLETED, APPLICATION_STATUS_CONDITIONALLY_APPROVED, MILESTONE_APPLICANT_SUBMITTED, ROLE_PRIMARY_APPLICANT, ROLE_CO_APPLICANT, ROUTES, APPLICATION_STATUS_CANCELED } from 'app/constants';
import { selectors } from 'reducers/renter-profile';

describe('selectNav', () => {
    it('Builds list of nav routes and label objects', () => {
        const pages = selectors.selectNav({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: []}
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


describe('selectOrderedRoutes', () => {
    it('Shows correct pages for primary applicant', () => {
        const pages = selectors.selectOrderedRoutes({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: []}
        });
        expect(pages).toEqual([
            '/address',
            '/lease-terms',
            '/rental-profile/options',
            '/income-employment',
            '/fees-deposits',
            '/screening',
            '/application-complete'
        ]);
    });
    it('Shows correct pages for secondary applicants', () => {
        const pages = selectors.selectOrderedRoutes({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_CO_APPLICANT, address_street: 'some street', events: []}
        });
        expect(pages).toEqual([
            '/address',
            '/lease-terms',
            '/income-employment',
            '/fees-deposits',
            '/screening',
            '/application-complete'
        ]);
    });
    it('doesnt show income-employment page if enable_automatic_income_verification=false', () => {
        const pages = selectors.selectOrderedRoutes({
            configuration: {
                enable_automatic_income_verification: false,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: []}
        });
        expect(pages).toEqual([
            '/address',
            '/lease-terms',
            '/rental-profile/options',
            '/fees-deposits',
            '/screening',
            '/application-complete'
        ]);
    });
});


describe('selectInitialPage', () => {
    it('computes initial page based on profile data', () => {
        let initialPage;
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: []}
        });
        expect(initialPage).toEqual(ROUTES.LEASE_TERMS);
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}]}
        });
        expect(initialPage).toEqual(ROUTES.PROFILE_OPTIONS);

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: [{name: 'bob'}],
                pets: [{name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog'}, {name: 'garfield', pet_type: 'Cat'}],
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_PET_ADDED}]}
        });
        expect(initialPage).toEqual(ROUTES.INCOME_AND_EMPLOYMENT);

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                pets: [{name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog'}, {name: 'garfield', pet_type: 'Cat'}],
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}, {event: APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED}]}
        });
        expect(initialPage).toEqual(ROUTES.FEES_AND_DEPOSITS);

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}, {event: APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED}], receipt: {id: 123}}
        });
        expect(initialPage).toEqual(ROUTES.SCREENING);

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}, {event: APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED}, {event: MILESTONE_APPLICANT_SUBMITTED}], receipt: {id: 123}}
        });
        expect(initialPage).toEqual(ROUTES.APP_COMPLETE);

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_APPROVED,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}]},
        });
        expect(initialPage).toEqual(ROUTES.APP_APPROVED);

        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_CONDITIONALLY_APPROVED,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}]},
        });
        expect(initialPage).toEqual(ROUTES.APP_APPROVED);
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_CONDITIONALLY_APPROVED,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE}, {event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}]},
        });
        expect(initialPage).toEqual(ROUTES.LEASE_SIGNED);
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_COMPLETED,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE}, {event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}]},
        });
        expect(initialPage).toEqual(ROUTES.LEASE_EXECUTED);
        initialPage = selectors.selectInitialPage({
            configuration: {
                enable_automatic_income_verification: true,
            },
            renterProfile: {
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
                status: APPLICATION_STATUS_CANCELED,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE}, {event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}]},
        });
        expect(initialPage).toEqual(ROUTES.APP_CANCELLED);
    });
});
