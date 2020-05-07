import auth from 'utils/auth';
import fetch from 'app/fetch';
export const MOCKY = !!process.env.REACT_APP_MOCKY;

export const CHUCK_BASE_URL = process.env.REACT_APP_CHUCK_DOMAIN;

export function chuck(path) {
    return `${CHUCK_BASE_URL}/api/onlineleasing${path}`;
}

const getWithHeaders = (url) => fetch(url, {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
}).then(res => res.json());

const CHUCK_BASE_LEASE_SETTINGS = (communityId) => `${CHUCK_BASE_URL}/api/onlineleasing/communities/${communityId}/`;
const CHUCK_PERSONALIZED_LEASE_SETTINGS = (communityId, hash) => `${CHUCK_BASE_URL}/api/onlineleasing/communities/${communityId}/personalized/${hash}`;

const API = {};

API.fetchConfiguration = (communityId) => {
    return getWithHeaders(CHUCK_BASE_LEASE_SETTINGS(communityId));
};

API.fetchPrivacyPolicy = (communityId) => {
    return fetch(chuck('/privacy-policy'));
};

API.fetchPersonalizedInfo = (communityId, hash) => {
    return getWithHeaders(CHUCK_PERSONALIZED_LEASE_SETTINGS(communityId, hash));
};

API.postPageComplete = (page) => {
    return fetch(chuck(`/page-complete/`), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify({ page })
    }).then(res => res.json());
};

API.fetchAvailableUnits = () => {
    if (MOCKY) return Promise.resolve([
        {id: 1, unit_number: '1B', price: 1540.50},
        {id: 2, unit_number: '1C', price: 1999.99},
        {id: 3, unit_number: '1D', price: 5000.00},
        {id: 4, unit_number: '1E', price: 2450.99},
        {id: 5, unit_number: '2E', price: 2450.99},
        {id: 6, unit_number: '2A', price: 1540.50},
        {id: 7, unit_number: '2B', price: 1999.99},
        {id: 8, unit_number: '2C', price: 5000.00},
        {id: 9, unit_number: '2D', price: 2450.99},
        {id: 10, unit_number: '2E', price: 2450.99},
    ])
    return fetch(chuck('/available-units/'), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        }
    }).then(res => res.json());
};

API.patchApplication = (data) => {
    return fetch(chuck('/application/'), {
        method: 'PATCH',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

API.putApplicant = (data) => {
    return fetch(chuck('/applicant/'), {
        method: 'PUT',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

API.fetchRenterProfile = () => {
    return fetch(chuck('/application/'), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        }
    }).then(res => res.json());
};

API.fetchApplicant = () => {
    return fetch(chuck('/applicant/'), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        }
    }).then(res => res.json());
};

API.login = (email, password, communityId) => {
    return fetch(chuck(`/communities/${communityId}/login/`), {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }).then(res => res.json());
};

API.register = (data, leaseSettingsId, hash) => {
    let registerUrl = `/communities/${leaseSettingsId}/register/`;
    if (hash) { registerUrl = registerUrl.concat(`?v=${hash}`); }
    return fetch(chuck(registerUrl), {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(res => res.json());
};

API.acceptTerms = (data) => {
    return fetch(chuck('/terms-accepted/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
};

API.passwordResetRequest = (phone_number, lease_settings_id) => {
    return fetch(chuck('/password-reset/'), {
        method: 'POST',
        body: JSON.stringify({ phone_number, lease_settings_id })
    }).then(res => res.json());
};

API.passwordResetVerification = (phone_number, code, lease_settings_id) => {
    return fetch(chuck('/password-reset-verification/'), {
        method: 'POST',
        body: JSON.stringify({ phone_number, code, lease_settings_id })
    }).then(res => res.json());
}

API.passwordReset = (password, token) => {
    return fetch(chuck('/password-change/'), {
        method: 'PUT',
        body: JSON.stringify({password}),
        headers: {
            "Content-Type": "application/json",
            'AUTHORIZATION': `token ${token}`,
        }
    }).then(res => res.json());
}

API.inviteGuarantor = (data) => {
    return fetch(chuck('/guarantors/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

API.createFinicityUrl = () => {
    return fetch(chuck('/generate-finicity-link/'), {
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
    }).then(res => res.json());}

API.generateFinicityReports = () => {
    return fetch(chuck('/generate-finicity-reports/'), {
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
    }).then(res => res.json());
}

API.embeddedSigningUrl = () => {
    return fetch(chuck('/embedded-signing-url/'), {
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
    }).then(res => res.json());
}
API.leaseDocumentUrl = () => {
    return fetch(chuck('/lease-document-url/'), {
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
    }).then(res => res.json());
}

API.fetchFinicityReports = () => {
    return fetch(chuck('/fetch-finicity-reports/'), {
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
    });
}

API.stripePayment = (data) => {
    return fetch(chuck('/payment/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

API.createIncomeStream = (data) => {
    return fetch(chuck('/incomestreams/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

API.updateInvitee = (data, inviteeId) => {
    return fetch(chuck(`/invitees/${inviteeId}/`), {
        method: 'PUT',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

API.postPassthrough = data => (
    fetch(chuck('/passthrough/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
)

API.fetchPaymentOptions = () => {
    return fetch(chuck('/payment-options/'), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
    }).then(res => {
        return res.json()
    });
}

API.getCurrentFlatQuote = (data) => {
    return fetch(chuck('/payment-breakdown/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.json()
    });
}

API.getDenialDecisionDetails = () => {
    return fetch(chuck('/applicant/denial-decision/'), {
        method: 'GET',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
    }).then(res => {
        return res.json()
    });
}

export default API;
