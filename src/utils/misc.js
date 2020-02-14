import memoize from 'lodash/memoize';
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';

import { ROLE_GUARANTOR } from 'app/constants';

export function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

export function formatCurrency(number, decimalPlaces=2) {
    if (typeof number !== 'number') return '';
    return '$' + number.toFixed(decimalPlaces).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export const getIncomeRequirementText = props => {
    const {config, profile, applicant} = props;
    const { guarantor_income_requirement_multiplier, applicant_income_requirements } = config;

    if (profile.unit) {
        const guarantor_income_amount = guarantor_income_requirement_multiplier * profile.unit.price;
        const applicant_income_amount = applicant_income_requirements * profile.unit.price;
        if (applicant.role === ROLE_GUARANTOR) {
            return `The total income required for a guarantor on the application is ${guarantor_income_requirement_multiplier}x the rent: ${formatCurrency(guarantor_income_amount, 0)}`;
        } else {
            return `The total income required for all members of the application is ${applicant_income_requirements}x the rent: ${formatCurrency(applicant_income_amount, 0)}`;
        }
    } else {
        if (applicant.role === ROLE_GUARANTOR) {
            return `The total income required for a guarantor on the application is ${guarantor_income_requirement_multiplier}x the rent`;
        } else {
            return `The total income required for all members of the application is ${applicant_income_requirements}x the rent`;
        }
    }
};

// takes a date object and outputs a date string formatted like "1981-12-27"
export function serializeDate (date) {
    if ((date instanceof Date) === false) return undefined;
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

export function parseDateISOString(s) {
    let ds = s.split(/\D/).map(s => parseInt(s));
    ds[1] = ds[1] - 1; // adjust month
    return new Date(...ds);
}

export const offsetDate = memoize((fromDate, offsetMonths) => {
    const newDate = addMonths(fromDate, offsetMonths);
    return format(newDate, 'MMMM do, yyyy');
}, (a, b) => `${a}-${b}`);

export const rentalOptionsInitialValues = (rawSelectedRentalOptions) => {
    const initialValues = {};
    if (!!rawSelectedRentalOptions) {
        rawSelectedRentalOptions.forEach(option => {
            initialValues[option.rental_option.id] = option.quantity;
        });
    }
    return initialValues;
}



