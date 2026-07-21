/**
 * Returns a contact list card element for rendering.
 *
 * @param {Array<Object>} array - The source array of contact objects.
 * @param {number} index - The index of the contact to render.
 * @param {Array<string>} [comparedArray] - The list of selected contact ids.
 * @returns {string} HTML markup for the contact card.
 */
const setContactListCard = (array, index, comparedArray) => {
    const isSelected = comparedArray !== undefined && comparedArray.includes(array[index].id);
    return buildContactListCard(array[index], isSelected);
};

/**
 * Builds the HTML for a single contact card in the contact selection list.
 *
 * @param {Object} contact - The contact data.
 * @param {boolean} isSelected - Whether the contact is currently selected.
 * @returns {string} HTML markup for the contact card.
 */
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

/**
 * Builds a contact badge for an assigned contact display.
 *
 * @param {Array<string>} array - The selected contact id array.
 * @param {number} index - The index of the selected contact.
 * @param {Object<string, Object>} library - The contact library for lookup.
 * @returns {string} HTML markup for the selected contact badge.
 */
const setSelectedContactBadge = (array, index, library) => {
    const contact = library[array[index]];
    return `<div class="contact-input-badge" style="background-color: rgb(${contact.badgeColor[0]},${contact.badgeColor[1]},${contact.badgeColor[2]});">${contact.fornameFirstLetter}${contact.surnameFirstLetter}</div>`;
};

/**
 * Renders the list of contact cards into the specified containers.
 *
 * @param {Array<Object>} array - The array of contact objects to render.
 * @param {Array<string>} comparedArray - The list of selected contact ids.
 * @param {string} targetId - The id of the primary target container.
 * @param {string} targetEditId - The id of the edit mode target container.
 * @returns {void}
 */
const renderContactCards = (array, comparedArray, targetId, targetEditId) => {
    let html = '';
    for (let index = 0; index < array.length; index++) {
        html += setContactListCard(array, index, comparedArray);
    }
    document.getElementById(targetId).innerHTML = html;
    const editTarget = document.getElementById(targetEditId);
    if (editTarget) editTarget.innerHTML = html;
};

/**
 * Renders the contact input list for the add-task form.
 *
 * @returns {void}
 */
const renderContactInputList = () => {
    renderContactCards(contactInputListArray, contactSelectedList, 'contactInputList', 'contactInputListEdit');
};

/**
 * Renders a filtered contact list based on the provided search results.
 *
 * @param {Array<Object>} filteredArray - The filtered contact objects.
 * @param {Array<string>} comparedArray - The list of selected contact ids.
 * @returns {void}
 */
const renderfilteredArrayList = (filteredArray, comparedArray) => {
    renderContactCards(filteredArray, comparedArray, 'contactInputList', 'contactInputListEdit');
};

/**
 * Renders the currently selected contacts as badges.
 *
 * @returns {void}
 */
const renderContactSelectedList = () => {
    let html = '';
    for (let index = 0; index < contactSelectedList.length; index++) {
        html += setSelectedContactBadge(contactSelectedList, index, contactListJsonLibrary);
    }
    document.getElementById('selectedContactField').innerHTML = html;
    const editTarget = document.getElementById('selectedContactFieldEdit');
    if (editTarget) editTarget.innerHTML = html;
};

/**
 * Fetches the contact library from Firebase.
 *
 * @returns {Promise<Object>} The parsed contact library.
 */
const getLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/contact" + ".json");
    return response.json();
};

/**
 * Initializes the global contact library from Firebase.
 *
 * @returns {Promise<void>}
 */
const setLibraryForFirebaseInit = async () => {
    contactListJsonLibrary = await getLibraryForFirebaseInit();
};

/**
 * Maps a contact object entry to the local contact structure.
 *
 * @param {string} key - The contact id.
 * @param {Object} object - The source object containing contact data.
 * @returns {Object} The normalized contact object.
 */
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

/**
 * Converts the raw contact library object into a sorted array.
 *
 * @param {Object} object - The raw contact library object.
 * @returns {Array<Object>} The sorted contact array.
 */
const getPreldudeContactArray = (object) => {
    let preludeContactArray = [];
    for (const key in object) {
        if (key != "position") {
            preludeContactArray.push(setPreludeContactArrayStructure(key, object));
        }
    }
    return preludeContactArray.sort((a, b) => a.forename.localeCompare(b.forename));
};

