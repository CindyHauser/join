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

const parseSubtasks = (value) => {
    const subtaskValue = value.trim();
    return subtaskValue === ''
        ? []
        : subtaskValue
            .split(/\n+/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
            .map((taskDescription) => ({ taskDescription, subtaskStateDone: false }));
};

const getSubtaskPreviewList = (input) => {
    let previewList = input.parentElement?.querySelector('.subtask-preview-list');
    if (!previewList) {
        previewList = document.createElement('ul');
        previewList.className = 'subtask-preview-list';
        input.insertAdjacentElement('afterend', previewList);
    }
    return previewList;
};

const renderSubtaskPreview = (input) => {
    const previewList = getSubtaskPreviewList(input);
    const subtasks = input.dataset.subtasks ? input.dataset.subtasks.split(/\r?\n/).filter(Boolean) : [];
    previewList.innerHTML = subtasks.map((subtask) => `<li class="subtask-preview-item">${subtask}</li>`).join('');
};

const clearSubtaskPreview = (input) => {
    input?.parentElement?.querySelector('.subtask-preview-list')?.remove();
};

async function addEditSubtask(event, taskId) {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    const input = event.target;
    const value = input.value.trim();
    if (!value) return;

    if (!taskId) {
        addSubtaskDraft(input, value);
        return;
    }
    await addSubtaskToFirebase(taskId, value);
    input.value = '';
}

const addSubtaskDraft = (input, value) => {
    const storedSubtasks = input.dataset.subtasks ? input.dataset.subtasks.split(/\r?\n/).filter(Boolean) : [];
    storedSubtasks.push(value);
    input.dataset.subtasks = storedSubtasks.join('\n');
    input.value = '';
    renderSubtaskPreview(input);
};

async function addSubtaskToFirebase(taskId, value) {
    const subtaskList = document.getElementById('editSubtaskDescription');
    if (!subtaskList) return;

    const nextIndex = getNextSubtaskIndex(subtaskList);
    const newSubtask = { taskDescription: value, subtaskStateDone: false };
    await fetch(`${BASE_URL}/task/${taskId}/subtasks/${nextIndex}.json`, putMethode(newSubtask));
    subtaskList.appendChild(buildSubtaskListItem(nextIndex, value));
}

const getNextSubtaskIndex = (subtaskList) => {
    const lastLi = subtaskList.querySelector('li:last-child');
    return lastLi ? Number(lastLi.dataset.value) + 1 : 0;
};

const buildSubtaskListItem = (index, value) => {
    const li = document.createElement('li');
    li.dataset.value = index;
    li.innerHTML = `<div class="subtask-item"><span class="editSubtaskText">${value}</span> ${getButtonSubtask()}</div>`;
    return li;
};

const getSelectedPriority = () => {
    const selectedPriorityButton = document.querySelector('.priority-btn.selected');
    return selectedPriorityButton
        ? selectedPriorityButton.textContent.trim().split(' ')[0].toLowerCase()
        : 'low';
};

function clearAllInput() {
    resetTaskForm();
    contactSelectedList = [];
    document.getElementById('selectedContactField').innerHTML = '';
    removePriority();
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
