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
        error.textContent = "";
        field.classList.remove("input-error");
        if (field.type === "checkbox") {
            if (!field.checked) {
                error.textContent = field.dataset.error;
                field.classList.add("input-error");
                valid = false;
            } return;
        } valid = checkOtherInputs(field, error, valid)
    }); return valid;
};

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
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
        error.textContent = "Name may only contain letters, spaces and single hyphens";
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