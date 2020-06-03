import React from 'react';
import { shallow } from 'enzyme';

import { LeaseTermsPage } from './LeaseTermsPage';
import { ROLE_PRIMARY_APPLICANT } from 'app/constants';
import PriceBreakdown from './profile/options/PriceBreakdown';
import { Formik } from 'formik';


let defaultProps, updateRenterProfile;
beforeEach(() => {
    updateRenterProfile = jest.fn();
    defaultProps = {
        application: {},
        config: {
            lease_term_options: []
        },
        isPrimaryApplicant: true,
        updateRenterProfile: updateRenterProfile,
        _nextRoute: jest.fn(),
        applicant: {
            role: ROLE_PRIMARY_APPLICANT
        },
        pageComplete: jest.fn().mockResolvedValue({})
    }
});

describe('onSubmit', () => {
    it ('calls updateRenterProfile with valid parameters', function () {
        updateRenterProfile.mockResolvedValue({});
        const wrapper = shallow(<LeaseTermsPage {...defaultProps}/>);
        return wrapper.instance().onSubmit({lease_start_date: new Date('2019-8-15'), unit: {id: 123}, lease_term: 12}, 
            {setSubmitting: jest.fn(), setErrors: jest.fn()}
        ).then(() => {
            expect(defaultProps.updateRenterProfile).toHaveBeenCalledWith(
                {'lease_start_date': '2019-8-15', 'lease_term': 12, 'unit_id': 123},
                {'lease_start_date': '2019-8-15', 'lease_term': 12, 'unit': {id: 123}}
            )
        })
    })
    it ('does NOT call updateRenterProfile if isPrimaryApplicant == false', function () {
        updateRenterProfile.mockResolvedValue({});
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} isPrimaryApplicant={false}/>);
        return wrapper.instance().onSubmit({lease_start_date: new Date('2019-8-15'), unit: {id: 123}, lease_term: 12}, 
            {setSubmitting: jest.fn(), setErrors: jest.fn()}
        ).then(() => {
            expect(defaultProps.updateRenterProfile).not.toHaveBeenCalled();
            expect(defaultProps.pageComplete).toHaveBeenCalled();
        })
    })
    it ('calls pageComplete with lease_terms and nextRoute', function () {
        updateRenterProfile.mockResolvedValue({});
        const wrapper = shallow(<LeaseTermsPage {...defaultProps}/>);
        return wrapper.instance().onSubmit({unit: {id: 123}},
            {setSubmitting: jest.fn(), setErrors: jest.fn()}
        ).then(() => {
            expect(defaultProps.pageComplete).toHaveBeenCalledWith('lease_terms')
            expect(defaultProps._nextRoute).toHaveBeenCalled()
        })
    })
    it ('doesnt call pageComplete if if updateRenterProfile returns errors', function () {
        updateRenterProfile.mockResolvedValue({errors: 'you messed up'});
        const wrapper = shallow(<LeaseTermsPage {...defaultProps}/>);
        return wrapper.instance().onSubmit({unit: {id: 123}},
            {setSubmitting: jest.fn(), setErrors: jest.fn()}
        ).then(() => {
            expect(defaultProps.pageComplete).not.toHaveBeenCalled()
            expect(defaultProps._nextRoute).not.toHaveBeenCalled()
        })
    })
});

it ('renders PriceBreakdown if unit and lease-start_date and lease_term are set', function () {
    const application = {
        'lease_start_date': '2019-8-15', 'lease_term': 12, 'unit': 123
    }
    const wrapper = shallow(<LeaseTermsPage {...defaultProps} application={application}/>);
    expect(wrapper.find(Formik).dive().find(PriceBreakdown).length).toBe(1);
});
