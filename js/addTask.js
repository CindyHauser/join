if (typeof BASE_URL === "undefined") {
    globalThis.BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/";
}
const addTaskForm = document.querySelector('.add-task-form');
const root = document.getElementById('dialogAddTask') || document;
contactListJsonLibrary = '';
let contactInputListArray = []
let contactSelectedList = []

function selectPriority(button) {
    removePriority();
    button.classList.add('selected');
}

function removePriority() {
    document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('selected'));
}

function setPriority(dialog, priority) {
    const button = dialog.querySelector(`.priority-btn.${priority}`);
    if (button) {
        selectPriority(button);
    }
}

initDropdown(root);

initValidation(addTaskForm);

addTaskForm.addEventListener('submit', async (event) => {
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
});

async function createTask(event, state) {
    if (event) { event.preventDefault(); }
    const form = document.querySelector('.add-task-form');
    if (!form) { return; }
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
}

const collectTaskField = (element, task) => {
    if (element.id === 'subtask') {
        const subtaskInputValue = element.dataset.subtasks?.trim() || element.value.trim();
        task.subtasks = parseSubtasks(subtaskInputValue);
    } else if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) ||
        (element.tagName === 'BUTTON' && element.dataset.customDropdown === 'true')
    ) {
        const key = element.id || element.name || 'field';
        if (key !== 'subtask' && key !== 'contactInput' && key.length < 20) {
            const value = element.tagName === 'BUTTON' && element.dataset.customDropdown === 'true'
                ? element.dataset.value || ''
                : element.value;
            task[key] = value;
        }
    }
}

const parseSubtasks = (value) => {
    const subtaskValue = value.trim();
    return subtaskValue === ''
        ? []
        : subtaskValue
            .split(/\n+/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
            .map((taskDescription) => ({ taskDescription, subtaskStateDone: false }));
}

const getSubtaskPreviewList = (input) => {
    let previewList = input.parentElement?.querySelector('.subtask-preview-list');
    if (!previewList) {
        previewList = document.createElement('ul');
        previewList.className = 'subtask-preview-list';
        input.insertAdjacentElement('afterend', previewList);
    }
    return previewList;
}

const renderSubtaskPreview = (input) => {
    const previewList = getSubtaskPreviewList(input);
    const subtasks = input.dataset.subtasks
        ? input.dataset.subtasks.split(/\r?\n/).filter(Boolean)
        : [];

    previewList.innerHTML = subtasks
        .map((subtask) => `<li class="subtask-preview-item">${subtask}</li>`)
        .join('');
};

const clearSubtaskPreview = (input) => {
    const previewList = input?.parentElement?.querySelector('.subtask-preview-list');
    if (previewList) {
        previewList.remove();
    }
};

async function addEditSubtask(event, taskId) {
    if (event.key !== 'Enter') return;

    event.preventDefault();

    const input = event.target;
    const value = input.value.trim();

    if (!value) return;

    if (!taskId) {
        const storedSubtasks = input.dataset.subtasks
            ? input.dataset.subtasks.split(/\r?\n/).filter(Boolean)
            : [];
        storedSubtasks.push(value);
        input.dataset.subtasks = storedSubtasks.join('\n');
        input.value = '';
        renderSubtaskPreview(input);
        return;
    }

    const subtaskList = document.getElementById('editSubtaskDescription');
    if (!subtaskList) return;

    const lastLi = subtaskList.querySelector('li:last-child');
    const nextIndex = lastLi ? Number(lastLi.dataset.value) + 1 : 0;
    const newSubtask = {
        taskDescription: value,
        subtaskStateDone: false
    };

    await fetch(`${BASE_URL}/task/${taskId}/subtasks/${nextIndex}.json`, putMethode(newSubtask));

    const li = document.createElement('li');
    li.dataset.value = nextIndex;
    li.innerHTML = `<div class="subtask-item"><span class="editSubtaskText">${value}</span> ${getButtonSubtask()}</div>`;

    subtaskList.appendChild(li);
    input.value = '';
}

const getSelectedPriority = () => {
    const selectedPriorityButton = document.querySelector('.priority-btn.selected');
    return selectedPriorityButton
        ? selectedPriorityButton.textContent.trim().split(' ')[0].toLowerCase()
        : 'low';
}

function clearAllInput() {
    const form = document.querySelector('.add-task-form');
    if (form) {
        form.reset();
        const subtaskInput = form.querySelector('#subtask');
        if (subtaskInput) {
            subtaskInput.value = '';
            subtaskInput.dataset.subtasks = '';
            clearSubtaskPreview(subtaskInput);
        }
    }
    contactSelectedList = []
    document.getElementById('selectedContactField').innerHTML = ''
    removePriority();
    resetDropdown(root);
}

function resetDropdown(root) {
  const label = root.querySelector('#dropdownLabel, #dropdownLabelEdit');
  const list = root.querySelector('#dropdownList, #dropdownListEdit');
  const categoryButton = root.querySelector('#category');
  if (!label || !list) return;

  const options = Array.from(list.querySelectorAll('.dropdown-option'));
  options.forEach(o => o.setAttribute('aria-selected', 'false'));
  label.textContent = 'Select Task Category';

  if (categoryButton) {
    categoryButton.dataset.value = '';
  }
}

const postNewTaskToFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    )
    return await response.json()
}


