import React from 'react';
import { shallow } from 'enzyme';

import { MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED, ROUTES } from 'constants/constants';
import { getStepperIndex, VerticalLinearStepper } from './NavStepper';

describe('getStepperIndex', function () {
    it('gets the correct index for an unnested route', function () {
        const routes = [
            { name: 'Current Address', value: ROUTES.ADDRESS },
            { name: 'Lease Terms', value: ROUTES.LEASE_TERMS },
            { name: 'Income & Employment', value: ROUTES.INCOME_VERIFICATION_CONNECT },
            { name: 'Screening', value: ROUTES.SCREENING },
        ];

        const currentRoute = ROUTES.INCOME_VERIFICATION_CONNECT;
        expect(getStepperIndex(routes, currentRoute)).toEqual(2);
    });

    it('returns -1 if route not found', function () {
        const routes = [
            { name: 'Lease Terms', value: ROUTES.LEASE_TERMS },
            { name: 'Rental Profile', value: ROUTES.PROFILE_OPTIONS },
            { name: 'Screening', value: ROUTES.SCREENING },
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
            },
        ],
        config: {
            community: {
                contact_phone: '123-456-7891',
            },
        },
        handleDrawerClose: jest.fn(),
    };
    it('matches snapshot', () => {
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('Application submitted state', function () {
    it('renders an application already submited message', function () {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            handleDrawerClose: jest.fn(),
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const appCompletedMsg = wrapper.find('.appCompletedMsg');
        expect(appCompletedMsg.text()).toContain(
            'Your application has been completed and submitted. Please call us at 123‑456‑7891 if you have any questions.'
        );
        expect(wrapper.find('#viewProgressButton').text()).toContain('View Progress');
    });

    it('View Progress when clicked takes to the initialPage set', function () {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            history: {
                push: jest.fn(),
            },
            initialPage: '/application-complete',
            handleDrawerClose: jest.fn(),
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith('/application-complete');
        expect(defaultProps.handleDrawerClose).toHaveBeenCalled();
    });
});

describe('Unit unavailable state', function () {
    it('Renders a unit unavailable message', function () {
        const defaultProps = {
            renterProfile: {
                unit_available: false,
            },
            applicantStillFinishingApplication: true,
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            handleDrawerClose: jest.fn(),
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const appCompletedMsg = wrapper.find('.unitUnavailableMsg');
        expect(appCompletedMsg.text()).toContain(
            "We've placed your application on hold for now, since the apartment you were interested in is no longer available. Please call us at 123‑456‑7891 so we can discuss some other options."
        );
        expect(wrapper.find('#viewProgressButton').text()).toContain('View Progress');
    });

    it('View Progress when clicked takes to initialPage set', function () {
        const defaultProps = {
            renterProfile: {
                unit_available: false,
            },
            applicantStillFinishingApplication: true,
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            history: {
                push: jest.fn(),
            },
            initialPage: ROUTES.UNIT_UNAVAILABLE,
            handleDrawerClose: jest.fn(),
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith('/unit-unavailable');
    });
});

describe('Outstanding balance state', function () {
    it('renders outstanding balance message', function () {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            initialPage: ROUTES.OUTSTANDING_BALANCE,
            handleDrawerClose: jest.fn(),
        };

        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const outstandingBalance = wrapper.find('.outstandingBalance');
        const viewProgressButton = wrapper.find('#viewProgressButton');
        expect(outstandingBalance.text()).toContain(
            "You'll be able to move forward with your application once all outstanding balances have been paid."
        );
        expect(viewProgressButton.exists()).toEqual(true);
    });
});

describe('Holding deposit reagreement state', function () {
    it('renders Holding deposit reagreement message', function () {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            initialPage: ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT,
            handleDrawerClose: jest.fn(),
        };

        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const outstandingBalance = wrapper.find('.holdingDepositReagreement');
        const viewProgressButton = wrapper.find('#viewProgressButton');
        expect(outstandingBalance.text()).toContain('We’ll need you to agree to the new holding deposit terms');
        expect(viewProgressButton.exists()).toEqual(true);
    });
});

describe('Guarantor requested state', function () {
    it('renders request guarantor message', function () {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            initialPage: '/guarantor_request',
            guarantorRequested: true,
            handleDrawerClose: jest.fn(),
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const appCompletedMsg = wrapper.find('.appCompletedMsg');
        expect(appCompletedMsg.text()).toContain(
            'We’re waiting for you to add a guarantor. Please call us at 123‑456‑7891 if you have any questions or if you are unable or unwilling to add a guarantor.'
        );
        expect(wrapper.find('#viewProgressButton').text()).toContain('View Progress');
    });

    it('View Progress when clicked takes to the initialPage set', function () {
        const defaultProps = {
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            history: {
                push: jest.fn(),
            },
            initialPage: '/guarantor_request',
            guarantorRequested: true,
            handleDrawerClose: jest.fn(),
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith('/guarantor_request');
    });
});

describe('More documents needed', function () {
    it('Renders a more info needed message', function () {
        const defaultProps = {
            renterProfile: {
                unit_available: true,
                events: [{ event: MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED }],
            },
            applicantStillFinishingApplication: true,
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            handleDrawerClose: jest.fn(),
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const appCompletedMsg = wrapper.find('.appCompletedMsg');
        expect(appCompletedMsg.text()).toContain(
            'We’re requesting additional info to verify your income/assets. Please call us at 123‑456‑7891 if you have any questions.'
        );
        expect(wrapper.find('#viewProgressButton').text()).toContain('View Progress');
    });

    it('View Progress when clicked takes to initialPage set', function () {
        const defaultProps = {
            renterProfile: {
                unit_available: false,
            },
            applicantStillFinishingApplication: true,
            navRoutes: [],
            config: {
                community: {
                    contact_phone: '123-456-7891',
                },
            },
            history: {
                push: jest.fn(),
            },
            initialPage: ROUTES.INCOME_VERIFICATION_SUMMARY,
            handleDrawerClose: jest.fn(),
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        wrapper.find('#viewProgressButton').simulate('click');
        expect(defaultProps.history.push).toHaveBeenCalledWith('/income-employment/summary');
    });
});
