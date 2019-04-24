const API = {};

API.fetchLeaseSettings = () => {
    return Promise.resolve({
        community_branding: {
            splash_image: 'https://vignette.wikia.nocookie.net/stupididy/images/1/19/Chester_Cheetah.jpg/revision/latest?cb=20161013224811',
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/cheetos-logo-png-transparent.png',
            primary_color: '#000000',
            secondary_color: '#FFA500',
        },
        client: {
            first_name: 'Chester',
            last_name: 'Cheetoh',
            email: 'chester@cheetoh.com',
            phone: '(666) 777-8888',
            has_application: false,
        },
        unit: {
            number: 23,
            rent: 1234,
        },
        name: 'Cheetoh Mansion',
        address: '123 Fake St.',
        toc_link: 'www.link.com',
        pp_link: 'www.something.com',
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
