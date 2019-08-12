import React from 'react';
import { shallow } from 'enzyme';

import { getIncomeRequirementText } from 'utils/misc';
import { YourIncome, IncomeEntry } from './YourIncome';
import { ROLE_GUARANTOR, ROLE_PRIMARY_APPLICANT, ROLE_COAPPLICANT } from 'app/constants';


let defaultProps;
beforeEach(() => {
    defaultProps = {
        config: {
            guarantor_income_requirement_multiplier: 80,
            applicant_income_requirements: 40    
        },
        applicant: {role: ROLE_PRIMARY_APPLICANT},
        profile: { unit: { price: 10 } },
        incomeEntries: [ {name: 'White Castle', income: 1234, id:123}, {name:'Nestio', income: 1234, id: 345} ],
        incomeTotal: 1234,
        values: {123: 'White Castle', 345: 'Nestio'}
    };
})

it('renders correct text for main applicant with associated unit', function(){
    expect(getIncomeRequirementText(defaultProps)).toEqual('The total income required for all members of the application is 40x the rent: $400')
});

it('renders correct text for co-applicant with associated unit', function(){
    defaultProps.applicant.role = ROLE_COAPPLICANT;
    expect(getIncomeRequirementText(defaultProps)).toEqual('The total income required for all members of the application is 40x the rent: $400')
});

it('renders correct text for guarantor with associated unit', function(){
    defaultProps.applicant.role = ROLE_GUARANTOR;
    expect(getIncomeRequirementText(defaultProps)).toEqual('The total income required for a guarantor on the application is 80x the rent: $800')
});


it('renders correct text for main applicant and no associated unit', function(){
    defaultProps.applicant.role = ROLE_PRIMARY_APPLICANT;
    defaultProps.profile.unit = null;
    expect(getIncomeRequirementText(defaultProps)).toEqual('The total income required for all members of the application is 40x the rent')
});

it('renders correct text for co-applicant and no associated unit', function(){
    defaultProps.applicant.role = ROLE_COAPPLICANT;
    defaultProps.profile.unit = null;
    expect(getIncomeRequirementText(defaultProps)).toEqual('The total income required for all members of the application is 40x the rent')
});

it('renders correct text for guarantor and no associated unit', function(){
    defaultProps.applicant.role = ROLE_GUARANTOR;
    defaultProps.profile.unit = null;
    expect(getIncomeRequirementText(defaultProps)).toEqual('The total income required for a guarantor on the application is 80x the rent')
});

it('renders an IncomeEntry for each item in incomeEntry array', () => {
    const wrapper = shallow(<YourIncome {...defaultProps}/>);
    expect(wrapper.find(IncomeEntry).length).toEqual(2);
})

