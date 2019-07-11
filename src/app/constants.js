export const community = {
    name: '555 Waverly'
};

export const ROUTES = {
    COMMUNITY: '/',
    WELCOME: '/welcome',
    LOGIN: '/login',
    SIGNUP: '/signup',
    TOS: '/terms',
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
    APPLICATION_FEE: '/application-fee',
    FINAL_DETAILS: '/final-details',
    APP_STATUS: '/app-status',
}

export const NAV_ROUTES = [
    {name: 'Tell Us More', value: ROUTES.TELL_US_MORE},
    {name: 'Profile', value: ROUTES.PROFILE_OPTIONS},
    {name: 'Co-applicants', value: ROUTES.CO_APPLICANTS},
    {name: 'Guarantor', value: ROUTES.GUARANTOR},
    {name: 'Pets', value: ROUTES.PETS},
    {name: 'Bank', value: ROUTES.CONNECT_BANK},
    {name: 'Application Fee', value: ROUTES.APPLICATION_FEE},
    {name: 'Final Application Details', value: ROUTES.FINAL_DETAILS},
];

export const BASE_ROUTES = [
    ROUTES.TELL_US_MORE, ROUTES.PROFILE_OPTIONS
]

export const REPORT_POLL_INTERVAL = 10000;

export const STRIPE_PUBLISHABLE_KEY = 'pk_4AdNDrVeXsxO8PMCl5qUsMP7N719q'

export const ROLE_PRIMARY_APPLICANT = 'primary_applicant';
export const ROLE_CO_APPLICANT = 'co_applicant';
export const ROLE_GUARANTOR = 'guarantor';
