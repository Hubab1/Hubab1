import memoize from 'lodash/memoize';
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import auth from 'utils/auth';
import { MILESTONE_APPLICANT_SUBMITTED, CO_APPLICANT_STATUS_NOT_STARTED,
    CO_APPLICANT_STATUS_COMPLETED, CO_APPLICANT_STATUS_IN_PROGRESS } from 'app/constants';

export function sessionIsValidForCommunityId (communityId) {
    return auth.accessScope() === communityId;
}

export function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        return `rgb(${r}, ${g}, ${b})`;
    }
}

// taken from archer
export function prettyFormatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    let stripped = phoneNumber.replace(/[+\D]+/g, '');

    if (stripped.charAt(0) === '+') {
        if (stripped.charAt(1) !== '1') {
            // return international phone numbers as is
            return phoneNumber;
        } else {
            //remove the + from US phone numbers
            stripped = stripped.slice(1);
        }
    }

    if (stripped.charAt(0) === 1 && stripped.length === 11) {
        // remove the US country code
        stripped = stripped.slice(1);
    }

    if (stripped.length !== 10) {
        return phoneNumber;
    }

    return `${stripped.slice(0, 3)}‑${stripped.slice(3, 6)}‑${stripped.slice(6)}`;
}

// You probably wanna use pretty currency instead
export function formatCurrency(number, decimalPlaces=2) {
    if (typeof number !== 'number') return '';
    return '$' + number.toFixed(decimalPlaces).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function prettyCurrency(number, decimalPlaces = 2) {
    return formatCurrency(number, decimalPlaces).replace('.00', '');
}

// takes a date object and outputs a date string formatted like "1981-12-27"
export function serializeDate (date) {
    if ((date instanceof Date) === false) return undefined;
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

export function parseDateISOString(s) {
    const ds = s.split(/\D/).map(str => parseInt(str));
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
};

export const getRoommateStatus = (item) => {
    if (!item.last_milestone) return CO_APPLICANT_STATUS_NOT_STARTED;
    switch (item.last_milestone.event) {
        case MILESTONE_APPLICANT_SUBMITTED:
            return CO_APPLICANT_STATUS_COMPLETED;
        case null:
        case undefined:
            return CO_APPLICANT_STATUS_NOT_STARTED;
        default:
            return CO_APPLICANT_STATUS_IN_PROGRESS;
    }
};
