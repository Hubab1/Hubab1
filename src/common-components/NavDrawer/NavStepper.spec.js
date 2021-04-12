import React from 'react';
import { shallow } from 'enzyme';

import { NavBlockedInProgressStep, NavBlockedCompletedStep } from 'common-components/NavDrawer/NavBlockedStep';
import { MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED, ROUTES } from 'constants/constants';
import { getStepperIndex, VerticalLinearStepper } from 'common-components/NavDrawer/NavStepper';
import { generatePath } from 'react-router';

describe('getStepperIndex', function () {
    const application = {
        id: 1,
    };

    it('gets the correct index for an unnested route', function () {
        const routes = [
            { name: 'Current Address', value: ROUTES.ADDRESS },
            { name: 'Lease Terms', value: ROUTES.LEASE_TERMS },
            { name: 'Income & Employment', value: ROUTES.INCOME_VERIFICATION_CONNECT },
            { name: 'Screening', value: ROUTES.SCREENING },
        ];

        const currentRoute = generatePath(ROUTES.INCOME_VERIFICATION_CONNECT, { application_id: 1 });
        expect(getStepperIndex(routes, currentRoute, application)).toEqual(2);
    });

    it('returns -1 if route not found', function () {
        const routes = [
            { name: 'Lease Terms', value: ROUTES.LEASE_TERMS },
            { name: 'Rental Profile', value: ROUTES.PROFILE_OPTIONS },
            { name: 'Screening', value: ROUTES.SCREENING },
        ];

        const currentRoute = 'FAKEROUTE';
        expect(getStepperIndex(routes, currentRoute, application)).toEqual(-1);
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
        renterProfile: {
            id: 1,
        },
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
            applicantStillFinishingApplication: false,
            renterProfile: {
                id: 1,
            },
        };
        const wrapper = shallow(<VerticalLinearStepper {...defaultProps} />);
        const step = wrapper.find(NavBlockedCompletedStep);
        expect(step.prop('text')).toBe('Your application has been completed and submitted.');
    });
});

describe('Unit unavailable state', function () {
    it('Renders a unit unavailable message', function () {
        const defaultProps = {
            renterProfile: {
                unit_available: false,
                id: 2,
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
        const step = wrapper.find(NavBlockedInProgressStep);
        expect(step.prop('text')).toBe(
            "We've placed your application on hold for now, since the apartment you were interested in is no longer available."
        );
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
        const step = wrapper.find(NavBlockedInProgressStep);
        expect(step.prop('text')).toBe(
            "You'll be able to move forward with your application once all outstanding balances have been paid."
        );
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
        const step = wrapper.find(NavBlockedInProgressStep);
        expect(step.prop('text')).toBe('We’ll need you to agree to the new holding deposit terms.');
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
        const step = wrapper.find(NavBlockedInProgressStep);
        expect(step.prop('text')).toBe('We’re waiting for you to add a guarantor.');
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
        const step = wrapper.find(NavBlockedInProgressStep);
        expect(step.prop('text')).toBe('We’re requesting additional info to verify your income/assets.');
    });
});
