import React from 'react';
import { shallow } from 'enzyme';

import { App } from 'App';
import { WelcomePage } from 'components/main/WelcomePage';
import history from 'history.js';
import executeAfterPromises from 'tests/utils/executeAfterPromises';
import auth from 'utils/auth';

let defaultProps, leaseSettingsObject, fetchLeaseSettingsPromise;

beforeEach(() => {

    leaseSettingsObject = {
        "name": "Cortland",
        "street": "2173 Highland Ave S",
        "city": "Birmingham",
        "state": "AL",
        "postal_code": 35205,
        "terms_of_service": "https://some-link.com/something.pdf",
        "privacy_policy": "https://some-link.com/something.pdf",
        "logo": "https://cdn.freebiesupply.com/logos/large/2x/cheetos-logo-png-transparent.png",
        "background_image": "https://vignette.wikia.nocookie.net/stupididy/images/1/19/Chester_Cheetah.jpg/revision/latest?cb=20161013224811",
        "primary_color": "#000000",
        "secondary_color": "#FFA500",
        "client": {
        "first_name": "Chester",
        "last_name": "Cheetah",
        "email": "chester@cheetos.com",
        "phone": "+11231231234",
        },
        "unit_number": "3B",
        "monthly_rent": 5000,
    };

    fetchLeaseSettingsPromise = Promise.resolve(leaseSettingsObject);

    defaultProps = {
    fetchRenterProfile: jest.fn(),
    fetchLeaseSettings: jest.fn().mockReturnValue(fetchLeaseSettingsPromise),
    profile: null,
    }
})



describe('componentDidMount', () => {
    it('calls fetchLeaseSettings', function () {
        const wrapper = shallow(<App { ...defaultProps} />);

        expect(defaultProps.fetchLeaseSettings).toHaveBeenCalledTimes(1);

    });


})
