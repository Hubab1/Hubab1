const API = {};

API.fetchRenterProfile = () => {
    return Promise.resolve({
        completed_terms_and_conditions: true,
        _rental_options_config: [{page: 'has_pets', limit: 1}, {page: 'has_roommates', limit: 3}],
        selected_rental_options: [],
        roommates: [],
        pets: [],
        guarantor: {},
    });
}

export default API;