/**
 * Creates the internal contact input list from the loaded contact library.
 *
 * @returns {void}
 */
const setContactInputList = () => {
    contactInputListArray = getPreldudeContactArray(contactListJsonLibrary);
};

/**
 * Completes the contact input container interaction and closes it.
 *
 * @param {HTMLElement} element - The contact input container element.
 * @returns {void}
 */
const finishInputContainer = (element) => {
    element.querySelector('input').blur();
    element.setAttribute('onclick', 'initInputContainer(this)');
};

/**
 * Handles blur state for the contact search input and resets its display.
 *
 * @param {HTMLElement} element - The search input element.
 * @param {Event} event - The event object.
 * @returns {void}
 */
const finishedInput = (element, event) => {
    event.stopPropagation();
    const parentElement = element.closest('.contact-list-input-container');
    parentElement.setAttribute('onclick', 'initInputContainer(this)');
    parentElement.querySelector('img').setAttribute('src', ARROW_DOWN_ICON);
    element.setAttribute('placeholder', 'Select contact to assign');
    blurredContactListState();
    element.value = '';
};

/**
 * Adds or removes animation classes on the contact list container.
 *
 * @param {HTMLElement|null} list - The contact list element.
 * @param {string} addClass - The class to add.
 * @param {string} removeClass - The class to remove.
 * @returns {void}
 */
const toggleContactListAnimation = (list, addClass, removeClass) => {
    if (!list) return;
    list.classList.remove(removeClass);
    list.classList.add(addClass);
};

/**
 * Displays the focused state for the contact input lists.
 *
 * @returns {void}
 */
const focusedContactListState = () => {
    toggleContactListAnimation(document.getElementById('contactInputList'), 'pop-down-contact-liste-add-task-animating', 'pop-up-contact-liste-add-task-animating');
    toggleContactListAnimation(document.getElementById('contactInputListEdit'), 'pop-down-contact-liste-add-task-animating', 'pop-up-contact-liste-add-task-animating');
};

/**
 * Displays the blurred state for the contact input lists and cleans up animation classes.
 *
 * @returns {void}
 */
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

/**
 * Prevents default click behavior on the contact input list.
 *
 * @param {Event} event - The click event.
 * @returns {void}
 */
const contactInputListClicked = (event) => event.preventDefault();

/**
 * Prevents default behavior when the click is outside the contact inputs.
 *
 * @param {HTMLElement} element - The clicked element.
 * @param {Event} event - The click event.
 * @returns {void}
 */
const preventDefault = (element, event) => {
    const inputField = document.getElementById('contactInput');
    const inputFieldEdit = document.getElementById('contactInputEdit');
    if (event.target !== inputField && event.target !== inputFieldEdit) {
        event.preventDefault();
    }
};

/**
 * Prevents default click behavior on the assigned-to label.
 *
 * @param {Event} event - The click event.
 * @returns {void}
 */
const assignedToLabelClicked = (event) => event.preventDefault();

/**
 * Toggles contact selection based on the clicked contact card.
 *
 * @param {HTMLElement} element - The clicked contact card element.
 * @returns {void}
 */
const contactSelected = (element) => {
    const checkbox = element.closest('.contact-input-class-card').querySelector('input');
    toggleContactSelection(checkbox);
};

/**
 * Toggles a checkbox selection state when its parent card is clicked.
 *
 * @param {HTMLInputElement} element - The contact checkbox element.
 * @returns {void}
 */
const contactSelectedCheckbox = (element) => {
    element.checked = !element.checked;
};

/**
 * Updates the selected contact list and rerenders the selected badges.
 *
 * @param {HTMLInputElement} checkbox - The contact checkbox element.
 * @returns {void}
 */
const toggleContactSelection = (checkbox) => {
    setContactSelectedList(checkbox.id);
    renderContactSelectedList();
    checkbox.checked = !checkbox.checked;
};

/**
 * Adds or removes a contact id from the selected contacts list.
 *
 * @param {string} id - The contact id.
 * @returns {void}
 */
const setContactSelectedList = (id) => {
    if (!contactSelectedList) contactSelectedList = [];
    if (contactSelectedList.includes(id)) {
        contactSelectedList.splice(contactSelectedList.indexOf(id), 1);
    } else {
        contactSelectedList.push(id);
    }
};