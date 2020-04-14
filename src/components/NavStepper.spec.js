import React from 'react';
import {mount, shallow} from 'enzyme';
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

    it('gets the correct index for a nested route', function() {
        const routes = [
            {name: 'Current Address', value: ROUTES.ADDRESS},
            {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
            {name: 'Rental Profile', value: ROUTES.PROFILE_OPTIONS, subRoutes: [
                {name: 'Roommates', value: ROUTES.CO_APPLICANTS},
                {name: 'Guarantor', value: ROUTES.GUARANTOR},
                {name: 'Pets', value: ROUTES.PETS},
            ]},
            {name: 'Income & Employment', value: ROUTES.INCOME_AND_EMPLOYMENT},
            {name: 'Screening', value: ROUTES.SCREENING},
        ];
        
        const currentRoute = ROUTES.GUARANTOR;
        expect(getStepperIndex(routes, currentRoute)).toEqual(2);
    });

    it('returns -1 if route not found', function() {
        const routes = [
            {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
            {name: 'Rental Profile', value: ROUTES.PROFILE_OPTIONS, subRoutes: [
                {name: 'Roommates', value: ROUTES.CO_APPLICANTS},
                {name: 'Guarantor', value: ROUTES.GUARANTOR},
            ]},
            {name: 'Screening', value: ROUTES.SCREENING},
        ];
        
        const currentRoute = 'FAKEROUTE';
        expect(getStepperIndex(routes, currentRoute)).toEqual(-1);
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
        const wrapper = mount(<VerticalLinearStepper {...defaultProps} />);
        const appCompletedMsg =  wrapper.find('.appCompletedMsg');
        expect(appCompletedMsg.text()).toContain('Your application has been completed and submitted. Please call us at 123-456-7891 if you have any questions.');
        const viewProgressButton = wrapper.find('#viewProgressButton').find('.MuiButton-label');
        expect(viewProgressButton.text()).toContain('View Progress');
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
    })
});
