export const community = {
    name: '555 Waverly'
};

export const ROUTES = {
    COMMUNITY: '/',
    WELCOME: '/welcome',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PASSWORD: '/password',
    TELL_US_MORE: '/additional-info',
    FORGOT_PASSWORD: '/password/forgot',
    VERIFY_PASSWORD_CODE: '/password/verify',
    RESET_PASSWORD: '/password/reset',
    PROFILE: '/profile',
    PROFILE_OPTIONS: '/profile/options',
    GUARANTOR: '/profile/guarantor',
    PARKING: '/parking/parking',
    PETS: '/profile/pets',
    CO_APPLICANTS: '/profile/invite-coapplicants',
    CONNECT_BANK: '/connect-bank',
    MANUAL_INCOME_ENTRY: '/manual-income-entry',
    PAYMENT_OPTIONS: '/payment-options',
    APPLICATION_FEE: '/application-fee',
    FINAL_DETAILS: '/final-details',
    APP_STATUS: '/app-status',
    LEASE_TERMS: '/lease-terms'
}

export const NAV_ROUTES = [
    {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
    {name: 'Tell Us More', value: ROUTES.TELL_US_MORE},
    {name: 'Profile', value: ROUTES.PROFILE_OPTIONS},
    {name: 'Co-applicants', value: ROUTES.CO_APPLICANTS},
    {name: 'Guarantor', value: ROUTES.GUARANTOR},
    {name: 'Pets', value: ROUTES.PETS},
    {name: 'Bank', value: ROUTES.CONNECT_BANK},
    {name: 'Payment Options', value: ROUTES.PAYMENT_OPTIONS},
    {name: 'Application Fee', value: ROUTES.APPLICATION_FEE},
    {name: 'Final Application Details', value: ROUTES.FINAL_DETAILS},
    {name: 'Application Status', value: ROUTES.APP_STATUS}
];

export const BASE_ROUTES = [
    ROUTES.LEASE_TERMS, ROUTES.TELL_US_MORE, ROUTES.PROFILE_OPTIONS
]

export const REPORT_POLL_INTERVAL = 10000;

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_vWO9q0lWvTCjPSq2FKMQeTpv00zsjtEm5j'

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

export const MILESTONE_RENTAL_PROFILE_COMPLETED = 200;
export const MILESTONE_INCOME_COMPLETED = 210;
export const MILESTONE_APPLICATION_FEE_COMPLETED = 215;


export const APPLICATION_EVENTS = {
    EVENT_APPLICANT_REGISTERED, EVENT_RENTAL_OPTIONS_SELECTED, EVENT_RENTAL_OPTIONS_NOT_SELECTED, EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED,
    EVENT_RENTAL_OPTIONS_GUARANTOR_INVITED, EVENT_RENTAL_OPTIONS_PET_ADDED, EVENT_INCOME_REPORTS_GENERATED, EVENT_APPLICATION_FEE_PAID
};
