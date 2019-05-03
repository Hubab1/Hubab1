import backgroundImage from 'assets/images/desktop_cortlandimg.png';
import logoImage from 'assets/images/cortland_logo.png';

const API = {};

API.fetchLeaseSettings = (_communityId, hash) => {
    const payload = {
        "name": "Cortland",
        "street": "2173 Highland Ave S",
        "city": "Birmingham",
        "state": "AL",
        "postal_code": 35205,
        "terms_of_service": "https://some-link.com/something.pdf",
        "privacy_policy": "https://some-link.com/something.pdf",
        "logo": logoImage,
        "background_image": backgroundImage,
        "primary_color": "rgba(40,97,101,1)",
        "secondary_color": "#FFFFFF",
        "unit_number": "3B",
        "monthly_rent": 5000,
    };
    if (hash) {
        payload.client = {
            "first_name": "Chester",
            "last_name": "Cheetah",
            "email": "chester@cheetos.com",
            "phone": "+11231231234",
        };
    }
    
    return Promise.resolve(payload);
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
