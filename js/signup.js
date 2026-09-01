const signupForm = document.getElementById('signupForm');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const errorMessageElement = document.getElementById('confirmPasswordError');
const signupButton = document.getElementById('signupButton');

/**
 * Initializes the signup form by setting up form validation, password visibility toggles,
 * event listeners, and button state management.
 *
 * This function performs the following setup tasks:
 * - Initializes form validation for all required fields
 * - Sets up password visibility toggle for the password field
 * - Sets up password visibility toggle for the confirm password field
 * - Attaches input and change event listeners to manage signup button state
 * - Attaches event listeners to password fields to validate password matching
 * - Toggles the signup button enabled/disabled state based on form validity
 *
 * @returns {void}
 */
function initSignupForm() {
    initValidation(signupForm);
    setupPasswordVisibilityToggle(password, document.getElementById('passwordIcon'));
    setupPasswordVisibilityToggle(confirmPassword, document.getElementById('confirmPasswordIcon'));

    signupForm.addEventListener("input", toggleSignupButton);
    signupForm.addEventListener("change", toggleSignupButton);

    password.addEventListener('input', checkPasswordsMatch);
    confirmPassword.addEventListener('input', checkPasswordsMatch);

    toggleSignupButton();
}

/**
 * Handles signup form submission, validates the user input, and stores the new user.
 *
 * @param {Event} event - The submit event of the signup form.
 * @returns {Promise<void>}
 */
signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateForm(signupForm)) return;
    if (!checkPasswordsMatch()) return;
    if (await checkUserExists()) return;
    try {
        await openPostSignup();
        await showSuccessDialog("successDialog");
        goBack();
    } catch (error) {
        return;
    }
});

/**
 * Creates and submits the signup and contact data to the backend.
 *
 * @returns {Promise<void>}
 */
async function openPostSignup() {
    const signupData = {
        name: name.value,
        email: email.value,
        password: password.value,
        initials: getInitials(name.value)
    };
    const contactData = setUpContactData();
    await postSignupDataToFireBase("contact", contactData);
    await postSignupDataToFireBase("user", signupData);
    signupForm.reset();
}

/**
 * Checks whether the entered password and confirmation password match.
 *
 * @returns {boolean} True if the passwords differ.
 */
function checkPasswordsMatch() {
    if (confirmPassword.value && password.value !== confirmPassword.value) {
        errorMessageElement.textContent = 'Passwords do not match';
        confirmPassword.classList.add('input-error');
        return false;
    }
    errorMessageElement.textContent = '';
    confirmPassword.classList.remove('input-error');
    return true;
}

/**
 * Checks whether a user with the entered email already exists.
 *
 * @returns {Promise<boolean>} True if the user already exists.
 */
async function checkUserExists() {
    const users = await fetch(BASE_URL + "user.json");
    const userData = await users.json();
    const user = Object.values(userData).find(u => u.email === email.value);

    if (user) {
        errorMessageElement.textContent = 'User already exists';
        email.value = '';
        password.value = '';
        confirmPassword.value = '';
        return true;
    }
    return false;
}

/**
 * Sends data to the specified Firebase endpoint.
 *
 * @param {string} path - The Firebase path to write to.
 * @param {Object} [data={}] - The payload to send.
 * @returns {Promise<Object>} The server response as JSON.
 */
const postSignupDataToFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json",
        {
            method: "POST",
            header: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    )
    return await response.json()
}

/**
 * Stores a flag to skip any animation on the next page and go to the index page.
 *
 * @returns {void}
 */
function goBack() {
    sessionStorage.setItem("skipAnimation", "true");
    window.location.href='../index.html';
}

/**
 * Extracts initials from a full name.
 *
 * @param {string} name - The full name to transform.
 * @returns {string} The initials derived from the name.
 */
function getInitials(name) {
    if (!name || !name.trim()) {
        return "";
    }
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length === 1) {
        return (nameParts[0][0]).toUpperCase();
    }

    return (nameParts[0][0] + nameParts[nameParts.length - 1][0])
        .toUpperCase();
}

/**
 * Generates a random RGB color tuple for contact badges.
 *
 * @returns {Array<number>} An RGB color array.
 */
const setBadgeColor = () => {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
}

/**
 * Builds the contact data object for the newly created user.
 *
 * @returns {Object} The contact payload for Firebase.
 */
const setUpContactData = () => {
    const nameParts = name.value.trim().split(/\s+/);
    return {
        "forename": nameParts[0],
        "surname": nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
        "phone": "",
        "fornameFirstLetter": getInitials(name.value)[0] || "",
        "surnameFirstLetter": getInitials(name.value)[1] || "",
        "email": email.value,
        "badgeColor": setBadgeColor()
    }
}

/**
 * Enables or disables the signup button based on form validity.
 *
 * @returns {void}
 */
function toggleSignupButton() {
    const inputs = signupForm.querySelectorAll('input[required]');
    const allFilled = Array.from(inputs).every(input => {
        if (input.type === 'checkbox') {
            return input.checked;
        }
        return input.value.trim() !== '';
    });
    signupButton.disabled = !allFilled;
    if (signupButton.disabled) {
        signupButton.classList.add("opacity");
    } else {
        signupButton.classList.remove("opacity");
    }
}