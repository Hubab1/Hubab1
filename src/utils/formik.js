// Ensure all fields are initialized in initialValues
export function allValuesSet (values, options={}) {
    let exclude = new Set();
    if (options.exclude) exclude = new Set(options.exclude);
    for (let key in values) {
        if (exclude.has(key)) continue;
        if (values[key] == null || values[key] === '') return false;
        if ((key === 'phone_number') && (values[key] === '(___) ___-____')) return false;
    }
    return true;
}
