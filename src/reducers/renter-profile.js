import { createSlice } from '@reduxjs/toolkit';
import uuidv4 from 'uuid/v4';
import produce from 'immer';
import { createSelector } from 'reselect';

import API, { MOCKY } from 'app/api';
import {
    ROUTES,
    ROLE_PRIMARY_APPLICANT,
    APPLICANT_EVENTS,
    APPLICATION_STATUSES,
    MILESTONE_APPLICANT_SUBMITTED,
    MILESTONE_REQUEST_GUARANTOR,
    MILESTONE_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED,
    MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED,
    MILESTONE_APPLICATION_FEE_COMPLETED,
    ROUTE_LABELS,
    MILESTONE_APPLICANT_NEEDS_TO_REAGREE_TO_HD,
} from 'app/constants';
import mock from './mock-profile';

import { filterRentalOptionsByUnit } from 'reducers/configuration';

const renterProfile = createSlice({
    name: 'renterProfile',
    initialState: null,
    reducers: {
        renterProfileReceived(state, action) {
            state = action.payload;
            if (state.pets) {
                state.pets.forEach((pet) => (pet.key = uuidv4()));
            } else {
                state.pets = [{ key: uuidv4() }];
            }
            return state;
        },
        renterProfileUpdated(state, action) {
            return produce(state, (draft) => {
                Object.assign(draft, action.payload);
            });
        },
    },
    extraReducers: {
        USER_LOGOUT: () => {
            return null;
        },
    },
});

const { actions, reducer } = renterProfile;
export const { renterProfileReceived, renterProfileUpdated } = actions;
export default reducer;

export const fetchRenterProfile = () => {
    return async (dispatch) => {
        let profile;
        if (MOCKY) {
            profile = mock;
        } else {
            profile = await API.fetchRenterProfile();
        }

        dispatch(renterProfileReceived(profile));
        dispatch(filterRentalOptionsByUnit(profile));

        return profile;
    };
};

export const updateRenterProfile = (newData, stateUpdate = null) => {
    return (dispatch) => {
        if (MOCKY) {
            dispatch({
                type: renterProfileUpdated.toString(),
                payload: stateUpdate || newData,
            });
            return Promise.resolve({});
        }
        return API.patchApplication(newData)
            .then((res) => {
                if (res.errors) {
                    return res;
                }
                return dispatch({
                    type: renterProfileUpdated.toString(),
                    payload: stateUpdate || res,
                });
            })
            .catch((e) => {
                return { errors: [e.message] };
            });
    };
};

export const pageComplete = (page) => {
    return (dispatch) => {
        return API.postPageComplete(page).then(() => {
            dispatch(fetchRenterProfile());
        });
    };
};

// selectors
export const selectors = {};
selectors.selectOrderedRoutes = createSelector(
    (state) => state.applicant?.role,
    (state) => state.configuration?.enable_automatic_income_verification,
    (state) => state.configuration?.enable_holding_deposit_agreement,
    (state) => state.configuration?.collect_employer_information,
    (role, enableAutomaticIncomeVerification, enableHoldingDepositAgreement, collectEmployerInfo) => {
        if (role == null || enableAutomaticIncomeVerification == null || collectEmployerInfo == null) return;

        return [
            ROUTES.ADDRESS,
            ROUTES.LEASE_TERMS,
            role === ROLE_PRIMARY_APPLICANT && ROUTES.PROFILE_OPTIONS,
            (enableAutomaticIncomeVerification || collectEmployerInfo) && ROUTES.INCOME_AND_EMPLOYMENT,
            ROUTES.FEES_AND_DEPOSITS,
            role === ROLE_PRIMARY_APPLICANT && enableHoldingDepositAgreement && ROUTES.HOLDING_DEPOSIT_AGREEMENT,
            ROUTES.SCREENING,
            ROUTES.APP_COMPLETE,
        ].filter((r) => !!r);
    }
);

const ADDRESS_FIELDS = ['address_street', 'address_city', 'address_state', 'address_postal_code'];

