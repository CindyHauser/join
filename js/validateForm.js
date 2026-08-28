/**
 * Initializes validation for all required fields in a form.
 * Attaches error elements and change/blur listeners to each field.
 * @param {HTMLFormElement} form - The form to initialize validation for.
 * @returns {void}
 */
function initValidation(form) {
    const fields = form.querySelectorAll("[required]");

    fields.forEach(field => {
        field.errorElement = getOrCreateErrorElement(field);
        attachClearErrorListener(field);
        if (field.type !== "checkbox") {
            attachBlurValidation(field);
        }
    });

     attachCheckboxBlurOnConfirmPassword(form);
}

/**
 * Triggers checkbox validation when the confirm password field loses focus.
 * Ensures that the required checkbox is validated after all other required fields are filled.
 * @param {HTMLFormElement} form - The form containing the checkbox and confirm password field.
 * @returns {void}
 */
function attachCheckboxBlurOnConfirmPassword(form) {
    const confirmPassword = form.querySelector("#confirmPassword");
    const checkbox = form.querySelector('input[type="checkbox"][required]');
    if (!confirmPassword || !checkbox) return;
    confirmPassword.addEventListener("blur", () => {
        if (event.relatedTarget === checkbox) return;
        if (!allOtherFieldsFilled(form, checkbox)) return;
        checkCheckbox(checkbox, checkbox.errorElement);
    });
    checkbox.addEventListener("change", () => {
        if (!checkbox.checked) {
            checkCheckbox(checkbox, checkbox.errorElement);
        }
    });
}

/**
 * Checks whether all required fields except the checkbox have values.
 * @param {HTMLFormElement} form - The form containing the required fields.
 * @param {HTMLInputElement} checkbox - The checkbox field to ignore during the check.
 * @returns {boolean} True if all other required fields are filled, otherwise false.
 */
function allOtherFieldsFilled(form, checkbox) {
    const fields = form.querySelectorAll("[required]");
    return Array.from(fields).every(field => {
        if (field === checkbox) return true;
        return getFieldValue(field).trim() !== "";
    });
}

/**
 * Returns the existing error element for a field, or creates it if missing.
 * @param {HTMLElement} field - The form field to get/create an error element for.
 * @returns {HTMLElement} The error message element belonging to the field.
 */
function getOrCreateErrorElement(field) {
    const errorId = `${field.id}Error`;
    let error = document.getElementById(errorId);

    if (!error) {
        error = createErrorElement(field, errorId);
    }

    return error;
}

/**
 * Creates a new error message element and inserts it into the DOM
 * at the correct position relative to the given field.
 * @param {HTMLElement} field - The form field the error element belongs to.
 * @param {string} errorId - The id to assign to the new error element.
 * @returns {HTMLElement} The newly created error element.
 */
function createErrorElement(field, errorId) {
    const error = document.createElement("p");
    error.id = errorId;
    error.classList.add("error-message");

    const insertTarget = field.type === "checkbox"
        ? (field.closest(".terms-container") || field)
        : field;

    insertTarget.insertAdjacentElement("afterend", error);
    return error;
}

/**
 * Determines which event should trigger clearing of a field's error state.
 * @param {HTMLElement} field - The form field to determine the event for.
 * @returns {string} The event name ("change", "customchange", or "input").
 */
function getChangeEventName(field) {
    const isCustomDropdown = field.dataset.customDropdown === "true";

    if (field.type === "checkbox") {
        return "change";
    }
    return isCustomDropdown ? "customchange" : "input";
}

/**
 * Attaches a listener to a field that clears its error message and
 * error styling whenever the field's relevant change event fires.
 * @param {HTMLElement} field - The form field to attach the listener to.
 * @returns {void}
 */
function attachClearErrorListener(field) {
    const event = getChangeEventName(field);

    field.addEventListener(event, () => {
        field.errorElement.textContent = "";
        field.classList.remove("input-error");
    });
}

/**
 * Attaches a blur listener to a field that triggers validation
 * against other inputs once the field loses focus.
 * @param {HTMLElement} field - The form field to attach blur validation to.
 * @returns {void}
 */
function attachBlurValidation(field) {
    field.addEventListener("blur", () => {
        checkOtherInputs(field, field.errorElement, true);
    });
}

/**
 * Validates all required fields in a form and marks invalid ones.
 *
 * @param {HTMLFormElement} form - The form element to validate.
 * @returns {boolean} True if all required fields are valid; otherwise false.
 */
function validateForm(form) {
    let valid = true;
    const fields = form.querySelectorAll("[required]");
    fields.forEach(field => {
        const error = field.errorElement;
        if (field.type === "checkbox") {
            if (!checkCheckbox(field, error)) valid = false;
            return;
        }
        error.textContent = "";
        field.classList.remove("input-error");
        valid = checkOtherInputs(field, error, valid)
    }); return valid;
};

/**
 * Validates a required checkbox field and updates its error state.
 * @param {HTMLInputElement} field - The checkbox input to validate.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @returns {boolean} True if the checkbox is checked; otherwise false.
 */
function checkCheckbox(field, error) {
    if (!field.checked) {
        error.textContent = field.dataset.error;
        field.classList.add("input-error");
        return false;
    }
    error.textContent = "";
    field.classList.remove("input-error");
    return true;
}