// contact input template by Arnesto

const setContactListCard = (array, index, comparedArray) => {
    let template;
    template = returnStandardContactListCard(array, index)
    if (comparedArray === undefined) {
        return returnStandardContactListCard(array, index)
    }
    if (comparedArray.includes(array[index].id)) {
        template = `<div class="contact-input-class-card" onclick="contactSelected(this)">
                    <div class="input-name-and-badge">
                    <div class="contact-input-badge"  style="background-color: rgb(${array[index].badgeColor[0]},${array[index].badgeColor[1]},${array[index].badgeColor[2]});">${array[index].fornameFirstLetter}${array[index].surnameFirstLetter}</div>
                    <div class="contact-input-name"> ${array[index].forename} ${array[index].surname}</div>
                    </div>
                    <input checked onclick="contactSelectedCheckbox(this)" type="checkbox" name="${array[index].forename} ${array[index].surname}" id=${array[index].id} class="checkbox-contact-list">
                    </div>`
    }
    return template
}


const returnStandardContactListCard = (array, index) => {
    return `<div class="contact-input-class-card" onclick="contactSelected(this)">
                    <div class="input-name-and-badge">
                    <div class="contact-input-badge"  style="background-color: rgb(${array[index].badgeColor[0]},${array[index].badgeColor[1]},${array[index].badgeColor[2]});">${array[index].fornameFirstLetter}${array[index].surnameFirstLetter}</div>
                    <div class="contact-input-name"> ${array[index].forename} ${array[index].surname}</div>
                    </div>
                    <input onclick="contactSelectedCheckbox(this)" type="checkbox" name="${array[index].forename} ${array[index].surname}" id=${array[index].id} class="checkbox-contact-list">
                    </div>`
}

const setSelectedContactBadge = (array, index, library) => {
    let template = `
        <div class="contact-input-badge"  style="background-color: rgb(${library[array[index]].badgeColor[0]},${library[array[index]].badgeColor[1]},${library[array[index]].badgeColor[2]});">${library[array[index]].fornameFirstLetter}${library[array[index]].surnameFirstLetter}</div>`
    return template
}

// contact input Render by Arnesto

const renderContactInputList = () => {
    let contactListInnerHtml = ''
    const contactInputListEdit = document.getElementById('contactInputListEdit')
    for (let index = 0; index < contactInputListArray.length; index++) {
        contactListInnerHtml += setContactListCard(contactInputListArray, index, contactSelectedList)
    }
    document.getElementById('contactInputList').innerHTML = contactListInnerHtml
    if (contactInputListEdit) {
        contactInputListEdit.innerHTML = contactListInnerHtml
    }
}



