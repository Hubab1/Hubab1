import React from 'react';
import { shallow } from 'enzyme';

import backgroundImage from 'assets/images/desktop_cortlandimg.png';
import logoImage from 'assets/images/cortland_logo.png';
import { WelcomePage } from './WelcomePage';
import { WelcomeInfoTitle, WelcomeInfo } from './styles';

let defaultProps, context;
beforeEach(() => {
    defaultProps = {
        leaseSettings: {
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

it('renders Hello <client name> when client is included in leaseSettings', function(){
    const wrapper = shallow(<WelcomePage {...defaultProps}/>);

    expect(wrapper.text().includes('Hello Chester,')).toBeTruthy();
});

it('renders Hi There, when client is included in leaseSettings', function(){
    delete defaultProps.leaseSettings.client;
    const wrapper = shallow(<WelcomePage {...defaultProps}/>);

    expect(wrapper.text().includes('Hi There,')).toBeTruthy();
});

describe('renderWelcomeInfo', () => {
    it('renders correct info when all client and unit info are passed', () => {
        const wrapper = shallow(<WelcomePage {...defaultProps}/>);

        expect(wrapper.instance().renderWelcomeInfo().length).toEqual(4)
        expect(wrapper.instance().renderWelcomeInfo()[0].props.children).toEqual('Cortland');
        expect(wrapper.instance().renderWelcomeInfo()[1].props.children).toEqual('2173 Highland Ave S');
        expect(wrapper.instance().renderWelcomeInfo()[2].props.children).toEqual('1 Bedroom - 3B');
        expect(wrapper.instance().renderWelcomeInfo()[3].props.children).toEqual('Birmingham, AL 35205');
   });
    it('renders correct info when all client and unit info is omitted', () => {
        delete defaultProps.leaseSettings.unit_number;
        delete defaultProps.leaseSettings.layout;

        const wrapper = shallow(<WelcomePage {...defaultProps}/>);

        expect(wrapper.instance().renderWelcomeInfo().length).toEqual(3)
        expect(wrapper.instance().renderWelcomeInfo()[0].props.children).toEqual('Cortland');
        expect(wrapper.instance().renderWelcomeInfo()[1].props.children).toEqual('2173 Highland Ave S');
        expect(wrapper.instance().renderWelcomeInfo()[2].props.children).toEqual('Birmingham, AL 35205');
   });
});
