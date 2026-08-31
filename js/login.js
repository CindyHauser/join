const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
let errorMessageElement;

/**
 * Initializes the login form by setting up form validation, password visibility toggle,
 * and animation state management.
 *
 * This function performs the following setup tasks:
 * - Checks and applies the 'no-animation' class if transitioning from the signup page
 * - Removes the skip animation flag from session storage
 * - Initializes form validation for all required fields
 * - Retrieves the password error message display element
 * - Sets up password visibility toggle for the password field
 *
 * @returns {void}
 */
function initLoginForm() {
    if (sessionStorage.getItem("skipAnimation") === "true") {
        document.documentElement.classList.add("no-animation");
        sessionStorage.removeItem("skipAnimation");
    }

    initValidation(loginForm);
    errorMessageElement = document.getElementById('passwordError');
    setupPasswordVisibilityToggle(password, document.getElementById('passwordIcon'));
}

/**
 * Handles the login form submission, validates the input and redirects on success.
 *
 * @param {Event} event - The submit event of the login form.
 * @returns {Promise<void>}
 */
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm(loginForm)) return;
    errorMessageElement.textContent = '';
    const user = await checkUserExists();
    if (user) {
        await saveUserDataToLocalStorage();
        await showSuccessDialog('successDialog');
        sessionStorage.setItem('cameFromIndex', 'true');
        window.location.href = './HTML/summary.html';
    } else {
        errorMessageElement.textContent = 'Invalid email or password';
    }
});

/**
 * Checks whether a user exists for the entered credentials.
 *
 * @returns {Promise<boolean>} True if the entered password matches a stored user.
 */
async function checkUserExists() {
    const user = await getUserByEmail();
    if (!user) return false;
    if (user.password === password.value){return true;}
    return false;
}

/**
 * Fetches the matching user from the backend by email address.
 *
 * @returns {Promise<Object|undefined>} The matching user object or undefined if none exists.
 */
async function getUserByEmail() {
    const users = await fetch(BASE_URL + "user.json");
    const userData = await users.json();
    return Object.values(userData).find(u => u.email === email.value);
}

/**
 * Stores the current user's name and initials in session storage.
 *
 * @returns {Promise<void>}
 */
async function saveUserDataToLocalStorage() {
    const currentUser = await getUserByEmail();
    sessionStorage.setItem("currentUserName", currentUser.name);
    sessionStorage.setItem("currentUserInitials", currentUser.initials);
}

/**
 * Initializes or resets the history counter in the session storage.
 * Sets the 'historyCounter' key to 0.
 * 
 * @returns {void}
 */
const startHistoryCounter = ()=>{
        sessionStorage.setItem('historyCounter',0)
}

/**
 * Initializes the login page by setting up the history counter and login form.
 *
 * This is the main entry point for login page initialization that orchestrates
 * the following initialization steps:
 * - Resets the history counter to 0 in session storage
 * - Initializes the login form with validation and event listeners
 *
 * @returns {void}
 */
function initLogin() {
    startHistoryCounter();
    initLoginForm();
}