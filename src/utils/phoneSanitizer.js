export const phoneSanitizer = (phoneNumber) => {
    const strippedPhoneNumber = phoneNumber.replace(/\D/g,'')
    return(`+1${strippedPhoneNumber}`)
}