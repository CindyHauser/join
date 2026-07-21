initDropdown(root);
initValidation(addTaskForm);

/**
 * Initializes the custom dropdown within the specified dialog.
 *
 * @param {HTMLElement} dialog - The dialog element containing the dropdown.
 * @returns {void}
 */
function initDropdown(dialog) {
    const els = setupElements(dialog);
    const state = { activeIndex: -1 };
    attachListeners(els, state);
}

/**
 * Initializes the contact input field focus state.
 *
 * @param {HTMLElement} element - The contact input element.
 * @param {Event} event - The related event.
 * @returns {void}
 */
const initInput = (element, event) => {
    event.stopPropagation();
    const parentElement = element.closest('.contact-list-input-container');
    parentElement.querySelector('img').setAttribute('src', ARROW_UP_ICON);
    element.setAttribute('placeholder', '');
    focusedContactListState();
};

/**
 * Opens the contact input container and renders the contact list.
 *
 * @param {HTMLElement} element - The container element.
 * @returns {void}
 */
const initInputContainer = (element) => {
    element.querySelector('input').focus();
    element.setAttribute('onclick', 'finishInputContainer(this)');
    renderContactInputList();
};

/**
 * Filters the contact list based on the current input value.
 *
 * @param {HTMLInputElement} element - The search input element.
 * @param {Event} event - The input event.
 * @returns {void}
 */
const initContactListSearch = (element, event) => {
    event.stopPropagation();
    const inputValue = element.value;
    if (inputValue.length >= 3) {
        const filteredArray = contactInputListArray.filter(c => c.forename.toLowerCase().includes(element.value));
        renderfilteredArrayList(filteredArray, contactSelectedList);
    }
    if (inputValue < 3) renderContactInputList();
};