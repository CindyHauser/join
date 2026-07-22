/**
 * Validates that a name contains at least two letters and only allowed characters.
 *
 * @param {string} name - The input value to validate.
 * @returns {boolean} True if the name matches the expected pattern.
 */
const isValidName = (name) => /^[a-zA-ZäöüÄÖÜß\s\-]{2,}$/.test(name);

/**
 * Validates that an email address follows a common email pattern.
 *
 * @param {string} email - The input value to validate.
 * @returns {boolean} True if the email matches the expected pattern.
 */
const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

/**
 * Validates that a phone number uses an allowed phone pattern.
 *
 * @param {string} phone - The input value to validate.
 * @returns {boolean} True if the phone number matches the expected pattern.
 */
const isValidPhone = (phone) => /^[\+]?[0-9\s\-()]{6,20}$/.test(phone);

/**
 * Creates a validation result object for a single input field.
 *
 * @param {HTMLInputElement} input - The input element being validated.
 * @param {Function} RegexFunction - The validation function to apply.
 * @returns {{id: string, checkvalue: boolean}} A validation result object.
 */
const setObjectValidation = (input, RegexFunction) => {
    let dataStrcture = {
        "id": input.id,
        "checkvalue": RegexFunction(input.value)
    }
    return dataStrcture
}

/**
 * Collects the current values of the validated form fields.
 *
 * @param {Array<{id: string}>} validationArray - The validation results containing field ids.
 * @returns {{name: string, email: string, phone: string}} An object with the current field values.
 */
const getAllValue = (validationArray) => {
    return {
        "name": document.getElementById(validationArray[0].id).value,
        "email": document.getElementById(validationArray[1].id).value,
        "phone": document.getElementById(validationArray[2].id).value
    }
}

/**
 * Builds an array of validation results for the contact inputs.
 *
 * @param {NodeListOf<HTMLInputElement>} allInputQuerry - The input elements to validate.
 * @param {Array<Object>} ObjectArray - The array that collects validation state objects.
 * @returns {Array<Object>} The populated validation array.
 */
const setContactInputsValidationArray = (allInputQuerry, ObjectArray) => {
    allInputQuerry.forEach(
        (input) => {
            if ((input.id).includes('Name')) {
                ObjectArray.push(setObjectValidation(input, isValidName))
            } else if ((input.id).includes('Email')) {
                ObjectArray.push(setObjectValidation(input, isValidEmail))
            } else if (input.id.includes('Phone')) {
                ObjectArray.push(setObjectValidation(input, isValidPhone))
            }
        }
    )
    return ObjectArray
}

/**
 * Determines which validation entries failed.
 *
 * @param {Array<{id: string, checkvalue: boolean}>} arrayObject - The validation results to inspect.
 * @returns {boolean|Array<string>} True when all validations passed, otherwise an array of failing field ids.
 */
const getValidationValue = (arrayObject) => {
    let falseObjects = []
    for (let index = 0; index < arrayObject.length; index++) {
        if (arrayObject[index].checkvalue === false) {
            falseObjects.push(arrayObject[index].id)
        }
    }
    if (falseObjects.length == 0) {
        return true
    } else {
        return falseObjects
    }
}

/**
 * Shows validation error states for the provided field ids.
 *
 * @param {Array<string>} validationCheckvalue - The ids of invalid fields.
 * @returns {void}
 */
const markFalsevalue = (validationCheckvalue) => {
    validationCheckvalue.forEach(
        (value) => {
            document.getElementById(`${value}ContainerError`).setAttribute('style', 'opacity:1');
            document.getElementById(`${value}`).closest('.contact-input-parent').classList.add('error-message-activated')
        }
    )
}

/**
 * Runs the complete validation flow for a set of inputs.
 *
 * @param {Function} setArrayCallback - Callback used to create the validation array.
 * @param {Function} getvalueCallback - Callback used to evaluate the validation array.
 * @param {Function} markingCallback - Callback used to display the validation errors.
 * @param {Array<HTMLInputElement>} inputs - The inputs to validate.
 * @returns {{value: boolean, array?: Array<Object>}} The validation result object.
 */
const initValidation = (setArrayCallback, getvalueCallback, markingCallback, inputs) => {
    let validationArray = []
    validationArray = setArrayCallback(inputs, validationArray)
    let validationCheckvalue = getvalueCallback(validationArray)
    if (validationCheckvalue != true) {
        markingCallback(validationCheckvalue)
        return {
            "value": false
        }
    } else {
        return {
            "value": true,
            "array": validationArray
        }
    }
}