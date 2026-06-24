const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"

const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorMessageElement = document.getElementById('loginError');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessageElement.textContent = '';
    const user = await checkUserExists();
    if (user) {
        await saveUserDataToLocalStorage();
        email.value = '';
        password.value = '';
        window.location.href = './HTML/summary.html';
    } else {
        errorMessageElement.textContent = 'Invalid email or password';
        password.value = '';
    }
});

async function checkUserExists() {
    const user = await getUserByEmail();
    if (user.password === password.value){return true;}
    return false;
}

async function getUserByEmail() {
    const users = await fetch(BASE_URL + "user.json");
    const userData = await users.json();
    return Object.values(userData).find(u => u.email === email.value);
}

async function saveUserDataToLocalStorage() {
    const currentUser = await getUserByEmail();
    localStorage.setItem("currentUserName", currentUser.name);
    localStorage.setItem("currentUserInitials", currentUser.initials);
}