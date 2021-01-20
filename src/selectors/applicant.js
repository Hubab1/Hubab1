import { createSelector } from 'reselect';

import { MILESTONE_APPLICANT_SUBMITTED } from 'app/constants';

export const getApplicantEventsSet = createSelector(
    (state) => state.applicant && state.applicant.events,
    (applicantEvents) => {
        return new Set(applicantEvents.map((event) => parseInt(event.event)));
    }
);

export const getApplicantSubmittedApplication = createSelector(getApplicantEventsSet, (eventsSet) => {
    return eventsSet.has(MILESTONE_APPLICANT_SUBMITTED);
});
