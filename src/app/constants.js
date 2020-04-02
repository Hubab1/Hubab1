export const HELLOSIGN_TEST_MODE = process.env.REACT_APP_HELLOSIGN_TEST_MODE === 'yes';

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
    LEASE_SIGNED: '/lease-signed',
    LEASE_EXECUTED: '/lease-executed',
    APP_DENIED: '/application-denied',
    TERMS: '/terms',
};

export const ROUTE_LABELS = {
    [ROUTES.ADDRESS]: 'Current Address',
    [ROUTES.LEASE_TERMS]: 'Lease Terms',
    [ROUTES.PROFILE_OPTIONS]: 'Rental Profile',
    [ROUTES.INCOME_AND_EMPLOYMENT]: 'Income & Employment',
    [ROUTES.FEES_AND_DEPOSITS]: 'Fees & Deposits',
    [ROUTES.SCREENING]: 'Screening',
    [ROUTES.APP_COMPLETE]: 'Application Complete',
};

export const LEASE_TERMS_IDENTIFIER = 'lease_terms';
export const RENTER_PROFILE_IDENTIFIER = 'renter_profile';

export const REPORT_POLL_INTERVAL = 10000;

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_vWO9q0lWvTCjPSq2FKMQeTpv00zsjtEm5j';
export const HELLOSIGN_CLIENT_ID = '530b26fda96d75b4abef002d9876fb7c';

export const ROLE_PRIMARY_APPLICANT = 'primary_applicant';
export const ROLE_CO_APPLICANT = 'co_applicant';
export const ROLE_GUARANTOR = 'guarantor';

export const SMS_OPT_IN_MARKETING_ENABLED = 5;

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
export const MILESTONE_APPLICANT_SIGNED_LEASE = 240;
export const MILESTONE_LEASE_SENT = 270;

export const APPLICATION_STATUS_APPROVED = 10;
export const APPLICATION_STATUS_DENIED = 15;
export const APPLICATION_STATUS_COMPLETED = 25;
export const APPLICATION_STATUS_CONDITIONALLY_APPROVED = 30;

export const APPLICATION_EVENTS = {
    EVENT_APPLICANT_REGISTERED, EVENT_LEASE_TERMS_COMPLETED, EVENT_RENTAL_OPTIONS_SELECTED, EVENT_RENTAL_OPTIONS_NOT_SELECTED, EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED,
    EVENT_RENTAL_OPTIONS_GUARANTOR_INVITED, EVENT_RENTAL_OPTIONS_PET_ADDED, EVENT_INCOME_REPORTS_GENERATED, EVENT_APPLICATION_FEE_PAID,
    EVENT_SCREENING_COMPLETED, MILESTONE_APPLICANT_SIGNED_LEASE
};

export const APPLICATION_STATUSES = {
    APPLICATION_STATUS_APPROVED, APPLICATION_STATUS_CONDITIONALLY_APPROVED, APPLICATION_STATUS_COMPLETED, APPLICATION_STATUS_DENIED,
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
