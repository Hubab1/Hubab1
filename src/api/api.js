import auth from 'utils/auth';
import fetch from 'utils/fetch';

import { MOCKY, CHUCK_BASE_URL, VGS_VAULT_ID, VGS_ENVIRONMENT } from 'config';

export function chuck(path) {
    return `${CHUCK_BASE_URL}/api/onlineleasing${path}`;
}

export function vgs(path) {
    return `https://${VGS_VAULT_ID}.${VGS_ENVIRONMENT}.verygoodproxy.com/api/onlineleasing${path}`;
}

const getWithHeaders = (url) =>
    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    }).then((res) => res.json());

const CHUCK_BASE_LEASE_SETTINGS = (communityId) => `${CHUCK_BASE_URL}/api/onlineleasing/communities/${communityId}/`;
const CHUCK_PERSONALIZED_LEASE_SETTINGS = (communityId, hash) =>
    `${CHUCK_BASE_URL}/api/onlineleasing/communities/${communityId}/personalized/${hash}`;

const API = {};

API.fetchConfiguration = (communityId) => {
    return getWithHeaders(CHUCK_BASE_LEASE_SETTINGS(communityId));
};

API.fetchPrivacyPolicy = () => {
    return fetch(chuck('/privacy-policy'));
};

API.fetchFunnelTerms = (leaseSettingsId) => {
    return fetch(chuck(`/funnel_terms/${leaseSettingsId}`));
};

API.fetchHoldingDepositTerms = (application_id, canProceedToPayment) => {
    return fetch(
        chuck(
            `/application/${application_id}/holding_deposit_terms/?can_proceed_to_payment=${
                canProceedToPayment ? 1 : 0
            }`
        ),
        {
            method: 'GET',
            headers: {
                Authorization: `Token ${auth.getToken()}`,
            },
        }
    ).then((res) => res.text());
};

API.fetchPersonalizedInfo = (communityId, hash) => {
    return getWithHeaders(CHUCK_PERSONALIZED_LEASE_SETTINGS(communityId, hash));
};

API.postPageComplete = (page) => {
    return fetch(chuck(`/page-complete/`), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify({ page }),
    }).then((res) => res.json());
};

