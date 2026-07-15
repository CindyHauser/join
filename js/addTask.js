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

initDropdown(root);
initValidation(addTaskForm);
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


// contact input template by Arnesto

const setContactListCard = (array, index, comparedArray) => {
    const isSelected = comparedArray !== undefined && comparedArray.includes(array[index].id);
    return buildContactListCard(array[index], isSelected);
};

const buildContactListCard = (contact, isSelected) => {
    const checkedAttr = isSelected ? 'checked' : '';
    return `<div class="contact-input-class-card" onclick="contactSelected(this)">
                <div class="input-name-and-badge">
                <div class="contact-input-badge" style="background-color: rgb(${contact.badgeColor[0]},${contact.badgeColor[1]},${contact.badgeColor[2]});">${contact.fornameFirstLetter}${contact.surnameFirstLetter}</div>
                <div class="contact-input-name"> ${contact.forename} ${contact.surname}</div>
                </div>
                <input ${checkedAttr} onclick="contactSelectedCheckbox(this)" type="checkbox" name="${contact.forename} ${contact.surname}" id=${contact.id} class="checkbox">
                </div>`;
};

const setSelectedContactBadge = (array, index, library) => {
    const contact = library[array[index]];
    return `<div class="contact-input-badge" style="background-color: rgb(${contact.badgeColor[0]},${contact.badgeColor[1]},${contact.badgeColor[2]});">${contact.fornameFirstLetter}${contact.surnameFirstLetter}</div>`;
};

// contact input Render by Arnesto

const renderContactCards = (array, comparedArray, targetId, targetEditId) => {
    let html = '';
    for (let index = 0; index < array.length; index++) {
        html += setContactListCard(array, index, comparedArray);
    }
    document.getElementById(targetId).innerHTML = html;
    const editTarget = document.getElementById(targetEditId);
    if (editTarget) editTarget.innerHTML = html;
};

const renderContactInputList = () => {
    renderContactCards(contactInputListArray, contactSelectedList, 'contactInputList', 'contactInputListEdit');
};

const renderfilteredArrayList = (filteredArray, comparedArray) => {
    renderContactCards(filteredArray, comparedArray, 'contactInputList', 'contactInputListEdit');
};

const renderContactSelectedList = () => {
    let html = '';
    for (let index = 0; index < contactSelectedList.length; index++) {
        html += setSelectedContactBadge(contactSelectedList, index, contactListJsonLibrary);
    }
    document.getElementById('selectedContactField').innerHTML = html;
    const editTarget = document.getElementById('selectedContactFieldEdit');
    if (editTarget) editTarget.innerHTML = html;
};

// contact input data function by Arnesto

const getLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/contact" + ".json");
    return response.json();
};

const setLibraryForFirebaseInit = async () => {
    contactListJsonLibrary = await getLibraryForFirebaseInit();
};

const setPreludeContactArrayStructure = (key, object) => {
    return {
        id: key,
        forename: object[key].forename,
        surname: object[key].surname,
        phone: object[key].phone,
        fornameFirstLetter: object[key].fornameFirstLetter,
        surnameFirstLetter: object[key].surnameFirstLetter,
        email: object[key].email,
        badgeColor: object[key].badgeColor
    };
};

const getPreldudeContactArray = (object) => {
    let preludeContactArray = [];
    for (const key in object) {
        if (key != "position") {
            preludeContactArray.push(setPreludeContactArrayStructure(key, object));
        }
    }
    return preludeContactArray.sort((a, b) => a.forename.localeCompare(b.forename));
};

const setContactInputList = () => {
    contactInputListArray = getPreldudeContactArray(contactListJsonLibrary);
};

// contact input interface by Arnesto

const initInput = (element, event) => {
    event.stopPropagation();
    const parentElement = element.closest('.contact-list-input-container');
    parentElement.querySelector('img').setAttribute('src', ARROW_UP_ICON);
    element.setAttribute('placeholder', '');
    focusedContactListState();
};

const initInputContainer = (element) => {
    element.querySelector('input').focus();
    element.setAttribute('onclick', 'finishInputContainer(this)');
    renderContactInputList();
};

const finishInputContainer = (element) => {
    element.querySelector('input').blur();
    element.setAttribute('onclick', 'initInputContainer(this)');
};

const finishedInput = (element, event) => {
    event.stopPropagation();
    const parentElement = element.closest('.contact-list-input-container');
    parentElement.setAttribute('onclick', 'initInputContainer(this)');
    parentElement.querySelector('img').setAttribute('src', ARROW_DOWN_ICON);
    element.setAttribute('placeholder', 'Select contact to assign');
    blurredContactListState();
    element.value = '';
};

const toggleContactListAnimation = (list, addClass, removeClass) => {
    if (!list) return;
    list.classList.remove(removeClass);
    list.classList.add(addClass);
};

const focusedContactListState = () => {
    toggleContactListAnimation(document.getElementById('contactInputList'), 'pop-down-contact-liste-add-task-animating', 'pop-up-contact-liste-add-task-animating');
    toggleContactListAnimation(document.getElementById('contactInputListEdit'), 'pop-down-contact-liste-add-task-animating', 'pop-up-contact-liste-add-task-animating');
};

const blurredContactListState = () => {
    const contactList = document.getElementById('contactInputList');
    const contactListEdit = document.getElementById('contactInputListEdit');
    toggleContactListAnimation(contactList, 'pop-up-contact-liste-add-task-animating', 'pop-down-contact-liste-add-task-animating');
    toggleContactListAnimation(contactListEdit, 'pop-up-contact-liste-add-task-animating', 'pop-down-contact-liste-add-task-animating');
    setTimeout(() => {
        contactList.classList.remove('pop-up-contact-liste-add-task-animating');
        contactListEdit?.classList.remove('pop-up-contact-liste-add-task-animating');
    }, 500);
};

