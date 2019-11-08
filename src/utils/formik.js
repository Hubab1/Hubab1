// Ensure all fields are initialized in initialValues
export function allValuesSet (values) {
    for (let key in values) {
        if (!values[key]) return false;
        if ((key === 'phone_number') && (values[key] === '(___) ___-____')) return false;
    }
    return true;
}
