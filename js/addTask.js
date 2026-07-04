if (typeof BASE_URL === "undefined") {
    globalThis.BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/";
}
const addTaskForm = document.querySelector('.add-task-form');
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

function setPriority(dialog,priority) {
    const button = dialog.querySelector(`.priority-btn.${priority}`);
    if (button) {
        selectPriority(button);
    }
}

initValidation(addTaskForm);

addTaskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm(addTaskForm)) return;
    await createTask(event, 'toDo');
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
        task.subtasks = parseSubtasks(element.value);
    } else if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
        const key = element.id || element.name || 'field';
        if (key !== 'subtask' && key !== 'contactInput' && key.length < 20) {
            task[key] = element.value;
        }
    }
}

const parseSubtasks = (value) => {
    const subtaskValue = value.trim();
    return subtaskValue === ''
        ? []
        : subtaskValue
            .split(/[\n,;]+/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
            .map((taskDescription) => ({ taskDescription, subtaskStateDone: false }));
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
    }
    contactSelectedList = []
    document.getElementById('selectedContactField').innerHTML = ''
    removePriority();
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
    template = returnStandardContactListCard(array,index)
    if (comparedArray === undefined) {
        return returnStandardContactListCard(array,index)
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


const returnStandardContactListCard = (array,index)=>{
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
    for (let index = 0; index < contactInputListArray.length; index++) {
        contactListInnerHtml += setContactListCard(contactInputListArray, index, contactSelectedList)
    }
    document.getElementById('contactInputList').innerHTML = contactListInnerHtml
    document.getElementById('contactInputListEdit').innerHTML = contactListInnerHtml
}



const renderfilteredArrayList = (filteredArray, comparedArray) => {
    let contactListInnerHtml = ''
    document.getElementById('contactInputList').innerHTML = ''
    for (let index = 0; index < filteredArray.length; index++) {
        contactListInnerHtml += setContactListCard(filteredArray, index, comparedArray)
    }
    document.getElementById('contactInputList').innerHTML = contactListInnerHtml
    document.getElementById('contactInputListEdit').innerHTML = contactListInnerHtml
}

const renderContactSelectedList = () => {
    let contactSelectedListInnerHtml = ''
    document.getElementById('selectedContactField').innerHTML = ''
    for (let index = 0; index < contactSelectedList.length; index++) {
        contactSelectedListInnerHtml += setSelectedContactBadge(contactSelectedList, index, contactListJsonLibrary)
    }
    document.getElementById('selectedContactField').innerHTML = contactSelectedListInnerHtml
    document.getElementById('selectedContactFieldEdit').innerHTML = contactSelectedListInnerHtml
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
    contactListEdit.classList.remove('pop-up-contact-liste-add-task-animating')
    contactListEdit.classList.add('pop-down-contact-liste-add-task-animating')
}

const blurredContactListState = () => {
    const contactList = document.getElementById('contactInputList')
    const contactListEdit = document.getElementById('contactInputListEdit')
    contactList.classList.remove('pop-down-contact-liste-add-task-animating')
    contactList.classList.add('pop-up-contact-liste-add-task-animating')
    contactListEdit.classList.remove('pop-down-contact-liste-add-task-animating')
    contactListEdit.classList.add('pop-up-contact-liste-add-task-animating')
    setTimeout(() => {
        contactList.classList.remove('pop-up-contact-liste-add-task-animating')
        contactListEdit.classList.remove('pop-up-contact-liste-add-task-animating')
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