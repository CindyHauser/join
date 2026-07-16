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