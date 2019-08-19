import { getActiveStep } from 'components/NavStepper';
import { ROUTES } from 'app/constants';

describe('getActiveStep', function(){
    it('gets the correct index for an unnested route', function() {
        const routes = [
            {name: 'Your Profile', value: ROUTES.PROFILE},
            {name: 'Lease Terms', value: ROUTES.LEASE_TERMS},
            {name: 'Income & Employment', value: ROUTES.INCOME_AND_EMPLOYMENT},
            {name: 'Screening', value: ROUTES.SCREENING},
        ];
        
        const currentRoute = ROUTES.INCOME_AND_EMPLOYMENT;
        expect(getActiveStep(routes, currentRoute)).toEqual(2);
    });

    it('gets the correct index for a nested route', function() {
        const routes = [
            {name: 'Your Profile', value: ROUTES.PROFILE},
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
        expect(getActiveStep(routes, currentRoute)).toEqual(2);
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
        expect(getActiveStep(routes, currentRoute)).toEqual(-1);
    });
});