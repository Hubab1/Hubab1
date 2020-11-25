import memoize from 'lodash/memoize';
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import addDays from 'date-fns/addDays';
import auth from 'utils/auth';
import {
    MILESTONE_APPLICANT_SUBMITTED,
    CO_APPLICANT_STATUS_NOT_STARTED,
    CO_APPLICANT_STATUS_COMPLETED,
    CO_APPLICANT_STATUS_IN_PROGRESS,
    PAYMENT_TIME_MONTHLY,
} from 'app/constants';

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
            initialValues[option.rental_option.id] = option.quantity;
        });
    }
    availableOptions.forEach((option) => {
        if (!initialValues.hasOwnProperty(option.id)) {
            initialValues[option.id] = 0;
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

export const getPaymentItemName = (name) => {
    return name.replace(/rentable item concession/i, 'Parking, Storage, Other Monthly Charge Concession');
};

/* eslint-disable */
export const getFinancialSourceRequestBody = (values, streamType, vgsEnabled) => {
    const formData = new FormData();
    formData.append('income_or_asset_type', values.income_or_asset_type);
    formData.append('estimated_amount', values.estimated_amount.replace(/,/g, ''));
    formData.append('stream_type', streamType);
    formData.append('other', values.other);

    if (values.uploadedDocuments) {
        if (vgsEnabled) {
            let cur = 1;
            const filesMapping = {};
            for (const key of Object.keys(values.uploadedDocuments)) {
                values.uploadedDocuments[key].files.forEach((v) => {
                    const variableName = `file${cur}`;
                    formData.append(variableName, v.file);
                    filesMapping[variableName] = key;
                    cur++;
                });
            }
            formData.append('files_mapping', JSON.stringify(filesMapping));
        } else {
            for (const key of Object.keys(values.uploadedDocuments)) {
                values.uploadedDocuments[key].files.forEach((v) => {
                    formData.append(`${key}[]`, v.file);
                });
            }
        }
    }
    return formData;
};

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
