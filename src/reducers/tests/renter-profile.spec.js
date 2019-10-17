import { selectors } from 'reducers/renter-profile';
import { ROUTES, APPLICATION_EVENTS, ROLE_PRIMARY_APPLICANT, MILESTONE_APPLICATION_SUBMITTED } from 'app/constants';


describe('selectInitialPage', () => {
    it('computes initial page based on profile data', () => {
        const configuration = {
            rental_options_config: {
                co_applicants: {limit: 3},
                guarantor: {limit: 3},
                pets: {limit: 3}
            }
        };
        let initialPage;
        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: ['co_applicants', 'pets'],
                co_applicants: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED}]}
        });
        expect(initialPage).toEqual(ROUTES.CO_APPLICANTS);
        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: ['co_applicants', 'pets'],
                co_applicants: [{name: 'bob'}],
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED}]}
        });
        expect(initialPage).toEqual(ROUTES.PETS);
        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: ['co_applicants', 'pets'],
                co_applicants: [{name: 'bob'}],
                pets: [{name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog'}, {name: 'garfield', pet_type: 'Cat'}],
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_PET_ADDED}]}
        });
        expect(initialPage).toEqual(ROUTES.INCOME_AND_EMPLOYMENT);

        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: ['guarantor', 'pets'],
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED}, {event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_PET_ADDED}]}
        });

        expect(initialPage).toEqual(ROUTES.GUARANTOR);

        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: [],
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: []}
        });
        expect(initialPage).toEqual(ROUTES.PROFILE_OPTIONS);

        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: [],
                co_applicants: null,
                pets: [{name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog'}, {name: 'garfield', pet_type: 'Cat'}],
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}, {event: APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED}]}
        });
        expect(initialPage).toEqual(ROUTES.FEES_AND_DEPOSITS);

        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: [],
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}, {event: APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED}], receipt: {id: 123}}
        });
        expect(initialPage).toEqual(ROUTES.SCREENING);

        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: [],
                co_applicants: null,
                guarantor: null,
                pets: null,
                lease_term: 6,
            },
            applicant: { role: ROLE_PRIMARY_APPLICANT, address_street: 'some street', events: [{event: APPLICATION_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED}, {event: APPLICATION_EVENTS.EVENT_INCOME_REPORTS_GENERATED}, {event: MILESTONE_APPLICATION_SUBMITTED}], receipt: {id: 123}}
        });
        expect(initialPage).toEqual(ROUTES.APP_COMPLETE);

    });
});