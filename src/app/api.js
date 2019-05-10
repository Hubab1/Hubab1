const CHUCK_BASE_URL = process.env.REACT_APP_CHUCK_DOMAIN;

const getWithHeaders = (url) => fetch(url, {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
}).then(res => res.json()).then(data => data);

const CHUCK_BASE_LEASE_SETTINGS = (communityId) => `${CHUCK_BASE_URL}/api/onlineleasing/communities/${communityId}`;
const CHUCK_PERSONALIZED_LEASE_SETTINGS = (communityId, hash) => `${CHUCK_BASE_URL}/api/onlineleasing/communities/${communityId}/personalized/${hash}`;

const API = {};

API.fetchConfiguration = (communityId) => {
    return getWithHeaders(CHUCK_BASE_LEASE_SETTINGS(communityId));
};

API.fetchPersonalizedInfo = (communityId, hash) => {
    return getWithHeaders(CHUCK_PERSONALIZED_LEASE_SETTINGS(communityId, hash));
};


// const invalidCommunitites = new Set(['23', '44', '25']);
// if (invalidCommunitites.has(communityId)) return Promise.reject({ error: 'invalid community' });

// const payload = {
//     "name": "Cortland",
//     "street": "2173 Highland Ave S",
//     "city": "Birmingham",
//     "state": "AL",
//     "postal_code": 35205,
//     "terms_of_service": "https://some-link.com/something.pdf",
//     "privacy_policy": "https://some-link.com/something.pdf",
//     "logo": logoImage,
//     "background": backgroundImage,
//     "primary_color": "rgba(40,97,101,1)",
//     "secondary_color": "#FFFFFF",
//     "unit_number": "3B",
//     "monthly_rent": 5000,
// };
// if (hash) {
//     payload.client = {
//         "first_name": "Chester",
//         "last_name": "Cheetah",
//         "email": "chester@cheetos.com",
//         "phone": "+11231231234",
//     };
// }

// return Promise.resolve(payload);

API.fetchRenterProfile = () => {
    return Promise.resolve({
        completed_terms_and_conditions: false,
        _rental_options_config: [{ page: 'has_pets', limit: 1 }, { page: 'has_roommates', limit: 3 }],
        selected_rental_options: [],
        roommates: [],
        pets: [],
        guarantor: {},
    });
}

export default API;