export const community = {
    name: '555 Waverly',
};

export const ROUTES = {
    // Independent routes
    COMMUNITY: '/',
    WELCOME: '/welcome',
    LOGIN: '/login',
    SIGNUP: '/signup',
    ADDRESS: '/address',
    MANUAL_INCOME_ENTRY: '/manual-income-entry',
    FEES_AND_DEPOSITS: '/fees-deposits',
    HOLDING_DEPOSIT_AGREEMENT: '/holding-deposit-agreement', // For HelloSign HD Agreement
    HOLDING_DEPOSIT_TERMS_AGREEMENT: '/holding-deposit-terms-agreement', // For payment terms agreement
    SCREENING: '/screening',
    APP_COMPLETE: '/application-complete',
    LEASE_TERMS: '/lease-terms',
    OUTSTANDING_BALANCE: '/outstanding-balance',
    PAYMENT_TERMS: '/payment-terms',
    ACCOUNT: '/account',
    RESEND_INVITE: '/resend-invite',
    APP_APPROVED: '/application-approved',
    LEASE_SIGNED: '/lease-signed',
    LEASE_EXECUTED: '/lease-executed',
    APP_DENIED: '/application-denied',
    TERMS: '/terms',
    APP_CANCELLED: '/application-cancelled',
    LEASE_VOIDED: '/lease-voided',
    PRIVACY_POLICY: '/privacy-policy',
    FUNNEL_TERMS: '/funnel-terms',
    FAQ: '/faq',
    UNIT_UNAVAILABLE: '/unit-unavailable',
    UNAUTHENTICATED_UNIT_UNAVAILABLE: '/unauth-unit-unavailable',
    GUARANTOR_REQUESTED: '/guarantor_request',
    PAYMENT_DETAILS: '/payment-details',

    // Password related routes
    PASSWORD: '/password',
    FORGOT_PASSWORD: '/password/forgot',
    VERIFY_PASSWORD_CODE: '/password/verify',
    RESET_PASSWORD: '/password/reset',

    // Rental Profile related routes
    RENTAL_PROFILE: '/rental-profile',
    PROFILE_OPTIONS: '/rental-profile/options',
    GUARANTOR: '/rental-profile/invite-guarantor',
    PARKING: '/rental-profile/parking',
    PETS: '/rental-profile/pets',
    STORAGE: '/rental-profile/storage',
    WINE_COOLER: '/rental-profile/wine-cooler',
    CO_APPLICANTS: '/rental-profile/invite-roommates',
    EDIT_DEPENDANT: '/rental-profile/dependent/:id/edit',
    REMOVE_PERSON: '/rental-profile/:type/:id/remove',

    // Income and Employment related routes
    INCOME_AND_EMPLOYMENT: '/income-employment',
    BANKING: '/income-employment',
    INCOME_VERIFICATION_SUMMARY: '/income-employment/summary',
    MANUAL_INCOME_ENTRY_ADD_INCOME: '/income-employment/manual/add-income',
    MANUAL_ASSET_ENTRY_ADD_ASSET: '/income-employment/manual/add-asset',
    EDIT_MANUAL_FINANCIAL_SOURCE: '/income-employment/manual/financial-sources/:id/edit',
    REMOVE_FINANCIAL_SOURCE: '/income-employment/manual/financial-sources/:id/remove',
    EMPLOYER_DETAILS: '/income-employment/employer-details',

    // Applications
    APPLICATIONS: '/applications',
};

export const ROUTE_LABELS = {
    [ROUTES.ADDRESS]: 'Current Address',
    [ROUTES.LEASE_TERMS]: 'Lease Terms',
    [ROUTES.PROFILE_OPTIONS]: 'Rental Profile',
    [ROUTES.INCOME_AND_EMPLOYMENT]: 'Income & Employment',
    [ROUTES.FEES_AND_DEPOSITS]: 'Fees & Deposits',
    [ROUTES.HOLDING_DEPOSIT_AGREEMENT]: 'Holding Deposit Agreement',
    [ROUTES.SCREENING]: 'Screening',
    [ROUTES.APP_COMPLETE]: 'Application Complete',
    [ROUTES.PAYMENT_DETAILS]: 'Payment Details',
    [ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT]: 'Holding Deposit Agreement',
};

