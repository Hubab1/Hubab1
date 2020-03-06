import { selectors } from 'reducers/renter-profile';
import {
    ROUTES,
    APPLICATION_EVENTS,
    ROLE_PRIMARY_APPLICANT,
    MILESTONE_APPLICANT_SUBMITTED,
    APPLICATION_STATUS_APPROVED, APPLICATION_STATUS_CONDITIONALLY_APPROVED, APPLICATION_STATUS_COMPLETED
} from 'app/constants';


describe('selectInitialPage', () => {
    it('computes initial page based on profile data', () => {
        let initialPage;
        initialPage = selectors.selectInitialPage({
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
            renterProfile: {
                co_applicants: [{name: 'bob'}],
                pets: [{name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog'}, {name: 'garfield', pet_type: 'Cat'}],
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_PET_ADDED}]}
        });
        expect(initialPage).toEqual(ROUTES.INCOME_AND_EMPLOYMENT);

        initialPage = selectors.selectInitialPage({
            renterProfile: {
                co_applicants: null,
                pets: [{name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog'}, {name: 'garfield', pet_type: 'Cat'}],
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_LEASE_TERMS_COMPLETED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}, {event: APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED}]}
        });
        expect(initialPage).toEqual(ROUTES.FEES_AND_DEPOSITS);

        initialPage = selectors.selectInitialPage({
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
    });
});
