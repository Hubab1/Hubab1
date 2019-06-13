import auth from 'utils/auth';

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

API.patchApplication = (data) => {
    return fetch(chuck('/application/'), {
        method: 'PATCH',
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

API.inviteGuarantor = (data) => {
    return fetch(chuck('/guarantors/'), {
        method: 'POST',
        headers: {
            Authorization: `Token ${auth.getToken()}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

API.createFinicityUrl = (data) => {
    return Promise.resolve({finicity_url: "https://connect.finicity.com?consumerId=c5624f3899fa14a8988c0a8e7b8f123a&customerId=40088217&partnerId=2445582700226&redirectUri=http%3A%2F%2Fwww.google.com&signature=f0ae7aa6463c1e97bffc95fd9b7c1f24110e9243bb5bb3670f357962ef3fe9db&timestamp=1559155162184&type=voi"});
}

export default API;