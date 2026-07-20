const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"
const signupForm = document.getElementById('signupForm');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const errorMessageElement = document.getElementById('confirmPasswordError');
const signupButton = document.getElementById('signupButton');

initValidation(signupForm);

signupForm.addEventListener("input", toggleSignupButton);
signupForm.addEventListener("change", toggleSignupButton);

toggleSignupButton();

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
    const contactData = setUpContactData();
    await postSignupDataToFireBase("contact", contactData);
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

const setBadgeColor = () => {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
}

const setUpContactData = () => {
    return {
        "forename": name.value.split(" ")[0],
        "surname": name.value.split(" ")[1] || "",
        "phone": "",
        "fornameFirstLetter": getInitials(name.value)[0],
        "surnameFirstLetter": getInitials(name.value)[1],
        "email": email.value,
        "badgeColor": setBadgeColor()
    }
}

function toggleSignupButton() {
    signupButton.disabled = !signupForm.checkValidity();
    if (signupButton.disabled) {
        signupButton.classList.add("opacity");
    } else {
        signupButton.classList.remove("opacity");
    }
}