const renderfilteredArrayList = (filteredArray, comparedArray) => {
    let contactListInnerHtml = ''
    const contactInputListEdit = document.getElementById('contactInputListEdit')
    document.getElementById('contactInputList').innerHTML = ''
    for (let index = 0; index < filteredArray.length; index++) {
        contactListInnerHtml += setContactListCard(filteredArray, index, comparedArray)
    }
    document.getElementById('contactInputList').innerHTML = contactListInnerHtml
    if (contactInputListEdit) {
        contactInputListEdit.innerHTML = contactListInnerHtml
    }
}

const renderContactSelectedList = () => {
    let contactSelectedListInnerHtml = ''
    const selectedContactFieldEdit = document.getElementById('selectedContactFieldEdit')
    document.getElementById('selectedContactField').innerHTML = ''
    for (let index = 0; index < contactSelectedList.length; index++) {
        contactSelectedListInnerHtml += setSelectedContactBadge(contactSelectedList, index, contactListJsonLibrary)
    }
    document.getElementById('selectedContactField').innerHTML = contactSelectedListInnerHtml
    if (selectedContactFieldEdit) {
        selectedContactFieldEdit.innerHTML = contactSelectedListInnerHtml
    }
}

// contact input data function by Arnesto

const getLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/contact" + ".json")
    return response.json()
}

const setLibraryForFirebaseInit = async () => {
    contactListJsonLibrary = await getLibraryForFirebaseInit()
    return
}

const setPreludeContactArrayStructure = (key, object) => {
    let template = {
        "id": key,
        "forename": object[key].forename,
        "surname": object[key].surname,
        "phone": object[key].phone,
        "fornameFirstLetter": object[key].fornameFirstLetter,
        "surnameFirstLetter": object[key].surnameFirstLetter,
        "email": object[key].email,
        "badgeColor": object[key].badgeColor
    }
    return template
}

const getPreldudeContactArray = (object) => {
    let preludeContactArray = []
    for (key in object) {
        if (key != "position") {
            preludeContactArray.push(setPreludeContactArrayStructure(key, object))
        }
    }
    return preludeContactArray.sort(
        (a, b) => a.forename.localeCompare(b.forename)
    )
}

const setContactInputList = () => {
    contactInputListArray = getPreldudeContactArray(contactListJsonLibrary)
    return
}

// contact input interface by Arnesto

const initInput = (element, event) => {
    event.stopPropagation()
    const parentElement = element.closest('.contact-list-input-container')
    parentElement.querySelector('img').setAttribute('src', `../assets/ui-icons/arrow-up.svg`)
    element.setAttribute('placeholder', '')
    focusedContactListState()
}

const initInputContainer = (element) => {
    element.querySelector('input').focus()
    element.setAttribute('onclick', 'finishInputContainer(this)')
    renderContactInputList()
}


const finishInputContainer = (element) => {
    element.querySelector('input').blur()
    element.setAttribute('onclick', 'initInputContainer(this)')
}

const finishedInput = (element, event) => {
    event.stopPropagation()
    const parentElement = element.closest('.contact-list-input-container')
    parentElement.setAttribute('onclick', 'initInputContainer(this)')
    parentElement.querySelector('img').setAttribute('src', `../assets/ui-icons/arrow-down.svg`)
    element.setAttribute('placeholder', 'Select contact to assign')
    blurredContactListState()
    element.value = ''
}

const focusedContactListState = () => {
    const contactList = document.getElementById('contactInputList')
    const contactListEdit = document.getElementById('contactInputListEdit')
    contactList.classList.remove('pop-up-contact-liste-add-task-animating')
    contactList.classList.add('pop-down-contact-liste-add-task-animating')
    if (contactListEdit) {
        contactListEdit.classList.remove('pop-up-contact-liste-add-task-animating')
        contactListEdit.classList.add('pop-down-contact-liste-add-task-animating')
    }
}

