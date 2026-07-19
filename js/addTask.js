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

function selectPriority(button) {
    removePriority();
    button.classList.add('selected');
}

function removePriority() {
    document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('selected'));
}

function resetPriority() {
    removePriority();
    const mediumButton = document.querySelector('.priority-btn.medium');
    if (mediumButton) mediumButton.classList.add('selected');
}

function setPriority(dialog, priority) {
    const button = dialog.querySelector(`.priority-btn.${priority}`);
    if (button) selectPriority(button);
}
addTaskForm.addEventListener('submit', handleAddTaskSubmit);

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

const buildTaskFromForm = (form) => {
    const task = { contactSelect: contactSelectedList, subtasks: [] };
    Array.from(form.elements).forEach((element) => collectTaskField(element, task));
    return task;
};

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

const isRelevantFormField = (element) => {
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) ||
        (element.tagName === 'BUTTON' && element.dataset.customDropdown === 'true');
};

const getFieldValue = (element) => {
    return element.tagName === 'BUTTON' && element.dataset.customDropdown === 'true'
        ? element.dataset.value || ''
        : element.value;
};

const getSelectedPriority = () => {
    const selectedPriorityButton = document.querySelector('.priority-btn.selected');
    return selectedPriorityButton
        ? selectedPriorityButton.textContent.trim().split(' ')[0].toLowerCase()
        : 'medium';
};

function clearAllInput() {
    resetTaskForm();
    contactSelectedList = [];
    document.getElementById('selectedContactField').innerHTML = '';
    resetPriority();
    resetDropdown(root);
}

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

function resetDropdown(root) {
    const label = root.querySelector(LABEL_SELECTOR);
    const list = root.querySelector(LIST_SELECTOR);
    const categoryButton = root.querySelector('#category');
    if (!label || !list) return;

    list.querySelectorAll('.dropdown-option').forEach(o => o.setAttribute('aria-selected', 'false'));
    label.textContent = 'Select Task Category';
    if (categoryButton) categoryButton.dataset.value = '';
}

const postNewTaskToFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await response.json();
};