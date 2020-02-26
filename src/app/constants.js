export const community = {
    name: '555 Waverly'
};

export const ROUTES = {
    COMMUNITY: '/',
    WELCOME: '/welcome',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PASSWORD: '/password',
    ADDRESS: '/address',
    FORGOT_PASSWORD: '/password/forgot',
    VERIFY_PASSWORD_CODE: '/password/verify',
    RESET_PASSWORD: '/password/reset',
    RENTAL_PROFILE: '/rental-profile',
    PROFILE_OPTIONS: '/rental-profile/options',
    GUARANTOR: '/rental-profile/invite-guarantor',
    PARKING: '/rental-profile/parking',
    PETS: '/rental-profile/pets',
    STORAGE: '/rental-profile/storage',
    CO_APPLICANTS: '/rental-profile/invite-roommates',
    INCOME_AND_EMPLOYMENT: '/income-employment',
    MANUAL_INCOME_ENTRY: '/manual-income-entry',
    FEES_AND_DEPOSITS: '/fees-deposits',
    SCREENING: '/screening',
    APP_COMPLETE: '/application-complete',
    LEASE_TERMS: '/lease-terms',
    PAYMENT_TERMS: '/payment-terms',
    ACCOUNT: '/account',
    RESEND_INVITE: '/resend-invite',
    APP_APPROVED: '/application-approved',
};

export const NAV_ROUTES = [
    {name: 'Current Address', value: ROUTES.ADDRESS},
    {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
    {name: 'Rental Profile', value: ROUTES.PROFILE_OPTIONS},
    {name: 'Income & Employment', value: ROUTES.INCOME_AND_EMPLOYMENT},
    {name: 'Fees & Deposits', value: ROUTES.FEES_AND_DEPOSITS},
    {name: 'Screening', value: ROUTES.SCREENING},
    {name: 'Application Complete', value: ROUTES.APP_COMPLETE},
];

export const BASE_ROUTES = [
    ROUTES.ADDRESS, ROUTES.LEASE_TERMS, ROUTES.PROFILE_OPTIONS
];

export const LEASE_TERMS_IDENTIFIER = 'lease_terms';
export const RENTER_PROFILE_IDENTIFIER = 'renter_profile';

export const REPORT_POLL_INTERVAL = 10000;

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_vWO9q0lWvTCjPSq2FKMQeTpv00zsjtEm5j';

export const ROLE_PRIMARY_APPLICANT = 'primary_applicant';
export const ROLE_CO_APPLICANT = 'co_applicant';
export const ROLE_GUARANTOR = 'guarantor';

// event constants used for navigation
export const EVENT_APPLICANT_REGISTERED = 5;
export const EVENT_LEASE_TERMS_COMPLETED = 6;

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
export const MILESTONE_APPLICANT_SUBMITTED = 220;

export const APPLICATION_STATUS_APPROVED = 10;
export const APPLICATION_STATUS_CONDITIONALLY_APPROVED = 30;

export const APPLICATION_EVENTS = {
    EVENT_APPLICANT_REGISTERED, EVENT_LEASE_TERMS_COMPLETED, EVENT_RENTAL_OPTIONS_SELECTED, EVENT_RENTAL_OPTIONS_NOT_SELECTED, EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED,
    EVENT_RENTAL_OPTIONS_GUARANTOR_INVITED, EVENT_RENTAL_OPTIONS_PET_ADDED, EVENT_INCOME_REPORTS_GENERATED, EVENT_APPLICATION_FEE_PAID,
    EVENT_SCREENING_COMPLETED
};

export const APPLICATION_STATUSES = {
    APPLICATION_STATUS_APPROVED, APPLICATION_STATUS_CONDITIONALLY_APPROVED,
};

// payments constants
export const LINE_ITEM_TYPE_APPLICATION_FEE = 10;
export const LINE_ITEM_TYPE_HOLDING_DEPOSIT = 20;


// applicant status constants
export const CO_APPLICANT_STATUS_NOT_STARTED = 'Not Started';
export const CO_APPLICANT_STATUS_IN_PROGRESS = 'In Progress';
export const CO_APPLICANT_STATUS_COMPLETED = 'Completed';

export const APPLICANT_STATUS_COLOR_MAP = {
    [CO_APPLICANT_STATUS_NOT_STARTED]: '#DB5963',
    [CO_APPLICANT_STATUS_IN_PROGRESS]: '#FAC700',
    [CO_APPLICANT_STATUS_COMPLETED]: '#67C18B',
};

// pets constants

export const RENTAL_OPTIONS_PETS_DOGS = 'pets-dogs';
export const RENTAL_OPTIONS_PETS_CATS = 'pets-cats';
export const RENTAL_OPTIONS_PETS_OTHER = 'pets-other';
export const PET_DOG_LABEL = 'Dog';
export const PET_CAT_LABEL = 'Cat';
export const PET_OTHER_LABEL = 'Other';

export const PET_RENTAL_OPTION_TYPE_TO_LABEL_MAP = {
    [RENTAL_OPTIONS_PETS_DOGS]: PET_DOG_LABEL,
    [RENTAL_OPTIONS_PETS_CATS]: PET_CAT_LABEL,
    [RENTAL_OPTIONS_PETS_OTHER]: PET_OTHER_LABEL,
};

export const RENTER_PROFILE_TYPE_CO_APPLICANTS = 'co_applicants';
export const RENTER_PROFILE_TYPE_GUARANTOR = 'guarantor';
export const RENTER_PROFILE_TYPE_PETS = 'pets';
export const RENTER_PROFILE_TYPE_PARKING = 'parking';
export const RENTER_PROFILE_TYPE_STORAGE = 'storage';
