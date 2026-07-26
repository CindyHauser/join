function initValidation(form) {

    const fields = form.querySelectorAll("[required]");

    fields.forEach(field => {
        const errorId = `${field.id}Error`;
        let error = document.getElementById(errorId);
        if (!error) {
            error = document.createElement("p");
            error.id = errorId;
            error.classList.add("error-message");
            if (field.type === "checkbox") {
                const container = field.closest(".terms-container");
                if (container) {
                    container.insertAdjacentElement("afterend", error);
                } else {
                    field.insertAdjacentElement("afterend", error);
                }
            } else {
                field.insertAdjacentElement("afterend", error);
            }
        }
        field.errorElement = error;
        const isCustomDropdown = field.dataset.customDropdown === "true";
        const event = field.type === "checkbox"
            ? "change"
            : isCustomDropdown
                ? "customchange"
                : "input";
        field.addEventListener(event, () => {
            field.errorElement.textContent = "";
            field.classList.remove("input-error");
        });
        if (field.type !== "checkbox") {
            field.addEventListener("blur", () => {
                checkOtherInputs(field, field.errorElement, true);
            });
        }
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