import React from 'react';
import {shallow} from 'enzyme';
import { getStepperIndex, VerticalLinearStepper } from 'components/NavStepper';
import { ROUTES } from 'app/constants';

describe('getStepperIndex', function(){
    it('gets the correct index for an unnested route', function() {
        const routes = [
            {name: 'Current Address', value: ROUTES.ADDRESS},
            {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
            {name: 'Income & Employment', value: ROUTES.INCOME_AND_EMPLOYMENT},
            {name: 'Screening', value: ROUTES.SCREENING},
        ];
        
        const currentRoute = ROUTES.INCOME_AND_EMPLOYMENT;
        expect(getStepperIndex(routes, currentRoute)).toEqual(2);
    });

    it('returns -1 if route not found', function() {
        const routes = [
            {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
            {name: 'Rental Profile', value: ROUTES.PROFILE_OPTIONS},
            {name: 'Screening', value: ROUTES.SCREENING},
        ];
        
        const currentRoute = 'FAKEROUTE';
        expect(getStepperIndex(routes, currentRoute)).toEqual(-1);
    });
});

describe('VerticalLinearStepper', () => {
    const defaultProps = {
        initialPage: 'income',
        currentRoute: 'lease_settings',
        applicantStillFinishingApplication: true,
        navRoutes: [
            {
                name: 'lease settings',
                value: 'lease_settings',
            },
            {
                name: 'profile',
                value: 'profile',
            },
            {
                name: 'income',
                value: 'income',
            },
            {
                name: 'fees',
                value: 'fees',
            },
            {
                name: 'screening',
                value: 'screening',
            }
        ],
        config: {
            community: {
                contact_phone: '123-456-7891'
            }
        }
    };
    it('matches snapshot', () => {
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps}/>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('Application submitted state', function() {
    it('renders an application already submited message', function() {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891'
                }
            }
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const appCompletedMsg =  wrapper.find('.appCompletedMsg');
        expect(appCompletedMsg.text()).toContain('Your application has been completed and submitted. Please call us at 123‑456‑7891 if you have any questions.');
        expect(wrapper.find('#viewProgressButton').text()).toContain('View Progress');
    });

    it('View Progress when clicked takes to the initialPage set', function () {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891'
                }
            },
            history: {
                push: jest.fn(),
            },
            initialPage: '/application-complete',
        };
        let wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith('/application-complete');
    });
});

describe('Unit unavailable state', function() {
    it('Renders a unit unavailable message', function() {
        const defaultProps = {
            renterProfile: {
                unit_available: false,
            },
            applicantStillFinishingApplication: true,
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891'
                }
            }
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const appCompletedMsg =  wrapper.find('.unitUnavailableMsg');
        expect(appCompletedMsg.text()).toContain("We've placed your application on hold for now, since the apartment you were interested in is no longer available. Please call us at 123‑456‑7891 so we can discuss some other options.");
        expect(wrapper.find('#viewProgressButton').text()).toContain('View Progress');
    });

    it('View Progress when clicked takes to initialPage set', function() {
        const defaultProps = {
            renterProfile: {
                unit_available: false,
            },
            applicantStillFinishingApplication: true,
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891'
                }
            },
            history: {
                push: jest.fn(),
            },
            initialPage: ROUTES.UNIT_UNAVAILABLE,
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith('/unit-unavailable');
    });
});

describe('Guarantor requested state', function() {
    it('renders request guarantor message', function() {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891'
                }
            },
            initialPage: '/guarantor_request',
            guarantorRequested: true,
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const appCompletedMsg =  wrapper.find('.appCompletedMsg');
        expect(appCompletedMsg.text()).toContain('We’re waiting for you to add a guarantor. Please call us at 123‑456‑7891 if you have any questions or if you are unable or unwilling to add a guarantor.');
        expect(wrapper.find('#viewProgressButton').text()).toContain('View Progress');
    });

    it('View Progress when clicked takes to the initialPage set', function () {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891'
                }
            },
            history: {
                push: jest.fn(),
            },
            initialPage: '/guarantor_request',
            guarantorRequested: true,
        };
        let wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith('/guarantor_request');
    });
});

