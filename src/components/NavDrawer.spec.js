import React from 'react';
import {shallow} from 'enzyme';
import { getStepperIndex } from 'components/NavStepper';
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