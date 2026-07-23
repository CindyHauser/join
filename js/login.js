const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"

const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');

/**
 * Disables page animations when the session flag requests a skip.
 *
 * @returns {void}
 */
if (sessionStorage.getItem("skipAnimation") === "true") {
        document.documentElement.classList.add("no-animation");
        sessionStorage.removeItem("skipAnimation");
    }

/**
 * Initializes the login form validation on page load.
 *
 * @returns {void}
 */
initValidation(loginForm);
const errorMessageElement = document.getElementById('passwordError');

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
        email.value = '';
        password.value = '';
        await showSuccessDialog('successDialog');
        window.location.href = './HTML/summary.html';
    } else {
        errorMessageElement.textContent = 'Invalid email or password';
        password.value = '';
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