import React from 'react';
import { shallow } from 'enzyme';
import { addDays, subDays, format } from 'date-fns';
import { Formik } from 'formik';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { ROLE_PRIMARY_APPLICANT } from 'constants/constants';
import { LeaseTermsPage, validationSchema } from './LeaseTermsPage';

import PriceBreakdown from 'common-components/PriceBreakdown/PriceBreakdown';
import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';
import AvailableUnitsSelector from 'pages/LeaseTerms/components/AvailableUnitsSelector';
import AvailableLeaseTermsSelector from 'pages/LeaseTerms/components/AvailableLeaseTermsSelector';

let defaultProps;
let updateRenterProfile;

beforeEach(() => {
    updateRenterProfile = jest.fn();
    defaultProps = {
        applicant: {
            role: ROLE_PRIMARY_APPLICANT,
        },
        application: {},
        config: {
            lease_term_options: [],
            community: {
                contact_phone: '555-555-5555',
                company: {},
            },
            leasing_pricing_disclaimer: 'test disclaimer',
        },
        isPrimaryApplicant: true,
        hasOutstandingBalance: true,
        updateRenterProfile: updateRenterProfile,
        toggleLoader: jest.fn(),
        _nextRoute: jest.fn(),
        pageComplete: jest.fn().mockResolvedValue({}),
    };
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('validationSchema', () => {
    let referenceDate;

    beforeEach(() => {
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

    async function verifyErrorMessage(data, field, expectedMessage, acceptedLeaseStartDateRange = 60) {
        try {
            await validationSchema(acceptedLeaseStartDateRange).validate(data);
        } catch (error) {
            expect(error.name).toBe('ValidationError');
            expect(error.path).toBe(field);
            expect(error.message).toBe(expectedMessage);
            return;
        }

        throw Error('ValidationError was not thrown');
    }

    async function verifyValid(data, acceptedLeaseStartDateRange = 60) {
        const result = await validationSchema(acceptedLeaseStartDateRange).validate(data);
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

    it('should verify that the selected lease start date is within the accepted lease start date range', async () => {
        const data = getValidData();
        const acceptedLeaseStartDateRange = 45;
        const errorMessage = `Enter a date within ${acceptedLeaseStartDateRange} days of today`;

        const dateAvailable = addDays(referenceDate, 7);
        data.unit.date_available = format(dateAvailable, 'yyyy-MM-dd');

        data.lease_start_date = addDays(dateAvailable, acceptedLeaseStartDateRange + 1);
        await verifyErrorMessage(data, 'lease_start_date', errorMessage, acceptedLeaseStartDateRange);

        data.lease_start_date = addDays(dateAvailable, acceptedLeaseStartDateRange + 2);
        await verifyErrorMessage(data, 'lease_start_date', errorMessage, acceptedLeaseStartDateRange);

        data.lease_start_date = new Date(dateAvailable);
        await verifyValid(data, acceptedLeaseStartDateRange);
    });

    it('should not verify that the selected lease start date is within an accepted lease start date range if there is none', async () => {
        const data = getValidData();
        const acceptedLeaseStartDateRange = null;

        const dateAvailable = addDays(referenceDate, 7);
        data.unit.date_available = format(dateAvailable, 'yyyy-MM-dd');

        data.lease_start_date = new Date(dateAvailable);
        await verifyValid(data, acceptedLeaseStartDateRange);
    });
});

describe('handleSubmit', () => {
    it('calls updateRenterProfile with valid parameters', async () => {
        const updateRenterProfile = jest.fn().mockReturnValue(Promise.resolve({}));
        const wrapper = shallow(
            <LeaseTermsPage {...defaultProps} isPrimaryApplicant={true} updateRenterProfile={updateRenterProfile} />
        );
        const submitHandler = wrapper.find(Formik).props().onSubmit;

        await submitHandler(
            { lease_start_date: new Date('2019-8-15'), unit: { id: 123 }, lease_term: 12 },
            { setErrors: jest.fn(), setSubmitting: jest.fn() }
        );

        expect(updateRenterProfile).toHaveBeenCalledWith(
            { lease_start_date: '2019-8-15', lease_term: 12, unit_id: 123 },
            { lease_start_date: '2019-8-15', lease_term: 12, unit: { id: 123 } }
        );
    });

    it('does NOT call updateRenterProfile if isPrimaryApplicant == false', async () => {
        const updateRenterProfile = jest.fn().mockReturnValue(Promise.resolve({}));
        const wrapper = shallow(
            <LeaseTermsPage {...defaultProps} isPrimaryApplicant={false} updateRenterProfile={updateRenterProfile} />
        );
        const submitHandler = wrapper.find(Formik).props().onSubmit;

        await submitHandler(
            { lease_start_date: new Date('2019-8-15'), unit: { id: 123 }, lease_term: 12 },
            { setErrors: jest.fn(), setSubmitting: jest.fn() }
        );

        expect(updateRenterProfile).not.toHaveBeenCalled();
        expect(defaultProps.pageComplete).toHaveBeenCalled();
        expect(defaultProps._nextRoute).toHaveBeenCalled();
    });

    it('calls pageComplete with lease_terms and nextRoute', async () => {
        const updateRenterProfile = jest.fn().mockReturnValue(Promise.resolve({}));
        const wrapper = shallow(
            <LeaseTermsPage {...defaultProps} isPrimaryApplicant={true} updateRenterProfile={updateRenterProfile} />
        );
        const submitHandler = wrapper.find(Formik).props().onSubmit;

        await submitHandler({ unit: { id: 123 } }, { setErrors: jest.fn(), setSubmitting: jest.fn() });

        expect(defaultProps.pageComplete).toHaveBeenCalledWith('lease_terms');
        expect(defaultProps._nextRoute).toHaveBeenCalled();
    });

    it('doesnt call pageComplete if if updateRenterProfile returns errors and displays error', async () => {
        const updateRenterProfile = jest.fn().mockReturnValue(Promise.reject({}));
        const wrapper = shallow(
            <LeaseTermsPage {...defaultProps} isPrimaryApplicant={true} updateRenterProfile={updateRenterProfile} />
        );
        const submitHandler = wrapper.find(Formik).props().onSubmit;

        await submitHandler({ unit: { id: 123 } }, { setErrors: jest.fn(), setSubmitting: jest.fn() });

        expect(defaultProps.pageComplete).not.toHaveBeenCalled();
        expect(defaultProps._nextRoute).not.toHaveBeenCalled();
        expect(wrapper.find(GenericFormMessage).length).toBe(1);
        expect(wrapper.find(GenericFormMessage).prop('messages')).toContain(
            "Oops, we're having trouble calculating the pricing for your selections. Try selecting different terms, or call us at 555‑555‑5555 if this still isn’t working in a bit."
        );
    });

    it('shows correct error when unit is unavailable', async () => {
        const updateRenterProfile = jest.fn().mockReturnValue(
            Promise.resolve({
                errors: {
                    unit_id: 'error',
                },
            })
        );

        const wrapper = shallow(
            <LeaseTermsPage {...defaultProps} isPrimaryApplicant={true} updateRenterProfile={updateRenterProfile} />
        );
        const submitHandler = wrapper.find(Formik).props().onSubmit;
        await submitHandler(
            { lease_start_date: new Date('2019-8-15'), unit: { id: 123 }, lease_term: 12 },
            { setErrors: jest.fn(), setSubmitting: jest.fn() }
        );

        expect(wrapper.find(GenericFormMessage).length).toBe(1);
        expect(wrapper.find(GenericFormMessage).prop('messages')).toBe(
            `We're sorry, it looks like this unit is not available. Please select another unit, or call us at 555‑555‑5555 if you are having further issues.`
        );
    });
});

describe('render', () => {
    it('renders PriceBreakdown if unit and lease_start_date and lease_term are set', () => {
        const application = {
            lease_start_date: '2019-8-15',
            lease_term: 12,
            unit: 123,
        };
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} application={application} />);
        expect(wrapper.find(Formik).dive().find(PriceBreakdown).length).toBe(1);
    });

    it('renders leasing pricing disclaimer if unit and lease-start_date and lease_term are set', () => {
        const application = {
            lease_start_date: '2019-8-15',
            lease_term: 12,
            unit: 123,
        };
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} application={application} />);
        expect(wrapper.find(Formik).dive().text()).toContain(defaultProps.config.leasing_pricing_disclaimer);
    });

    it('displays error when !hasOutstandingBalance', () => {
        defaultProps.hasOutstandingBalance = false;
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} />);
        expect(wrapper.find(GenericFormMessage).length).toBe(1);
        expect(wrapper.find(GenericFormMessage).prop('messages')).toContain(
            "Please call us at 555‑555‑5555 if you'd like to make any changes to your lease details."
        );
    });

    it('disables form fields when !hasOutstandingBalance', () => {
        defaultProps.hasOutstandingBalance = false;
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} />);
        const formik = wrapper.find(Formik).dive();

        const keyboardDatePicker = formik.find(KeyboardDatePicker);
        expect(keyboardDatePicker.props().disabled).toBe(true);
        const availableUnitsSelector = formik.find(AvailableUnitsSelector);
        expect(availableUnitsSelector.props().disabled).toBe(true);
        const availableLeaseTermsSelector = formik.find(AvailableLeaseTermsSelector);
        expect(availableLeaseTermsSelector.props().disabled).toBe(true);
    });

    it('does not disable form fields when has hasOutstandingBalance and primaryApplicant', () => {
        const wrapper = shallow(<LeaseTermsPage {...defaultProps} />);
        const formik = wrapper.find(Formik).dive();

        const keyboardDatePicker = formik.find(KeyboardDatePicker);
        expect(keyboardDatePicker.props().disabled).toBe(false);
        const availableUnitsSelector = formik.find(AvailableUnitsSelector);
        expect(availableUnitsSelector.props().disabled).toBe(false);
        const availableLeaseTermsSelector = formik.find(AvailableLeaseTermsSelector);
        expect(availableLeaseTermsSelector.props().disabled).toBe(false);
    });
});