/**
 * Retrieves the comparable value of a field, accounting for custom dropdowns.
 *
 * @param {HTMLInputElement|HTMLElement} field - The field to read the value from.
 * @returns {string} The trimmed-comparable value of the field.
 */
function getFieldValue(field) {
    const isCustomDropdown = field.dataset.customDropdown === "true";
    return isCustomDropdown ? (field.dataset.value || "") : field.value;
}

/**
 * Checks whether a field's value is empty and sets an error if so.
 *
 * @param {HTMLElement} field - The field to check.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @param {string} value - The value to check for emptiness.
 * @returns {boolean} True if the field is valid (not empty).
 */
function checkEmpty(field, error, value) {
    if (value.trim() === "") {
        error.textContent = field.dataset.error;
        field.classList.add("input-error");
        return false;
    }
    return true;
}

/**
 * Checks whether an email field contains a valid email address.
 *
 * @param {HTMLInputElement} field - The email field to check.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @returns {boolean} True if the field is valid or not an email field.
 */
function checkEmail(field, error) {
    if (field.type !== "email") return true;
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(field.value)) {
        error.textContent = "Please enter a valid email address.";
        field.classList.add("input-error");
        return false;
    }
    return true;
}

/**
 * Checks whether a name field only contains letters, spaces and single hyphens.
 *
 * @param {HTMLInputElement} field - The name field to check.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @returns {boolean} True if the field is valid or not the name field.
 */
function checkNameFormat(field, error) {
    if (field.id !== "name") return true;
    if (!/^[A-Za-zÄÖÜäöüß]+(?:[- ][A-Za-zÄÖÜäöüß]+)*$/.test(field.value)) {
        error.textContent = "Letters, spaces & single hyphens only";
        field.classList.add("input-error");
        return false;
    }
    return true;
}

/**
 * Checks whether a name field contains at least 2 letters.
 *
 * @param {HTMLInputElement} field - The name field to check.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @returns {boolean} True if the field is valid or not the name field.
 */
function checkNameLength(field, error) {
    if (field.id !== "name") return true;
    if (field.value.replace(/[^A-Za-zÄÖÜäöüß]/g, "").length < 2) {
        error.textContent = "Name must contain at least 2 letters.";
        field.classList.add("input-error");
        return false;
    }
    return true;
}

/**
 * Checks whether a date field's value is not before the field's minimum date.
 *
 * @param {HTMLInputElement} field - The date field to check.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @returns {boolean} True if the field is valid or has no minimum set.
 */
function checkDateNotPast(field, error) {
    const min = field.getAttribute("min");
    if (min && field.value < min) {
        error.textContent = "Date cannot be in the past";
        field.classList.add("input-error");
        return false;
    }
    return true;
}

/**
 * Returns the latest allowed date, a fixed number of years from today.
 *
 * @param {number} yearsAhead - How many years from today are allowed.
 * @returns {Date} The maximum allowed date.
 */
function getMaxDate(yearsAhead) {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + yearsAhead);
    return maxDate;
}

/**
 * Checks whether a date field's value is not too far in the future.
 *
 * @param {HTMLInputElement} field - The date field to check.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @returns {boolean} True if the field is valid.
 */
function checkDateNotTooFarAhead(field, error) {
    const maxYearsAhead = 1;
    if (new Date(field.value) > getMaxDate(maxYearsAhead)) {
        error.textContent = `Maximum ${maxYearsAhead} year ahead`;
        field.classList.add("input-error");
        return false;
    }
    return true;
}

/**
 * Checks whether a date field's value is within the allowed date range.
 *
 * @param {HTMLInputElement} field - The date field to check.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @returns {boolean} True if the field is valid or not a date field.
 */
function checkDate(field, error) {
    if (field.type !== "date") return true;
    if (!checkDateNotPast(field, error)) return false;
    if (!checkDateNotTooFarAhead(field, error)) return false;
    return true;
}

/**
 * Validates a single non-checkbox field and applies the corresponding error state.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field - The field to check.
 * @param {HTMLElement} error - The element that displays validation errors.
 * @param {boolean} valid - The current overall validation state.
 * @returns {boolean} The updated validation state after checking the field.
 */
function checkOtherInputs(field, error, valid) {
    const value = getFieldValue(field);
    if (!checkEmpty(field, error, value)) return false;
    if (!checkEmail(field, error)) return false;
    if (!checkNameFormat(field, error)) return false;
    if (!checkNameLength(field, error)) return false;
    if (!checkDate(field, error)) return false;
    return valid;
}

/**
 * Shows a success dialog as a modal for a fixed duration, then closes it automatically.
 * Prevents the dialog from being dismissed via the native "cancel" event (e.g. Escape key).
 * @param {string} [id="successDialog"] - The id of the dialog element to show.
 * @returns {Promise<void>} Resolves once the dialog has been automatically closed.
 */
async function showSuccessDialog(id) {
    if (!id) {
        id = "successDialog";
    }
    const dialog = document.getElementById(id);
    dialog.addEventListener("cancel", e => e.preventDefault(), { once: true });
    dialog.showModal();

    return new Promise(resolve => {
        setTimeout(() => {
            dialog.close();
            resolve();
        }, 2000);
    });
}