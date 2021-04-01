import memoize from 'lodash/memoize';
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import addDays from 'date-fns/addDays';
import { sumBy } from 'lodash';

import auth from 'utils/auth';
import {
    MILESTONE_APPLICANT_SUBMITTED,
    CO_APPLICANT_STATUS_NOT_STARTED,
    CO_APPLICANT_STATUS_COMPLETED,
    CO_APPLICANT_STATUS_IN_PROGRESS,
    PAYMENT_TIME_MONTHLY,
} from 'constants/constants';
import { browserName, browserVersion, osName, osVersion, isPrivateBrowsing, isDesktop } from 'utils/mobileDetect';

export function sessionIsValidForCommunityId(communityId) {
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
export function formatCurrency(number, decimalPlaces = 2) {
    if (typeof number !== 'number') return '';
    return '$' + number.toFixed(decimalPlaces).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function prettyCurrency(number, decimalPlaces = 2) {
    return formatCurrency(number, decimalPlaces).replace('.00', '');
}

// takes a date object and outputs a date string formatted like "1981-12-27"
export function serializeDate(date) {
    if (date instanceof Date === false) return undefined;
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function parseDateISOString(s) {
    const ds = s.split(/\D/).map((str) => parseInt(str));
    ds[1] = ds[1] - 1; // adjust month
    return new Date(...ds);
}

export const offsetDate = memoize(
    (fromDate, offsetMonths, offsetDays) => {
        let newDate = addMonths(fromDate, offsetMonths);
        if (offsetDays) {
            newDate = addDays(newDate, offsetDays);
        }

        return format(newDate, 'MMMM do, yyyy');
    },
    (a, b) => `${a}-${b}`
);

export const rentalOptionsInitialValues = (rawSelectedRentalOptions, availableOptions) => {
    const initialValues = {};
    if (!!rawSelectedRentalOptions) {
        rawSelectedRentalOptions.forEach((option) => {
            initialValues[option.rental_option.id] = {
                quantity: option.quantity,
                exempted: option.exempted || 0,
            };
        });
    }
    availableOptions.forEach((option) => {
        if (!initialValues.hasOwnProperty(option.id)) {
            initialValues[option.id] = {
                quantity: 0,
                exempted: 0,
            };
        }
    });
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

export const rentalOptionCTALabel = (selectedOptions, addLabel) => {
    const quantity = sumBy(selectedOptions, (selectedOption) => selectedOption.quantity);
    if (quantity === 0) {
        return addLabel;
    }
    return 'Save Changes';
};

export const getPaymentItemName = (name) => {
    return name.replace(/rentable item concession/i, 'Parking, Storage, Other Monthly Charge Concession');
};

export const getUploadDocumentRequestBody = (document, stream_id, type, encrypted) => {
    const formData = new FormData();
    formData.append('stream_id', stream_id);
    formData.append('type_id', type);
    formData.append('file1', document.file);
    formData.append('encrypted', encrypted ? '1' : '0');
    formData.append(
        'context',
        JSON.stringify({
            browser_name: browserName,
            browser_version: browserVersion,
            os_name: osName,
            os_version: osVersion,
            is_private_browsing: isPrivateBrowsing,
            is_desktop: isDesktop,
        })
    );
    return formData;
};

/* eslint-disable */
export const getRentalOptionSubtitleItemAdder = (rentalOption, subtitleSuffix) => {
    const pricing_group_tiers = rentalOption?.rental_option_pricing_group?.tiers;
    if (!pricing_group_tiers) {
        return `$${rentalOption.monthly_amount || '0.00'}/mo per ${subtitleSuffix}${
            rentalOption.included ? ` (${rentalOption.included} incl.)` : ''
        }`;
    }

    const tiers_suffix = {};
    const tiers_titles = {};

    let subtitle = '';
    if (rentalOption.included) {
        subtitle += `${rentalOption.included} included`;
    }

    pricing_group_tiers.map(({ tiers, payment_time }) => {
        if (!(tiers && payment_time === PAYMENT_TIME_MONTHLY)) return;
        tiers.map(({ tier_num, min_value, max_value }) => {
            let suffix = `for paid ${subtitleSuffix}`;
            if (!max_value) {
                suffix += `s ${min_value}+`;
            } else if (max_value - 1 !== min_value) {
                suffix += `s ${min_value}-${max_value - 1}`;
            } else {
                suffix += ` ${min_value}`;
            }
            tiers_suffix[tier_num.toString()] = suffix;
        });
    });

    rentalOption.fees.map(({ pricing_tier, amount, payment_time }) => {
        if (!(pricing_tier && payment_time === PAYMENT_TIME_MONTHLY)) return;
        const suffix = tiers_suffix[pricing_tier.toString()];
        if (suffix) {
            tiers_titles[pricing_tier.toString()] = `$${amount || '0.00'}/mo ${suffix}`;
        }
    });

    // necessary to get the correct order
    Object.keys(tiers_titles).map((title) => (subtitle += `\n${tiers_titles[title]}`));

    return subtitle;
};
/* eslint-enable */
