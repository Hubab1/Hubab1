import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import { ValidationError } from 'yup';

import { LeaseTermsPage, leaseTermsValidationSchema } from './LeaseTermsPage';
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

describe('validationSchema', () => {
    let schema, referenceDate;

    beforeEach(() => {
        schema = leaseTermsValidationSchema;
        referenceDate = moment().startOf('day');
    });

    function getValidData() {
        return {
            lease_start_date: moment(referenceDate).add(5, 'days').format('MM/DD/YYYY'),
            unit: {
                id: '1',
                unit_number: '15',
                date_available: moment(referenceDate).subtract(5, 'days').format('YYYY-MM-DD'),
            },
            lease_term: 12,
        }
    }

    async function verifyErrorMessage(data, field, expectedMessage) {
        try {
            await schema.validate(data);
        } catch (error) {
            expect(error.name).toBe('ValidationError');
            expect(error.path).toBe(field);
            expect(error.message).toBe(expectedMessage);
            return;
        }

        throw Error('ValidationError was not thrown');
    }

    async function verifyValid(data) {
        const result = await schema.validate(data);
        expect(result).toBe(data);
    }

    it ('should be valid when a valid date is entered', async() => {
        const data = getValidData();

        await verifyValid(data);
    });

    it ('should be invalid when no date is entered', async () => {
        const errorSelectDate = 'Select a Move In Date';

        const data = getValidData();

        data.lease_start_date = undefined
        await verifyErrorMessage(data, 'lease_start_date', errorSelectDate);

        data.lease_start_date = ''
        await verifyErrorMessage(data, 'lease_start_date', errorSelectDate);
    });

    it ('should be invalid when invalid dates are entered', async () => {
        const errorInvalidFormat = 'Invalid date';

        const data = getValidData();

        data.lease_start_date = 'abc';
        await verifyErrorMessage(data, 'lease_start_date', errorInvalidFormat);

        data.lease_start_date = 'abc-123';
        await verifyErrorMessage(data, 'lease_start_date', errorInvalidFormat);

        data.lease_start_date = '1/2/345';
        await verifyErrorMessage(data, 'lease_start_date', errorInvalidFormat);

        data.lease_start_date = '14/22/2050';
        await verifyErrorMessage(data, 'lease_start_date', errorInvalidFormat);
    });

    it('should verify that the lease start date is on or after today', async () => {
        const errorDateOld = 'Move In Date must be on or after today';

        const data = getValidData();

        data.lease_start_date = moment(referenceDate).subtract(2, 'days').format('MM/DD/YYYY');
        await verifyErrorMessage(data, 'lease_start_date', errorDateOld);

        data.lease_start_date = moment(referenceDate).subtract(1, 'days').format('MM/DD/YYYY');
        await verifyErrorMessage(data, 'lease_start_date', errorDateOld);

        data.lease_start_date = moment(referenceDate).format('MM/DD/YYYY');
        await verifyValid(data);

        data.lease_start_date = moment(referenceDate).add(1, 'days').format('MM/DD/YYYY');
        await verifyValid(data);
    });

    it('should verify that the selected lease start date is on or after unit available date', async () => {
        const data = getValidData();

        const dateAvailable = moment(referenceDate).add(7, 'days')
        data.unit.date_available = dateAvailable.format('YYYY-MM-DD');

        const errorMessage = `Oops! Unit ${data.unit.unit_number} isn’t available until ${dateAvailable.format('M/D/YY')}`

        await verifyErrorMessage(data, 'lease_start_date', errorMessage);
    });
    
});