const blurredContactListState = () => {
    const contactList = document.getElementById('contactInputList')
    const contactListEdit = document.getElementById('contactInputListEdit')
    contactList.classList.remove('pop-down-contact-liste-add-task-animating')
    contactList.classList.add('pop-up-contact-liste-add-task-animating')
    if (contactListEdit) {
        contactListEdit.classList.remove('pop-down-contact-liste-add-task-animating')
        contactListEdit.classList.add('pop-up-contact-liste-add-task-animating')
    }
    setTimeout(() => {
        contactList.classList.remove('pop-up-contact-liste-add-task-animating')
        if (contactListEdit) {
            contactListEdit.classList.remove('pop-up-contact-liste-add-task-animating')
        }
    }, 500);
}

const contactInputListClicked = (event) => {
    event.preventDefault()
}

const preventDefault = (element, event) => {
    const inputField = document.getElementById('contactInput')
    const inputFieldEdit = document.getElementById('contactInputEdit')
    if (event.target !== inputField || event.target !== inputFieldEdit) {
        event.preventDefault()
    }
}

const assignedToLabelClicked = (event) => {
    event.preventDefault()
}

const contactSelected = (element) => {
    const parentElement = element.closest('.contact-input-class-card')
    const checkbox = parentElement.querySelector('input')
    setContactSelectedList(checkbox.id)
    renderContactSelectedList()
    checkbox.checked = !checkbox.checked
}

const contactSelectedCheckbox = (element) => {
    setContactSelectedList(element.id)
    setContactSelectedList(element.id)
    renderContactSelectedList()
    element.checked = !element.checked
}


const setContactSelectedList = (id) => {
    if (!contactSelectedList) {
        contactSelectedList = []
    }
    if (contactSelectedList.includes(id)) {
        const index = contactSelectedList.indexOf(id)
        contactSelectedList.splice(index, 1)
    } else {
        contactSelectedList.push(id)
    }
}

const initContactListSearch = (element, event) => {
    event.stopPropagation()
    const inputValue = element.value
    if (inputValue.length >= 3) {
        let filteredArray = contactInputListArray.filter(
            (arrayIndex) => {
                return arrayIndex.forename.toLowerCase().includes(element.value)
            })
        renderfilteredArrayList(filteredArray, contactSelectedList)
    }
    if (inputValue < 3) {
        renderContactInputList()
    }

}



function initDropdown(dialog) {
    const els = setupElements(dialog);
    const state = { activeIndex: -1 };
    attachListeners(els, state);
}

function setupElements(dialog) {
    const oldTrigger = dialog.querySelector('#category, #categoryEdit');
    const oldList = dialog.querySelector('#dropdownList, #dropdownListEdit');
    const trigger = oldTrigger.cloneNode(true);
    oldTrigger.parentNode.replaceChild(trigger, oldTrigger);
    const list = oldList.cloneNode(true);
    oldList.parentNode.replaceChild(list, oldList);
    const label = dialog.querySelector('#dropdownLabel, #dropdownLabelEdit');
    const arrow = dialog.querySelector('#dropdownArrow, #dropdownArrowEdit');
    const options = Array.from(list.querySelectorAll('.dropdown-option'));
    return { trigger, list, label, arrow, options };
}

function openList(els, state) {
    els.list.hidden = false;
    els.trigger.setAttribute('aria-expanded', 'true');
    els.arrow.src = '../assets/ui-icons/arrow-up.svg';
    state.activeIndex = els.options.findIndex(o => o.getAttribute('aria-selected') === 'true');
    if (state.activeIndex === -1) state.activeIndex = 0;
    setActive(els, state, state.activeIndex);
    els.list.focus();
}

function closeList(els) {
    els.list.hidden = true;
    els.trigger.setAttribute('aria-expanded', 'false');
    els.arrow.src = '../assets/ui-icons/arrow-down.svg';
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
    document.querySelectorAll('.dropdown').forEach(d => {
        if (!d.contains(e.target)) {
            const list = d.querySelector('.dropdown-list');
            if (list && !list.hidden) list.hidden = true;
        }
    });
});
