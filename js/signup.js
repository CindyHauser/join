const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"
const signupForm = document.getElementById('signupForm');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const errorMessageElement = document.getElementById('confirmPasswordError');

initValidation(signupForm);

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateForm(signupForm)) return;
    if (checkPassword()) return;
    if (await checkUserExists()) return;
    try {
        await openPostSignup();
        goBack();
        await showSuccessDialog("successDialog");
        window.location.href = "../index.html";
    } catch (error) {
        console.error(error);
    }
});

async function openPostSignup() {
    const signupData = {
        name: name.value,
        email: email.value,
        password: password.value,
        initials: getInitials(name.value)
    };
    await postSignupDataToFireBase("user", signupData);
    signupForm.reset();
}

function checkPassword() {
    if (password.value !== confirmPassword.value) {
        errorMessageElement.textContent = 'Passwords do not match';
        password.value = '';
        confirmPassword.value = '';
        return true;
    }
    return false;
}

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

function goBack() {
    sessionStorage.setItem("skipAnimation", "true");
}

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
