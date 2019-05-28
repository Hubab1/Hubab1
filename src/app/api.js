const CHUCK_BASE_URL = process.env.REACT_APP_CHUCK_DOMAIN;

function chuck(path) {
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

API.fetchPersonalizedInfo = (communityId, hash) => {
    return getWithHeaders(CHUCK_PERSONALIZED_LEASE_SETTINGS(communityId, hash));
};

API.fetchRenterProfile = () => {
    return Promise.resolve({
        completed_terms_and_conditions: false,
        _rental_options_config: [{ page: 'has_pets', limit: 1 }, { page: 'has_roommates', limit: 3 }],
        selected_rental_options: [],
        roommates: [],
        pets: [],
        guarantor: {},
    });
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

API.inviteRoommate = (data) => {
    return Promise.resolve('perkele');  
}

export default API;