// Determines which routes the applicant still needs to submit/complete
// A route returning FALSE here indicates that the user has not completed it
const pageCompleted = (events, applicant, profile, configuration) => ({
    [ROUTES.ADDRESS]: isApplicantAddressCompleted(applicant),
    [ROUTES.LEASE_TERMS]: isLeaseTermsCompleted(events),
    [ROUTES.PROFILE_OPTIONS]: isRentalOptionsCompleted(events),
    [ROUTES.INCOME_AND_EMPLOYMENT]: isIncomeAndEmploymentCompleted(events, profile, configuration),
    [ROUTES.FEES_AND_DEPOSITS]: isFeesAndDepositsCompleted(applicant),
    [ROUTES.HOLDING_DEPOSIT_AGREEMENT]: isHoldingDepositAgreementCompleted(events),
    [ROUTES.SCREENING]: isScreeningCompleted(events),
    [ROUTES.APP_COMPLETE]: isApplicationCompleted(events),
});

const isApplicantAddressCompleted = (applicant) => {
    return ADDRESS_FIELDS.some((field) => !!applicant[field]);
};

const isLeaseTermsCompleted = (events) => {
    return events.has(APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED);
};

const isRentalOptionsCompleted = (events) => {
    return (
        events.has(APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_SELECTED) ||
        events.has(APPLICANT_EVENTS.EVENT_RENTAL_OPTIONS_NOT_SELECTED)
    );
};

const isFeesAndDepositsCompleted = (applicant) => {
    return !!applicant.receipt;
};

const isIncomeAndEmploymentCompleted = (events, profile, configuration) => {
    if (events.has(APPLICANT_EVENTS.MILESTONE_INCOME_COMPLETED)) {
        if (!configuration.collect_employer_information) return true;
        return events.has(APPLICANT_EVENTS.EVENT_APPLICANT_UPDATED_EMPLOYER_INFO);
    }
    if (!configuration.enable_automatic_income_verification && configuration.collect_employer_information) {
        return events.has(APPLICANT_EVENTS.EVENT_APPLICANT_UPDATED_EMPLOYER_INFO);
    }
    return false;
};

const isHoldingDepositAgreementCompleted = (events) => {
    return events.has(APPLICANT_EVENTS.MILESTONE_HOLDING_DEPOSIT_SIGNED);
};

const isScreeningCompleted = (events) => {
    return events.has(MILESTONE_APPLICANT_SUBMITTED);
};

const isApplicationCompleted = (events) => {
    return events.has(MILESTONE_APPLICANT_SUBMITTED);
};

selectors.canAccessRoute = (state, route) => {
    if (MOCKY && route != null) return true;
    /*
     Ordered screens and generally can't be completed out of order.
     Some pages can always be accessed no matter what.
     Here contains logic around access permissions for certain pages.
     This is not totally comprehensive.
    */
    // These pages should always be accessible

    if ([ROUTES.ACCOUNT, ROUTES.TERMS, ROUTES.PRIVACY_POLICY, ROUTES.FAQ, ROUTES.FUNNEL_TERMS].includes(route)) {
        return true;
    }
    const eventsSet = new Set(state.applicant.events.map((event) => parseInt(event.event)));

    if (route === ROUTES.PAYMENT_DETAILS) {
        return eventsSet.has(APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED);
    }

    // check if page was completed
    if (pageCompleted(eventsSet, state.applicant, state.renterProfile, state.configuration)[route] === true) {
        return true;
    }
    //  route is next page
    return route === selectors.selectInitialPage(state);
};

export const DIRECT_ROUTES = [ROUTES.PAYMENT_DETAILS, ROUTES.FAQ];

const getDirectRoute = (route) => {
    if (!route) return null;
    return DIRECT_ROUTES.find((r) => route.includes(r));
};