export const ROUTES_TOP_LEVEL = [
    ROUTES.ADDRESS,
    ROUTES.LEASE_TERMS,
    ROUTES.PROFILE_OPTIONS,
    ROUTES.INCOME_AND_EMPLOYMENT,
    ROUTES.FEES_AND_DEPOSITS,
    ROUTES.SCREENING,
    ROUTES.APP_COMPLETE,
    ROUTES.HOLDING_DEPOSIT_AGREEMENT,
    ROUTES.OUTSTANDING_BALANCE,
];

export const DOES_NOT_EXIST = 'DoesNotExist';
export const LEASE_TERMS_IDENTIFIER = 'lease_terms';
export const RENTER_PROFILE_IDENTIFIER = 'renter_profile';
export const UNIT_NOT_HELD_WAITING_IDENTIFIER = 'unit_not_held_waiting';

export const REPORT_POLL_INTERVAL = 10000;

export const STRIPE_PUBLISHABLE_KEY_DEMO = 'pk_test_vWO9q0lWvTCjPSq2FKMQeTpv00zsjtEm5j';
export const STRIPE_PUBLISHABLE_KEY_LIVE = 'pk_live_96Wm4LI5GkUtEFjhJq6WmDQv00feQM9V8E';
export const HELLOSIGN_CLIENT_ID = '530b26fda96d75b4abef002d9876fb7c';

export const ROLE_PRIMARY_APPLICANT = 'primary_applicant';
export const ROLE_CO_APPLICANT = 'co_applicant';
export const ROLE_GUARANTOR = 'guarantor';
export const ROLE_OCCUPANT = 'occupant';

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
export const EVENT_INCOME_REPORTED_NONE = 185;
export const EVENT_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED_EMAIL_SENT = 390;
export const EVENT_APPLICANT_UPDATED_EMPLOYER_INFO = 400;

// Applicant Milestones
export const MILESTONE_RENTAL_PROFILE_COMPLETED = 10020;
export const MILESTONE_INCOME_COMPLETED = 10030;
export const MILESTONE_APPLICATION_FEE_COMPLETED = 10040;
export const MILESTONE_HOLDING_DEPOSIT_SIGNED = 10050;
export const MILESTONE_APPLICANT_NEEDS_TO_REAGREE_TO_HD = 10065;
export const MILESTONE_APPLICANT_SUBMITTED = 10070;
export const MILESTONE_FINANCIAL_STREAM_INCOMPLETE = 10080;
export const MILESTONE_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED = 10090;
export const MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED = 10110;
export const MILESTONE_APPLICANT_SIGNED_LEASE = 10100;
// Application Milestones
export const MILESTONE_REQUEST_GUARANTOR = 20020;
export const MILESTONE_LEASE_SENT = 20030;
export const MILESTONE_LEASE_VOIDED = 20040;

export const APPLICATION_STATUS_APPROVED = 10;
export const APPLICATION_STATUS_DENIED = 15;
export const APPLICATION_STATUS_CANCELED = 20;
export const APPLICATION_STATUS_COMPLETED = 25;
export const APPLICATION_STATUS_CONDITIONALLY_APPROVED = 30;

export const APPLICANT_EVENTS = {
    // Regular events
    EVENT_APPLICANT_REGISTERED,
    EVENT_LEASE_TERMS_COMPLETED,
    EVENT_RENTAL_OPTIONS_SELECTED,
    EVENT_RENTAL_OPTIONS_NOT_SELECTED,
    EVENT_RENTAL_OPTIONS_COAPPLICANT_INVITED,
    EVENT_RENTAL_OPTIONS_GUARANTOR_INVITED,
    EVENT_RENTAL_OPTIONS_PET_ADDED,
    EVENT_INCOME_REPORTS_GENERATED,
    EVENT_APPLICATION_FEE_PAID,
    EVENT_SCREENING_COMPLETED,
    EVENT_APPLICANT_UPDATED_EMPLOYER_INFO,
    EVENT_INCOME_REPORTED_NONE,
    EVENT_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED_EMAIL_SENT,

    // Milestones
    MILESTONE_APPLICANT_SIGNED_LEASE,
    MILESTONE_LEASE_VOIDED,
    MILESTONE_INCOME_COMPLETED,
    MILESTONE_HOLDING_DEPOSIT_SIGNED,
    MILESTONE_REQUEST_GUARANTOR,
    MILESTONE_APPLICANT_NEEDS_TO_REAGREE_TO_HD,
};

