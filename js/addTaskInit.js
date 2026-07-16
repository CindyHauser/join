initDropdown(root);
initValidation(addTaskForm);

function initDropdown(dialog) {
    const els = setupElements(dialog);
    const state = { activeIndex: -1 };
    attachListeners(els, state);
}

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

const initContactListSearch = (element, event) => {
    event.stopPropagation();
    const inputValue = element.value;
    if (inputValue.length >= 3) {
        const filteredArray = contactInputListArray.filter(c => c.forename.toLowerCase().includes(element.value));
        renderfilteredArrayList(filteredArray, contactSelectedList);
    }
    if (inputValue < 3) renderContactInputList();
};