API.fetchAvailableUnits = (application_id) => {
    if (MOCKY)
        return Promise.resolve([
            { id: 1, unit_number: '1B', price: 1540.5 },
            { id: 2, unit_number: '1C', price: 1999.99 },
            { id: 3, unit_number: '1D', price: 5000.0 },
            { id: 4, unit_number: '1E', price: 2450.99 },
            { id: 5, unit_number: '2E', price: 2450.99 },
            { id: 6, unit_number: '2A', price: 1540.5 },
            { id: 7, unit_number: '2B', price: 1999.99 },
            { id: 8, unit_number: '2C', price: 5000.0 },
            { id: 9, unit_number: '2D', price: 2450.99 },
            { id: 10, unit_number: '2E', price: 2450.99 },
        ]);
    return fetch(chuck(`/application/${application_id}/available-units/`), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.patchApplication = (application_id, data) => {
    return fetch(chuck(`/application/${application_id}/`), {
        method: 'PATCH',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.putApplicant = (data) => {
    return fetch(chuck('/applicant/'), {
        method: 'PUT',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.fetchRenterProfile = (application_id) => {
    return fetch(chuck(`/application/${application_id}/`), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.fetchApplicant = () => {
    return fetch(chuck('/applicant/'), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.login = (email, password, communityId) => {
    return fetch(chuck(`/communities/${communityId}/login/`), {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }).then((res) => res.json());
};

API.register = (data, leaseSettingsId, hash) => {
    let registerUrl = `/communities/${leaseSettingsId}/register/`;
    if (hash) {
        registerUrl = registerUrl.concat(`?v=${hash}`);
    }
    return fetch(chuck(registerUrl), {
        method: 'POST',
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.acceptTerms = (application_id, data) => {
    return fetch(chuck(`/application/${application_id}/terms-accepted/`), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.passwordResetRequest = (data) => {
    return fetch(chuck('/password-reset/'), {
        method: 'POST',
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.passwordResetVerification = (data) => {
    return fetch(chuck('/password-reset-verification/'), {
        method: 'POST',
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.passwordReset = (data, token) => {
    return window
        .fetch(chuck('/password-change/'), {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                AUTHORIZATION: `token ${token}`,
            },
        })
        .then((res) => res.json());
};

API.passwordChange = (password) => {
    return fetch(chuck('/password-change/'), {
        method: 'PUT',
        body: JSON.stringify({ password }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.inviteGuarantor = (application_id, data) => {
    return fetch(chuck(`/application/${application_id}/guarantors/`), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.createFinicityUrl = () => {
    return fetch(chuck('/generate-finicity-link/'), {
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.generateFinicityReports = (application_id) => {
    return fetch(chuck(`/application/${application_id}/generate-finicity-reports/`), {
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.embeddedSigningUrl = (application_id, type) => {
    return fetch(chuck(`/application/${application_id}/embedded-signing-url/?document_type=${type}`), {
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.leaseDocumentUrl = (application_id, type) => {
    return fetch(chuck(`/application/${application_id}/lease-document-url/?document_type=${type}`), {
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.fetchFinicityReports = () => {
    return fetch(chuck(`/fetch-finicity-reports/`), {
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    });
};

API.stripePayment = (application_id, data) => {
    return fetch(chuck(`/application/${application_id}/payment`), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.updateInvitee = (application_id, data, inviteeId) => {
    return fetch(chuck(`/application/${application_id}/invitees/${inviteeId}/`), {
        method: 'PUT',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.postPassthrough = (application_id, data, vgsEnabled) => {
    const url = vgsEnabled
        ? vgs(`/application/${application_id}/passthrough/`)
        : chuck(`/application/${application_id}/passthrough/`);
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.fetchPaymentOptions = (application_id) => {
    return fetch(chuck(`/application/${application_id}/payment-options/`), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => {
        return res.json();
    });
};

API.getCurrentFlatQuote = (application_id, data) => {
    return fetch(chuck(`/application/${application_id}/payment-breakdown/`), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => {
        return res.json();
    });
};

API.createFinancialSource = (application_id, body) => {
    return fetch(chuck(`/application/${application_id}/financial-sources/`), {
        method: 'PUT',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(body),
    }).then((res) => res.json());
};

API.uploadFinancialDocument = (application_id, data, vgsEnabled) => {
    const url = vgsEnabled
        ? vgs(`/application/${application_id}/financial-document/`)
        : chuck(`/application/${application_id}/financial-document/`);

    return fetch(url, {
        method: 'POST',
        headers: {
            AUTHORIZATION: `Token ${auth.getToken()}`,
        },
        body: data,
    }).then((res) => {
        if (res.status === 200) {
            return res.json();
        }

        if (res.status >= 200 && res.status < 300) {
            return res;
        }

        const error = new Error();
        error.response = res;
        throw error;
    });
};

API.getFinancialSources = (application_id) => {
    return fetch(chuck(`/application/${application_id}/financial-sources/`), {
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    });
};

API.getFinancialSource = (id) => {
    return fetch(chuck(`/financial-sources/${id}/`), {
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => {
        if (res.status === 200) {
            return res.json();
        }

        if (res.status >= 200 && res.status < 300) {
            return res;
        }

        const error = new Error();
        error.response = res;
        throw error;
    });
};

API.updateFinancialSource = (id, body) => {
    return fetch(chuck(`/financial-sources/${id}/`), {
        method: 'PATCH',
        body,
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => {
        if (res.status === 200) {
            return res.json();
        }

        if (res.status >= 200 && res.status < 300) {
            return res;
        }

        const error = new Error();
        error.response = res;
        throw error;
    });
};

API.deleteFinancialSource = (id) => {
    return fetch(chuck(`/financial-sources/${id}/`), {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => {
        if (res.status === 200) {
            return res.json();
        }

        if (res.status >= 200 && res.status < 300) {
            return res;
        }

        const error = new Error();
        error.response = res;
        throw error;
    });
};

API.resetApplicantFinancials = (application_id) => {
    return fetch(chuck(`/application/${application_id}/financial-sources/`), {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {
            return Promise.resolve();
        }
        throw new Error();
    });
};

API.deletePerson = (application_id, id) => {
    return fetch(chuck(`/application/${application_id}/person/${id}/`), {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {
            return;
        }
        throw new Error();
    });
};

API.deleteInvitee = (application_id, id) => {
    return fetch(chuck(`/application/${application_id}/invitees/${id}/`), {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => {
        if (res.status >= 200 && res.status < 300) {
            return;
        }
        throw new Error();
    });
};

API.fetchAvailableLeaseTerms = (application_id, data) => {
    return fetch(chuck(`/application/${application_id}/available-lease-terms/`), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.fetchAANDocument = (application_id) => {
    return fetch(chuck(`/application/${application_id}/aan-document/`), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.blob());
};

API.postEmployer = (data) => {
    return fetch(chuck('/applicant-employer/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
};

API.getApplications = () => {
    return fetch(chuck('/applications/'), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.getInvitations = () => {
    return fetch(chuck('/invitations/'), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
    }).then((res) => res.json());
};

API.createApplicantRole = (invitee_id) => {
    return fetch(chuck('/applicant-role/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`,
        },
        body: JSON.stringify({
            invitee_id,
        }),
    }).then((res) => res.json());
};

export default API;