const contactInputListClicked = (event) => event.preventDefault();

const preventDefault = (element, event) => {
    const inputField = document.getElementById('contactInput');
    const inputFieldEdit = document.getElementById('contactInputEdit');
    if (event.target !== inputField && event.target !== inputFieldEdit) {
        event.preventDefault();
    }
};

const assignedToLabelClicked = (event) => event.preventDefault();

const contactSelected = (element) => {
    const checkbox = element.closest('.contact-input-class-card').querySelector('input');
    toggleContactSelection(checkbox);
};

const contactSelectedCheckbox = (element) => {
    element.checked = !element.checked;
};

const toggleContactSelection = (checkbox) => {
    setContactSelectedList(checkbox.id);
    renderContactSelectedList();
    checkbox.checked = !checkbox.checked;
};

const setContactSelectedList = (id) => {
    if (!contactSelectedList) contactSelectedList = [];
    if (contactSelectedList.includes(id)) {
        contactSelectedList.splice(contactSelectedList.indexOf(id), 1);
    } else {
        contactSelectedList.push(id);
    }
};

const initContactListSearch = (element, event) => {
    event.stopPropagation();
    const inputValue = element.value;
    if (inputValue.length >= 3) {
        const filteredArray = contactInputListArray.filter(c => c.forename.toLowerCase().includes(element.value));
        renderfilteredArrayList(filteredArray, contactSelectedList);
    }
    if (inputValue < 3) renderContactInputList();
};


function initDropdown(dialog) {
    const els = setupElements(dialog);
    const state = { activeIndex: -1 };
    attachListeners(els, state);
}

function setupElements(dialog) {
    const trigger = replaceWithClone(dialog.querySelector(TRIGGER_SELECTOR));
    const list = replaceWithClone(dialog.querySelector(LIST_SELECTOR));
    const label = dialog.querySelector(LABEL_SELECTOR);
    const arrow = dialog.querySelector(ARROW_SELECTOR);
    const options = Array.from(list.querySelectorAll('.dropdown-option'));
    return { trigger, list, label, arrow, options };
}

function replaceWithClone(element) {
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone;
}

function openList(els, state) {
    els.list.hidden = false;
    els.trigger.setAttribute('aria-expanded', 'true');
    els.arrow.src = ARROW_UP_ICON;
    state.activeIndex = els.options.findIndex(o => o.getAttribute('aria-selected') === 'true');
    if (state.activeIndex === -1) state.activeIndex = 0;
    setActive(els, state, state.activeIndex);
    els.list.focus();
}

function closeList(els) {
    els.list.hidden = true;
    els.trigger.setAttribute('aria-expanded', 'false');
    els.arrow.src = ARROW_DOWN_ICON;
}

function toggleList(els, state) {
    els.list.hidden ? openList(els, state) : closeList(els);
}

function setActive(els, state, index) {
    els.options.forEach(o => o.classList.remove('active'));
    els.options[index].classList.add('active');
    state.activeIndex = index;
}

function selectOption(els, option) {
    els.options.forEach(o => o.setAttribute('aria-selected', 'false'));
    option.setAttribute('aria-selected', 'true');
    els.label.textContent = option.textContent;
    els.trigger.dataset.value = option.dataset.value;
    els.trigger.dispatchEvent(new Event('customchange', { bubbles: true }));
    closeList(els);
    els.trigger.focus();
}

function handleTriggerKeydown(e, els, state) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openList(els, state);
    }
}

function handleListKeydown(e, els, state) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        handleListArrowKey(e, els, state);
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(els, els.options[state.activeIndex]);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
        handleListExitKey(e, els);
    }
}

function handleListArrowKey(e, els, state) {
    e.preventDefault();
    const len = els.options.length;
    const delta = e.key === 'ArrowDown' ? 1 : -1;
    setActive(els, state, (state.activeIndex + delta + len) % len);
    els.options.forEach(o => o.setAttribute('aria-selected', 'false'));
    els.options[state.activeIndex].setAttribute('aria-selected', 'true');
}

function handleListExitKey(e, els) {
    closeList(els);
    if (e.key === 'Escape') els.trigger.focus();
}

function attachOptionListeners(els, state) {
    els.options.forEach((option, index) => {
        option.addEventListener('click', () => selectOption(els, option));
        option.addEventListener('mouseenter', () => setActive(els, state, index));
    });
}

function attachListeners(els, state) {
    els.trigger.addEventListener('click', () => toggleList(els, state));
    attachOptionListeners(els, state);
    els.trigger.addEventListener('keydown', (e) => handleTriggerKeydown(e, els, state));
    els.list.addEventListener('keydown', (e) => handleListKeydown(e, els, state));
}

document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown').forEach(d => closeDropdownIfOutside(d, e.target));
});
 
function closeDropdownIfOutside(dropdown, target) {
    if (dropdown.contains(target)) return;
    const list = dropdown.querySelector('.dropdown-list');
    if (!list || list.hidden) return;
 
    list.hidden = true;
    const trigger = dropdown.querySelector(TRIGGER_SELECTOR);
    const arrow = dropdown.querySelector(ARROW_SELECTOR);
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (arrow) arrow.src = ARROW_DOWN_ICON;
}
