const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"
const greetingUserName = document.getElementById('greetingUserName');
greetingUserName.textContent = localStorage.getItem("currentUserName");

const greetingUserElement = document.getElementById('greetingUser');
if (greetingUserName.textContent) {
    greetingUserElement.textContent = `,`;
}