export const APPLICATION_STATUSES = {
    APPLICATION_STATUS_APPROVED,
    APPLICATION_STATUS_CONDITIONALLY_APPROVED,
    APPLICATION_STATUS_COMPLETED,
    APPLICATION_STATUS_DENIED,
    APPLICATION_STATUS_CANCELED,
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
export const RENTER_PROFILE_TYPE_OCCUPANT = 'occupant';
export const RENTER_PROFILE_TYPE_DEPENDENT = 'dependent';
export const RENTER_PROFILE_TYPE_GUARANTOR = 'guarantor';

export const RENTER_PROFILE_TYPE_PETS = 'pets';
export const RENTER_PROFILE_TYPE_PARKING = 'parking';
export const RENTER_PROFILE_TYPE_WINE_COOLER = 'wine-cooler';
export const RENTER_PROFILE_TYPE_STORAGE = 'storage';

// Accepted Terms Of Service Constants
export const TOS_TYPE_PAYMENTS = 'TOS_TYPE_PAYMENTS';
export const TOS_TYPE_NESTIO = 'TOS_TYPE_NESTIO';
export const TOS_TYPE_FINICITY = 'TOS_TYPE_FINICITY';

export const INCOME_TYPE_FINICITY_AUTOMATED = 135;

export const ALL_INCOME_OR_ASSET_TYPES = {
    // INCOME TYPES
    105: {
        label: 'Employment',
        value: 105,
    },
    110: {
        label: 'Self Employment',
        value: 110,
    },
    115: {
        label: 'Student',
        value: 115,
    },
    120: {
        label: 'Government',
        value: 120,
    },
    125: {
        label: 'Retirement',
        value: 125,
    },
    130: {
        label: 'Child/Spousal Support',
        value: 130,
    },
    140: {
        label: 'Other',
        value: 140,
    },
    // ASSET TYPES
    500: {
        label: 'Savings',
        value: 500,
    },
    505: {
        label: 'Retirement',
        value: 505,
    },
    510: {
        label: 'Investment',
        value: 510,
    },
    515: {
        label: 'Other',
        value: 515,
    },
};
// used in lists
export const INCOME_TYPES = [
    ALL_INCOME_OR_ASSET_TYPES[105],
    ALL_INCOME_OR_ASSET_TYPES[110],
    ALL_INCOME_OR_ASSET_TYPES[115],
    ALL_INCOME_OR_ASSET_TYPES[120],
    ALL_INCOME_OR_ASSET_TYPES[125],
    ALL_INCOME_OR_ASSET_TYPES[130],
    ALL_INCOME_OR_ASSET_TYPES[140],
];

export const ASSET_TYPES = [
    ALL_INCOME_OR_ASSET_TYPES[500],
    ALL_INCOME_OR_ASSET_TYPES[505],
    ALL_INCOME_OR_ASSET_TYPES[510],
    ALL_INCOME_OR_ASSET_TYPES[515],
];

export const FINANCIAL_STREAM_INCOME = 5;
export const FINANCIAL_STREAM_ASSET = 10;

export const FINANCIAL_STREAM_STATUS_PENDING = 10;
export const FINANCIAL_STREAM_STATUS_APPROVED = 20;
export const FINANCIAL_STREAM_STATUS_DENIED = 30;
export const FINANCIAL_STREAM_STATUS_INCOMPLETE = 40;

export const INCOME_TYPE_OTHER = 140;
export const ASSET_TYPE_OTHER = 515;

export const DOCUMENT_TYPE_LEASE = 5;
export const DOCUMENT_TYPE_HOLDING_DEPOSIT = 10;

export const DOCUMENT_TYPE_OPTIONS = { DOCUMENT_TYPE_LEASE, DOCUMENT_TYPE_HOLDING_DEPOSIT };

export const PAYMENT_TIME_MONTHLY = 10;