selectors.selectDefaultInitialPage = createSelector(
    selectors.selectOrderedRoutes,
    (state) => state.applicant && state.applicant.events,
    (state) => state.applicant,
    (state) => state.renterProfile,
    (state) => state.configuration,
    (orderedRoutes, events, applicant, profile, configuration) => {
        if (orderedRoutes && events && applicant && profile) {
            const eventsSet = new Set(events.map((event) => parseInt(event.event)));
            const applicationEvents = profile.events
                ? new Set(profile.events.map((event) => parseInt(event.event)))
                : null;

            // eslint-disable-next-line default-case
            switch (profile.status) {
                case APPLICATION_STATUSES.APPLICATION_STATUS_CANCELED:
                    return ROUTES.APP_CANCELLED;
                case APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED:
                    return ROUTES.LEASE_EXECUTED;
                case APPLICATION_STATUSES.APPLICATION_STATUS_DENIED:
                    return ROUTES.APP_DENIED;
            }

            if (eventsSet.has(MILESTONE_APPLICANT_NEEDS_TO_REAGREE_TO_HD)) {
                return ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT;
            }

            if (eventsSet.has(APPLICANT_EVENTS.MILESTONE_LEASE_VOIDED)) {
                return ROUTES.LEASE_VOIDED;
            }

            if (eventsSet.has(APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE)) {
                return ROUTES.LEASE_SIGNED;
            }

            // eslint-disable-next-line default-case
            switch (profile.status) {
                case APPLICATION_STATUSES.APPLICATION_STATUS_APPROVED:
                case APPLICATION_STATUSES.APPLICATION_STATUS_CONDITIONALLY_APPROVED:
                    return ROUTES.APP_APPROVED;
            }

            if (profile.unit_available === false) {
                return ROUTES.UNIT_UNAVAILABLE;
            }

            if (eventsSet.has(MILESTONE_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED)) {
                return ROUTES.INCOME_AND_EMPLOYMENT;
            }

            if (applicationEvents && applicationEvents.has(MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED)) {
                return ROUTES.INCOME_AND_EMPLOYMENT;
            }

            if (applicationEvents && applicationEvents.has(MILESTONE_REQUEST_GUARANTOR)) {
                return ROUTES.GUARANTOR_REQUESTED;
            }

            if (eventsSet.has(MILESTONE_APPLICATION_FEE_COMPLETED) && applicant.outstanding_balances.length > 0) {
                return ROUTES.OUTSTANDING_BALANCE;
            }

            if (eventsSet.has(MILESTONE_APPLICANT_SUBMITTED)) {
                return ROUTES.APP_COMPLETE;
            }

            const accessibleRoutes = pageCompleted(eventsSet, applicant, profile, configuration);

            const route = orderedRoutes.find((r) => !accessibleRoutes[r]);
            if (route) return route;
            console.error('Could not determine current page.');
        }
    }
);

selectors.selectInitialPage = createSelector(selectors.selectDefaultInitialPage, (defaultInitialPage) => {
    const directRoute = getDirectRoute(window.location.pathname);
    if (directRoute) {
        return directRoute;
    }

    return defaultInitialPage;
});
selectors.selectNextRoute = createSelector(
    selectors.selectOrderedRoutes,
    (state) => state.siteConfig.currentRoute,
    (orderedRoutes, currentRoute) => {
        if (orderedRoutes && currentRoute) {
            return orderedRoutes[orderedRoutes.indexOf(currentRoute) + 1];
        }
    }
);

selectors.selectApplicantStillFinishingApplication = createSelector(
    (state) => state.applicant && state.applicant.events,
    (applicantEvents) => {
        if (!applicantEvents) return false;
        // if applicant has submitted milestone, they're not completing fields anymore
        return !applicantEvents.find((e) => parseInt(e.event) === parseInt(MILESTONE_APPLICANT_SUBMITTED));
    }
);

selectors.selectGuarantorRequested = createSelector(
    (state) => state.applicant && state.applicant.events,
    (state) => state.renterProfile,
    (events, profile) => {
        if (!(events && profile)) return false;
        const applicationEvents = profile.events ? new Set(profile.events.map((event) => parseInt(event.event))) : null;
        return applicationEvents && applicationEvents.has(MILESTONE_REQUEST_GUARANTOR);
    }
);

selectors.selectPrevRoute = createSelector(
    selectors.selectOrderedRoutes,
    (state) => state.siteConfig.currentRoute,
    (orderedRoutes, currentRoute) => {
        if (orderedRoutes && currentRoute) {
            return orderedRoutes[orderedRoutes.indexOf(currentRoute) - 1];
        }
    }
);

selectors.selectNav = createSelector(selectors.selectOrderedRoutes, (orderedRoutes) => {
    if (orderedRoutes) {
        return orderedRoutes.map((r) => ({ name: ROUTE_LABELS[r], value: r }));
    }
});

selectors.selectUnit = (state) => state?.renterProfile?.unit;
