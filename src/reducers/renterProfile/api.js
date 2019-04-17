const API = {};

API.fetchRenterProfile = () => {
    return Promise.resolve({
        completed_terms_and_conditions: false,
        lets_talk_about: [],
        roommates: [],
        pets: [],
        guarantor: {}
    });
}

export default API;