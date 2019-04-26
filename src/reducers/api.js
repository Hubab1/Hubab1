const API = {};

API.fetchLeaseSettings = () => {
    return Promise.resolve({
        "name": "Cortland",
        "street": "2173 Highland Ave S",
        "city": "Birmingham",
        "state": "AL",
        "postal_code": 35205,
        "terms_of_service": "https://some-link.com/something.pdf",
        "privacy_policy": "https://some-link.com/something.pdf",
        "logo": "https://cdn.freebiesupply.com/logos/large/2x/cheetos-logo-png-transparent.png",
        "background_image": "https://vignette.wikia.nocookie.net/stupididy/images/1/19/Chester_Cheetah.jpg/revision/latest?cb=20161013224811",
        "primary_color": "rgba(40,97,101,1)",
        "secondary_color": "#FFFFFF",
        "client": {
        "first_name": "Chester",
        "last_name": "Cheetah",
        "email": "chester@cheetos.com",
        "phone": "+11231231234",
        },
        "unit_number": "3B",
        "monthly_rent": 5000,
    });
}

API.fetchRenterProfile = () => {
    return Promise.resolve({
        completed_terms_and_conditions: false,
        _rental_options_config: [{page: 'has_pets', limit: 1}, {page: 'has_roommates', limit: 3}],
        selected_rental_options: [],
        roommates: [],
        pets: [],
        guarantor: {},
    });
}

export default API;
