if (typeof BASE_URL === "undefined") {
    globalThis.BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/";
}

const ARROW_UP_ICON = '../assets/ui-icons/arrow-up.svg';
const ARROW_DOWN_ICON = '../assets/ui-icons/arrow-down.svg';
const TRIGGER_SELECTOR = '#category, #categoryEdit';
const LIST_SELECTOR = '#dropdownList, #dropdownListEdit';
const LABEL_SELECTOR = '#dropdownLabel, #dropdownLabelEdit';
const ARROW_SELECTOR = '#dropdownArrow, #dropdownArrowEdit';
const addTaskForm = document.querySelector('.add-task-form');
const root = document.getElementById('dialogAddTask') || document;
contactListJsonLibrary = '';
let contactInputListArray = [];
let contactSelectedList = [];

/**
 * Selects the given priority button and clears any previously selected priority.
 *
 * @param {HTMLElement} button - The priority button to select.
 * @returns {void}
 */
function selectPriority(button) {
    removePriority();
    button.classList.add('selected');
}

/**
 * Removes the selected state from all priority buttons.
 *
 * @returns {void}
 */
function removePriority() {
    document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('selected'));
}

/**
 * Resets the selected task priority to the default medium value.
 *
 * @returns {void}
 */
function resetPriority() {
    removePriority();
    const mediumButton = document.querySelector('.priority-btn.medium');
    if (mediumButton) mediumButton.classList.add('selected');
}

/**
 * Sets the priority button based on the provided priority value.
 *
 * @param {HTMLElement} dialog - The dialog element containing priority buttons.
 * @param {string} priority - The priority value to select.
 * @returns {void}
 */
function setPriority(dialog, priority) {
    const button = dialog.querySelector(`.priority-btn.${priority}`);
    if (button) selectPriority(button);
}
addTaskForm.addEventListener('submit', handleAddTaskSubmit);

/**
 * Handles the add-task form submission and either delegates to a dialog submission or creates a new task.
 *
 * @param {Event} event - The form submit event.
 * @returns {Promise<void>}
 */
async function handleAddTaskSubmit(event) {
    event.preventDefault();
    if (!validateForm(addTaskForm)) return;

    if (typeof submitFormDialog === 'function') {
        await submitFormDialog(event, typeof taskState !== 'undefined' ? taskState : 'toDo');
        await showSuccessDialog();
    } else {
        await createTask(event, 'toDo');
        await showSuccessDialog();
        window.location.href = "../HTML/board.html";
    }
}

/**
 * Creates a new task object from the form data and persists it to Firebase.
 *
 * @param {Event} event - The form submit event.
 * @param {string} state - The board state for the new task.
 * @returns {Promise<void>}
 */
async function createTask(event, state) {
    if (event) event.preventDefault();
    const form = document.querySelector('.add-task-form');
    if (!form) return;
    const newTask = buildTaskFromForm(form);
    newTask.priority = getSelectedPriority();
    newTask.state = state;
    await postNewTaskToFireBase("task", newTask);
    clearAllInput();
}

/**
 * Builds a task object from the add-task form values.
 *
 * @param {HTMLFormElement} form - The add-task form element.
 * @returns {Object} The constructed task object.
 */
const buildTaskFromForm = (form) => {
    const task = { contactSelect: contactSelectedList, subtasks: [] };
    Array.from(form.elements).forEach((element) => collectTaskField(element, task));
    return task;
};

/**
 * Collects a single form field value into the task object.
 *
 * @param {HTMLElement} element - The form field element.
 * @param {Object} task - The task object to populate.
 * @returns {void}
 */
const collectTaskField = (element, task) => {
    if (element.id === 'subtask') {
        task.subtasks = parseSubtasks(element.dataset.subtasks?.trim() || element.value.trim());
        return;
    }
    if (!isRelevantFormField(element)) return;
    const key = element.id || element.name || 'field';
    if (key === 'subtask' || key === 'contactInput' || key.length >= 20) return;
    task[key] = getFieldValue(element);
};

/**
 * Determines whether an HTML element should be treated as a task form field.
 *
 * @param {HTMLElement} element - The element to evaluate.
 * @returns {boolean} True if the element contains relevant task data.
 */
const isRelevantFormField = (element) => {
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) ||
        (element.tagName === 'BUTTON' && element.dataset.customDropdown === 'true');
};

/**
 * Reads the value from a form field or custom dropdown button.
 *
 * @param {HTMLElement} element - The form field element.
 * @returns {string} The field value.
 */
const getFieldValue = (element) => {
    return element.tagName === 'BUTTON' && element.dataset.customDropdown === 'true'
        ? element.dataset.value || ''
        : element.value;
};

/**
 * Returns the currently selected priority label.
 *
 * @returns {string} The selected priority value.
 */
const getSelectedPriority = () => {
    const selectedPriorityButton = document.querySelector('.priority-btn.selected');
    return selectedPriorityButton
        ? selectedPriorityButton.textContent.trim().split(' ')[0].toLowerCase()
        : 'medium';
};

/**
 * Clears all input values and resets the add-task form state.
 *
 * @returns {void}
 */
function clearAllInput() {
    resetTaskForm();
    contactSelectedList = [];
    document.getElementById('selectedContactField').innerHTML = '';
    resetPriority();
    resetDropdown(root);
}

/**
 * Resets the form fields and subtask preview in the add-task dialog.
 *
 * @returns {void}
 */
function resetTaskForm() {
    const form = document.querySelector('.add-task-form');
    if (!form) return;
    form.reset();
    const subtaskInput = form.querySelector('#subtask');
    if (!subtaskInput) return;
    subtaskInput.value = '';
    subtaskInput.dataset.subtasks = '';
    clearSubtaskPreview(subtaskInput);
}

/**
 * Resets the custom category dropdown display to the default state.
 *
 * @param {HTMLElement} root - The root element containing the dropdown.
 * @returns {void}
 */
function resetDropdown(root) {
    const label = root.querySelector(LABEL_SELECTOR);
    const list = root.querySelector(LIST_SELECTOR);
    const categoryButton = root.querySelector('#category');
    if (!label || !list) return;

    list.querySelectorAll('.dropdown-option').forEach(o => o.setAttribute('aria-selected', 'false'));
    label.textContent = 'Select Task Category';
    if (categoryButton) categoryButton.dataset.value = '';
}

/**
 * Posts new task data to Firebase at the given path.
 *
 * @param {string} path - The Firebase path to post to.
 * @param {Object} [data={}] - The data payload to send.
 * @returns {Promise<Object>} The parsed JSON response.
 */
const postNewTaskToFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await response.json();
};