import React from 'react';
import { shallow } from 'enzyme';

import { LeaseTermsPage } from './LeaseTermsPage';
import { ROLE_PRIMARY_APPLICANT } from 'app/constants';


let defaultProps, updateRenterProfile;
beforeEach(() => {
    updateRenterProfile = jest.fn();
    defaultProps = {
        updateRenterProfile: updateRenterProfile,
        _nextRoute: jest.fn(),
        applicant: {
            role: ROLE_PRIMARY_APPLICANT
        }
    }
});

describe('onSubmit', () => {
    it ('calls updateRenterProfile with valid parameters', function () {
        updateRenterProfile.mockReturnValue(Promise.resolve({}));
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
});