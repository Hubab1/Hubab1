import React from 'react';
import { shallow } from 'enzyme';
import { addDays, subDays, format } from 'date-fns';
import { Formik } from 'formik';

import { LeaseTermsPage, leaseTermsValidationSchema } from './LeaseTermsPage';
import { ROLE_PRIMARY_APPLICANT } from 'app/constants';
import PriceBreakdown from './profile/options/PriceBreakdown';
import GenericFormDetail from './common/GenericFormMessage';

let defaultProps, updateRenterProfile;
beforeEach(() => {
    updateRenterProfile = jest.fn();
    defaultProps = {
        application: {},
        config: {
            lease_term_options: [],
            community: {
                contact_phone: '555-555-5555',
            },
            leasing_pricing_disclaimer: 'test disclaimer',
        },
        isPrimaryApplicant: true,
        updateRenterProfile: updateRenterProfile,
        _nextRoute: jest.fn(),
        applicant: {
            role: ROLE_PRIMARY_APPLICANT,
        },
        pageComplete: jest.fn().mockResolvedValue({}),
    };
});

describe('onSubmit', () => {
    it('calls updateRenterProfile with valid parameters', function () {
        updateRenterProfile.mockResolvedValue({});
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} />);
        return wrapper
            .instance()
            .onSubmit(
                { lease_start_date: new Date('2019-8-15'), unit: { id: 123 }, lease_term: 12 },
                { setSubmitting: jest.fn(), setErrors: jest.fn() }
            )
            .then(() => {
                expect(defaultProps.updateRenterProfile).toHaveBeenCalledWith(
                    { lease_start_date: '2019-8-15', lease_term: 12, unit_id: 123 },
                    { lease_start_date: '2019-8-15', lease_term: 12, unit: { id: 123 } }
                );
            });
    });
    it('does NOT call updateRenterProfile if isPrimaryApplicant == false', function () {
        updateRenterProfile.mockResolvedValue({});
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} isPrimaryApplicant={false} />);
        return wrapper
            .instance()
            .onSubmit(
                { lease_start_date: new Date('2019-8-15'), unit: { id: 123 }, lease_term: 12 },
                { setSubmitting: jest.fn(), setErrors: jest.fn() }
            )
            .then(() => {
                expect(defaultProps.updateRenterProfile).not.toHaveBeenCalled();
                expect(defaultProps.pageComplete).toHaveBeenCalled();
            });
    });
    it('calls pageComplete with lease_terms and nextRoute', function () {
        updateRenterProfile.mockResolvedValue({});
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} />);
        return wrapper
            .instance()
            .onSubmit({ unit: { id: 123 } }, { setSubmitting: jest.fn(), setErrors: jest.fn() })
            .then(() => {
                expect(defaultProps.pageComplete).toHaveBeenCalledWith('lease_terms');
                expect(defaultProps._nextRoute).toHaveBeenCalled();
            });
    });
    it('doesnt call pageComplete if if updateRenterProfile returns errors', function () {
        updateRenterProfile.mockResolvedValue({ errors: 'you messed up' });
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} />);
        return wrapper
            .instance()
            .onSubmit({ unit: { id: 123 } }, { setSubmitting: jest.fn(), setErrors: jest.fn() })
            .then(() => {
                expect(defaultProps.pageComplete).not.toHaveBeenCalled();
                expect(defaultProps._nextRoute).not.toHaveBeenCalled();
            });
    });
});

it('renders PriceBreakdown if unit and lease-start_date and lease_term are set', function () {
    const application = {
        lease_start_date: '2019-8-15',
        lease_term: 12,
        unit: 123,
    };
    const wrapper = shallow(<LeaseTermsPage {...defaultProps} application={application} />);
    expect(wrapper.find(Formik).dive().find(PriceBreakdown).length).toBe(1);
});

it('renders leasing pricing disclaimer if unit and lease-start_date and lease_term are set', function () {
    const application = {
        lease_start_date: '2019-8-15',
        lease_term: 12,
        unit: 123,
    };
    const wrapper = shallow(<LeaseTermsPage {...defaultProps} application={application} />);
    expect(wrapper.find(Formik).dive().getElement()).toMatchSnapshot();
});

describe('validationSchema', () => {
    let schema, referenceDate;

    beforeEach(() => {
        schema = leaseTermsValidationSchema;
        referenceDate = new Date().setHours(0, 0, 0, 0);
    });

    function getValidData() {
        return {
            lease_start_date: addDays(referenceDate, 5),
            unit: {
                id: '1',
                unit_number: '15',
                date_available: format(subDays(referenceDate, 5), 'yyyy-MM-dd'),
            },
            lease_term: 12,
        };
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

    it('should be valid when a valid date is entered', async () => {
        const data = getValidData();

        await verifyValid(data);
    });

    it('should be invalid when no date is entered', async () => {
        const errorSelectDate = 'Select a Move In Date';

        const data = getValidData();

        data.lease_start_date = undefined;
        await verifyErrorMessage(data, 'lease_start_date', errorSelectDate);

        data.lease_start_date = null;
        await verifyErrorMessage(data, 'lease_start_date', errorSelectDate);
    });

    it('should be invalid when invalid dates are entered', async () => {
        const errorInvalidFormat = 'Invalid Date Format';

        const data = getValidData();

        data.lease_start_date = 'abc';
        await verifyErrorMessage(data, 'lease_start_date', errorInvalidFormat);

        data.lease_start_date = '14/22/2050';
        await verifyErrorMessage(data, 'lease_start_date', errorInvalidFormat);
    });

    it('should verify that the lease start date is on or after today', async () => {
        const data = getValidData();
        data.unit = {
            id: 123,
            unit_number: '15',
        };

        const errorMessage = `Oops! Unit ${data.unit.unit_number} isn’t available until ${format(
            referenceDate,
            'M/d/yy'
        )}`;

        data.lease_start_date = subDays(referenceDate, 2);
        await verifyErrorMessage(data, 'lease_start_date', errorMessage);

        data.lease_start_date = subDays(referenceDate, 1);
        await verifyErrorMessage(data, 'lease_start_date', errorMessage);

        data.lease_start_date = addDays(referenceDate, 1);
        await verifyValid(data);
    });

    it('should verify that the selected lease start date is on or after unit available date', async () => {
        const data = getValidData();

        const dateAvailable = addDays(referenceDate, 7);
        data.unit.date_available = format(dateAvailable, 'yyyy-MM-dd');

        const errorMessage = `Oops! Unit ${data.unit.unit_number} isn’t available until ${format(
            dateAvailable,
            'M/d/yy'
        )}`;

        data.lease_start_date = subDays(dateAvailable, 1);
        await verifyErrorMessage(data, 'lease_start_date', errorMessage);

        data.lease_start_date = new Date(dateAvailable);
        await verifyValid(data);

        data.lease_start_date = addDays(dateAvailable, 1);
        await verifyValid(data);
    });
});

it('displays error when hasError=true', function () {
    const wrapper = shallow(<LeaseTermsPage {...defaultProps} />);
    wrapper.setState({ hasError: true });
    expect(wrapper.find(GenericFormDetail).length).toBe(1);
    expect(wrapper.find(GenericFormDetail).prop('messages')).toContain(
        "Oops, we're having trouble calculating the pricing for your selections. Try selecting different terms, or call us at 555‑555‑5555 if this still isn’t working in a bit."
    );
});
