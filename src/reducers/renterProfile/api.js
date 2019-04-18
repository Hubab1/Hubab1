const API = {};

API.fetchRenterProfile = () => {
    return Promise.resolve({
        completed_terms_and_conditions: false,
        rental_options: [{page: 'has_pets', limit: 1}, {page: 'has_roommates', limit: 3}],
        roommates: [],
        pets: [],
        guarantor: {},
    });
}

export default API;