import { createSlice } from '@reduxjs/toolkit';
import uuidv4 from 'uuid/v4';
import produce from 'immer';
import { createSelector } from 'reselect';

import { MOCKY } from 'config';
import API from 'api/api';
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
} from 'constants/constants';
import mock from './fixtures/mock-profile';

import { filterRentalOptionsByUnit } from 'reducers/configuration';
import { generatePath } from 'react-router';

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
export const { renterProfileReceived, renterProfileUpdated, renterProfileCleared } = actions;
export default reducer;

export const fetchRenterProfile = (id) => {
    return async (dispatch, getState) => {
        const { renterProfile } = getState();
        id = id || renterProfile?.id;

        let profile;
        if (MOCKY) {
            profile = mock;
        } else {
            profile = await API.fetchRenterProfile(id);
        }

        dispatch(renterProfileReceived(profile));
        dispatch(filterRentalOptionsByUnit(profile));

        return profile;
    };
};

export const updateRenterProfile = (newData, stateUpdate = null) => {
    return (dispatch, getState) => {
        const { renterProfile } = getState();

        if (MOCKY) {
            dispatch({
                type: renterProfileUpdated.toString(),
                payload: stateUpdate || newData,
            });
            return Promise.resolve({});
        }
        return API.patchApplication(renterProfile.id, newData)
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
    return (dispatch, getState) => {
        const { renterProfile } = getState();
        return API.postPageComplete(page).then(() => {
            dispatch(fetchRenterProfile(renterProfile.id));
        });
    };
};

// selectors
export const selectors = {};

selectors.selectDefaultBankingPage = createSelector(
    (state) => state.applicant,
    (state) => state.application && state.application.events,
    (state) => state.configuration,
    (state) => state.banking,
    (applicant, applicationEvents, configuration, data) => {
        const applicantEnteredIncomeOrAssets =
            data?.income_sources?.length || data?.asset_sources?.length || data?.reported_no_income_assets;

        if (!applicantEnteredIncomeOrAssets || !applicant) {
            return ROUTES.INCOME_VERIFICATION_CONNECT;
        }

        const agentRequestedIncomeAssets =
            applicationEvents &&
            applicationEvents.find(({ event }) => event === MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED);

        if (agentRequestedIncomeAssets) {
            if (data?.income_sources?.length || data?.asset_sources?.length) {
                return ROUTES.INCOME_VERIFICATION_SUMMARY;
            }
            return ROUTES.INCOME_VERIFICATION_CONNECT;
        }

        const addedEmployerInfo = !!applicant.events.find(
            (e) => String(e.event) === String(APPLICANT_EVENTS.EVENT_APPLICANT_UPDATED_EMPLOYER_INFO)
        );

        const reportedNoIncome = !!applicant.events.find(
            (e) => String(e.event) === String(APPLICANT_EVENTS.EVENT_INCOME_REPORTED_NONE)
        );

        const shouldEditEmployerInfo =
            configuration.collect_employer_information &&
            !addedEmployerInfo &&
            !reportedNoIncome &&
            !applicant.submitted_application;

        if (shouldEditEmployerInfo) {
            return ROUTES.EMPLOYER_DETAILS;
        } else {
            return ROUTES.INCOME_VERIFICATION_SUMMARY;
        }
    }
);

selectors.selectOrderedRoutes = createSelector(
    (state) => state.applicant?.role,
    (state) => state.configuration?.enable_automatic_income_verification,
    (state) => state.configuration?.enable_holding_deposit_agreement,
    (state) => state.configuration?.collect_employer_information,
    selectors.selectDefaultBankingPage,
    (role, enableAutomaticIncomeVerification, enableHoldingDepositAgreement, collectEmployerInfo, bankingIndex) => {
        if (role == null || enableAutomaticIncomeVerification == null || collectEmployerInfo == null) return;

        return [
            ROUTES.ADDRESS,
            ROUTES.LEASE_TERMS,
            role === ROLE_PRIMARY_APPLICANT && ROUTES.PROFILE_OPTIONS,
            (enableAutomaticIncomeVerification || collectEmployerInfo) && bankingIndex,
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
const pageCompleted = (events, state) => {
    const { applicant, profile, configuration } = state;
    const containerIndexRoutes = selectors.selectDefaultContainerPage(state);
    return {
        [ROUTES.ADDRESS]: isApplicantAddressCompleted(applicant),
        [ROUTES.LEASE_TERMS]: isLeaseTermsCompleted(events),
        [ROUTES.PROFILE_OPTIONS]: isRentalOptionsCompleted(events),
        [containerIndexRoutes[ROUTES.BANKING]]: isIncomeAndEmploymentCompleted(events, profile, configuration),
        [ROUTES.FEES_AND_DEPOSITS]: isFeesAndDepositsCompleted(applicant),
        [ROUTES.HOLDING_DEPOSIT_AGREEMENT]: isHoldingDepositAgreementCompleted(events),
        [ROUTES.SCREENING]: isScreeningCompleted(events),
        [ROUTES.APP_COMPLETE]: isApplicationCompleted(events),
    };
};

selectors.selectDefaultContainerPage = createSelector(selectors.selectDefaultBankingPage, (bankingIndexRoute) => {
    return {
        [ROUTES.BANKING]: bankingIndexRoute,
    };
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

export const applicationPath = (route, application_id, params = {}) =>
    generatePath(route, { application_id, ...params });

selectors.canAccessRoute = (state, route) => {
    if (MOCKY && route != null) return true;
    if (route === null) return false;

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

    const application_id = state.renterProfile?.id;
    const eventsSet = new Set(
        state.applicant.events.filter((e) => e.application === application_id).map((event) => parseInt(event.event))
    );

    if (route === ROUTES.PAYMENT_DETAILS) {
        return eventsSet.has(APPLICANT_EVENTS.EVENT_LEASE_TERMS_COMPLETED);
    }

    const pagesCompleted = pageCompleted(eventsSet, state);
    for (const pageRoute in pagesCompleted) {
        if (applicationPath(pageRoute, state.renterProfile.id) === route && pagesCompleted[pageRoute] === true) {
            return true;
        }
    }

    if (selectors.selectDirectRoute(state)) {
        return true;
    }

    // route is next page
    return selectors.selectDefaultInitialPage(state) === applicationPath(route, state.renterProfile.id);
};

export const DIRECT_ROUTES = [ROUTES.PAYMENT_DETAILS, ROUTES.FAQ, ROUTES.APPLICATIONS];

const getDirectRoute = (route, application) => {
    if (!route) return null;

    if (application) {
        const paymentRoute = generatePath(ROUTES.PAYMENT_DETAILS, { application_id: application.id });
        if (route === paymentRoute) {
            return paymentRoute;
        }
    }

    route = DIRECT_ROUTES.find((r) => route.includes(r));

    return route;
};

selectors.selectDefaultInitialPage = createSelector(
    selectors.selectOrderedRoutes,
    (state) => state.applicant && state.applicant.events,
    (state) => state.applicant,
    (state) => state.renterProfile,
    (state) => state.configuration,
    (state) => state,
    (orderedRoutes, events, applicant, profile, configuration, state) => {
        if (orderedRoutes && events && applicant && profile) {
            const getRoute = () => {
                const eventsSet = new Set(
                    events.filter((e) => e.application === profile.id).map((event) => parseInt(event.event))
                );
                const applicationEvents = profile.events
                    ? new Set(profile.events.map((event) => parseInt(event.event)))
                    : null;

                // eslint-disable-next-line default-case
                switch (profile.status) {
                    case APPLICATION_STATUSES.APPLICATION_STATUS_CANCELLED:
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
                    return ROUTES.INCOME_VERIFICATION_SUMMARY;
                }

                if (
                    applicationEvents &&
                    applicationEvents.has(MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED)
                ) {
                    return ROUTES.INCOME_VERIFICATION_SUMMARY;
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

                const accessibleRoutes = pageCompleted(eventsSet, state);
                return orderedRoutes.find((r) => !accessibleRoutes[r]);
            };

            const route = getRoute();
            if (route) return applicationPath(route, profile.id);

            console.error('Could not determine current page.');
        }
    }
);

selectors.selectDirectRoute = createSelector(
    (state) => state.renterProfile,
    (application) => {
        const directRoute = getDirectRoute(window.location.pathname, application);

        if (directRoute) {
            return directRoute;
        }

        return null;
    }
);

selectors.selectInitialPage = createSelector(
    selectors.selectDirectRoute,
    selectors.selectDefaultInitialPage,
    (directRoute, defaultInitialPage) => {
        if (directRoute) {
            return directRoute;
        }

        return defaultInitialPage;
    }
);

selectors.selectNextRoute = createSelector(
    selectors.selectOrderedRoutes,
    (state) => state.siteConfig.currentRoute,
    (state) => state.renterProfile,
    (orderedRoutes, currentRoute, application) => {
        if (!application) {
            return null;
        }
        const orderedRoutesWithApp = orderedRoutes.map((route) => applicationPath(route, application.id));
        if (orderedRoutesWithApp && currentRoute) {
            return orderedRoutesWithApp[orderedRoutesWithApp.indexOf(currentRoute) + 1];
        }
    }
);

selectors.selectPrevRoute = createSelector(
    selectors.selectOrderedRoutes,
    (state) => state.siteConfig.currentRoute,
    (state) => state.renterProfile,
    (orderedRoutes, currentRoute, application) => {
        if (!application) {
            return null;
        }
        const orderedRoutesWithApp = orderedRoutes.map((route) => applicationPath(route, application.id));
        if (orderedRoutesWithApp && currentRoute) {
            return orderedRoutesWithApp[orderedRoutesWithApp.indexOf(currentRoute) - 1];
        }
    }
);

selectors.selectApplicantStillFinishingApplication = createSelector(
    (state) => state.applicant && state.applicant.events,
    (state) => state.renterProfile,
    (applicantEvents, application) => {
        if (!applicantEvents || !application) return;
        // if applicant has submitted milestone, they're not completing fields anymore
        return !applicantEvents
            .filter((e) => e.application === application.id)
            .find((e) => parseInt(e.event) === parseInt(MILESTONE_APPLICANT_SUBMITTED));
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

selectors.selectNav = createSelector(selectors.selectOrderedRoutes, (orderedRoutes) => {
    if (orderedRoutes) {
        return orderedRoutes.map((r) => ({ name: ROUTE_LABELS[r], value: r }));
    }
});

selectors.selectUnit = (state) => state?.renterProfile?.unit;
