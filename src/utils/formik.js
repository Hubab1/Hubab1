// Ensure all fields are initialized in initialValues
export function allValuesSet(values, options = {}) {
    let exclude = new Set();
    if (options.exclude) exclude = new Set(options.exclude);
    for (const key in values) {
        if (exclude.has(key)) continue;
        if (values[key] == null || values[key] === '') return false;
        if (key === 'phone_number' && values[key] === '(___) ___-____') return false;
    }
    return true;
}

export const nameValidationRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/;
export const phoneNumberValidationRegex = /^\(\d{3}\)\s\d{3}-\d{4}/;
