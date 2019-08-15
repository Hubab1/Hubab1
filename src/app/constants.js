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
    PAYMENT_OPTIONS: '/fees',
    APPLICATION_FEE: '/application-fee',
    SCREENING: '/screening',
    APP_COMPLETE: '/application-complete',
    LEASE_TERMS: '/lease-terms'
}

export const NAV_ROUTES = [
    {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
    {name: 'Your Profile', value: ROUTES.PROFILE},
    {name: 'Rental Profile', value: ROUTES.PROFILE_OPTIONS},
    {name: 'Roommates', value: ROUTES.CO_APPLICANTS},
    {name: 'Guarantor', value: ROUTES.GUARANTOR},
    {name: 'Pets', value: ROUTES.PETS},
    {name: 'Income & Employment', value: ROUTES.INCOME_AND_EMPLOYMENT},
    {name: 'Fees & Deposits', value: ROUTES.PAYMENT_OPTIONS},
    {name: 'Application Fee', value: ROUTES.APPLICATION_FEE},
    {name: 'Screening', value: ROUTES.SCREENING},
    {name: 'Application Complete', value: ROUTES.APP_COMPLETE}
];

export const BASE_ROUTES = [
    ROUTES.LEASE_TERMS, ROUTES.PROFILE, ROUTES.PROFILE_OPTIONS
]

export const REPORT_POLL_INTERVAL = 10000;

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_vWO9q0lWvTCjPSq2FKMQeTpv00zsjtEm5j'

export const ROLE_PRIMARY_APPLICANT = 'primary_applicant';
export const ROLE_CO_APPLICANT = 'co_applicant';
export const ROLE_GUARANTOR = 'guarantor';
