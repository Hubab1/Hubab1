import React from 'react';
import { shallow } from 'enzyme';

import backgroundImage from 'assets/images/desktop_cortlandimg.png';
import logoImage from 'assets/images/cortland_logo.png';
import { WelcomePage } from './WelcomePage';
import { WelcomeTextContainer } from './styles';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        configuration: {
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
            "client": {
                "first_name": "Chester",
                "last_name": "Cheetah",
                "email": "chester@cheetos.com",
                "phone": "+11231231234",
            },
            "unit_number": "3B",
            "layout": "1 Bedroom",
            "monthly_rent": 5000,
        },
        theme: {palette:
            {primary:
                {main: "rgba(40,97,101,1)"}
            }
        },
    };
})

it('renders Hello <client name> when client is included in configuration', function(){
    const wrapper = shallow(<WelcomePage {...defaultProps}/>);

    expect(wrapper.text().includes('Hello Chester,')).toBeTruthy();
});

it('renders Hi There, when client is included in configuration', function(){
    delete defaultProps.configuration.client;
    const wrapper = shallow(<WelcomePage {...defaultProps}/>);

    expect(wrapper.text().includes('Hi There,')).toBeTruthy();
});

it('renders correct info when all client and unit info are passed', () => {
    const wrapper = shallow(<WelcomePage {...defaultProps}/>);

    expect(wrapper.find(WelcomeTextContainer).text()).toContain('Cortland');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('2173 Highland Ave S');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('Birmingham, AL 35205');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('Unit 3B');
});

it('renders correct info when all client and unit info is omitted', () => {
    delete defaultProps.configuration.unit_number;
    delete defaultProps.configuration.layout;

    const wrapper = shallow(<WelcomePage {...defaultProps}/>);

    expect(wrapper.find(WelcomeTextContainer).text()).toContain('Cortland');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('2173 Highland Ave S');
    expect(wrapper.find(WelcomeTextContainer).text()).toContain('Birmingham, AL 35205');
    expect(wrapper.find(WelcomeTextContainer).text()).not.toContain('Unit');

});
