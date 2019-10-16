// Ensure all fields are initialized in initialValues
export function allValuesSet (values) {
    for (let key in values) {
        if (!values[key]) return false;
    }
    return true;
}
