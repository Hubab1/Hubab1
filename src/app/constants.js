export const community = {
    name: '555 Waverly'
};

export const ROUTES = {
    COMMUNITY: '/',
    WELCOME: '/welcome',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PASSWORD: '/password',
    PROFILE: '/profile',
    FORGOT_PASSWORD: '/password/forgot',
    VERIFY_PASSWORD_CODE: '/password/verify',
    RESET_PASSWORD: '/password/reset',
    RENTAL_PROFILE: '/rental-profile',
    PROFILE_OPTIONS: '/rental-profile/options',
    GUARANTOR: '/rental-profile/invite-guarantor',
    PARKING: '/parking/parking',
    PETS: '/rental-profile/pets',
    CO_APPLICANTS: '/rental-profile/invite-roommates',
    INCOME_AND_EMPLOYMENT: '/income-employment',
    MANUAL_INCOME_ENTRY: '/manual-income-entry',
    FEES_AND_DEPOSITS: '/fees-deposits',
    SCREENING: '/screening',
    APP_COMPLETE: '/application-complete',
    LEASE_TERMS: '/lease-terms',
    PAYMENT_TERMS: '/payment-terms'
}

export const NAV_ROUTES = [
    {name: 'Your Profile', value: ROUTES.PROFILE},
    {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
    {name: 'Rental Profile', value: ROUTES.PROFILE_OPTIONS, subRoutes: [
        {name: 'Roommates', value: ROUTES.CO_APPLICANTS},
        {name: 'Guarantor', value: ROUTES.GUARANTOR},
        {name: 'Pets', value: ROUTES.PETS},
    ]},
    {name: 'Income & Employment', value: ROUTES.INCOME_AND_EMPLOYMENT},
    {name: 'Fees & Deposits', value: ROUTES.FEES_AND_DEPOSITS},
    {name: 'Screening', value: ROUTES.SCREENING},
    {name: 'Application Complete', value: ROUTES.APP_COMPLETE}
];

export const routeToOptionName = {
    [ROUTES.CO_APPLICANTS]: 'co_applicants', [ROUTES.GUARANTOR]: 'guarantor', [ROUTES.PETS]: 'pets'
}

export const BASE_ROUTES = [
    ROUTES.PROFILE, ROUTES.LEASE_TERMS, ROUTES.PROFILE_OPTIONS
]

export const REPORT_POLL_INTERVAL = 10000;

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_vWO9q0lWvTCjPSq2FKMQeTpv00zsjtEm5j';

export const ROLE_PRIMARY_APPLICANT = 'primary_applicant';
export const ROLE_CO_APPLICANT = 'co_applicant';
export const ROLE_GUARANTOR = 'guarantor';

// event constants used for navigation
export const EVENT_APPLICANT_REGISTERED = 5;

export const EVENT_RENTAL_OPTIONS_SELECTED = 10;
export const EVENT_RENTAL_OPTIONS_NOT_SELECTED = 15;
export const EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED = 20;
export const EVENT_RENTAL_OPTIONS_GUARANTOR_INVITED = 30;
export const EVENT_RENTAL_OPTIONS_PET_ADDED = 40;

export const EVENT_INCOME_REPORTS_GENERATED = 45;
export const EVENT_APPLICATION_FEE_PAID = 50;

export const EVENT_SCREENING_COMPLETED = 60;

export const MILESTONE_RENTAL_PROFILE_COMPLETED = 200;
export const MILESTONE_INCOME_COMPLETED = 210;
export const MILESTONE_APPLICATION_FEE_COMPLETED = 215;
export const MILESTONE_SCREENING_COMPLETED = 220;


export const APPLICATION_EVENTS = {
    EVENT_APPLICANT_REGISTERED, EVENT_RENTAL_OPTIONS_SELECTED, EVENT_RENTAL_OPTIONS_NOT_SELECTED, EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED,
    EVENT_RENTAL_OPTIONS_GUARANTOR_INVITED, EVENT_RENTAL_OPTIONS_PET_ADDED, EVENT_INCOME_REPORTS_GENERATED, EVENT_APPLICATION_FEE_PAID,
    EVENT_SCREENING_COMPLETED
};
