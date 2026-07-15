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
    });

}

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
            }

            return;
        }

        const isCustomDropdown = field.dataset.customDropdown === "true";
        const value = isCustomDropdown ? (field.dataset.value || "") : field.value;

        if (value.trim() === "") {

            error.textContent = field.dataset.error;
            field.classList.add("input-error");
            valid = false;

            return;
        }

        if (
            field.type === "email" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)
        ) {

            error.textContent = "Please enter a valid email address.";
            field.classList.add("input-error");
            valid = false;
        }

    });

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