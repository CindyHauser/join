const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const errorMessageElement = document.getElementById('loginError');
    errorMessageElement.textContent = '';
    
    const users = await fetch(BASE_URL + "user.json");
    const userData = await users.json();
    const user = Object.values(userData).find(u => u.email === email.value && u.password === password.value);

    if (user) {
        email.value = '';
        password.value = '';
        window.location.href = './HTML/summary.html';
    } else {
        errorMessageElement.textContent = 'Invalid email or password';
        password.value = '';
    }
});