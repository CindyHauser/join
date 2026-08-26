/**
 * The main DOM element container for the "Add Contact" overlay.
 * @constant {HTMLElement}
 */
const overlayAdd = document.getElementById('contactAddOverlay')
/**
 * A static collection of all input fields within the "Add Contact" overlay.
 * @constant {NodeListOf<HTMLInputElement>}
 */
const allAddContactInputs = overlayAdd.querySelectorAll('input')
/**
 * The main DOM element container for the "Edit Contact" overlay.
 * @constant {HTMLElement}
 */
const overlayEdit = document.getElementById('contactEditOverlay')
/**
 * A static collection of all input fields within the "Edit Contact" overlay.
 * @constant {NodeListOf<HTMLInputElement>}
 */
const allEditContactInputs = overlayEdit.querySelectorAll('input')

/**
 * Handles the click event on a contact card in the list.
 * Clears previous selections, highlights the newly clicked card, renders the contact's 
 * detailed information into the expanded view, manages responsive UI transitions, 
 * and triggers an entrance animation.
 *
 * @param {HTMLElement} element - The DOM element of the clicked contact card.
 */
const clicked = (element) => {
    const expandedContact = document.querySelector('.contact-member-selected')
    expandedContact?.setAttribute('onclick', 'clicked(this)')
    const container = element
    element.setAttribute('onclick', 'closeExpandingCards()')
    const expandedContactField = document.getElementById('contactCardExpandedRenderTarget')
    refreshmarksOnContactCards()
    container.classList.add('contact-member-selected')
    clickedResponsiveControl(element)
    expandedContactField.innerHTML = setExpandedContactcardsTemplate(element.id, contactListJsonLibrary)
    addEnteranceEffect(expandedContactField, 125)
}

/**
 * Manages responsive UI layout transitions when a contact card is selected.
 * Switches the mobile view from the contact list to the expanded contact details. 
 * Temporarily disables body scrolling to prevent layout glitches or scrollbar jumps during the transition animation.
 *
 * @param {HTMLElement} element - The DOM element of the clicked contact card.
 */
const clickedResponsiveControl = (element) => {
    const contactList = document.querySelector('.contact-list')
    const contactExpandedField = document.querySelector('.contact-expanded-field')
    contactList.classList.add('hide-in-resp')
    contactExpandedField.classList.add('show-in-resp')
    document.body.classList.add('hide-body-scroll-bar-in-responsive')
    setTimeout(() => {
        document.body.classList.remove('hide-body-scroll-bar-in-responsive')
    }, 250);
}

/**
 * Clears all input fields in the "Add Contact" form.
 * Iterates through the predefined collection of input elements and resets their values to an empty string.
 */
const resetAllContactInput = () => {
    allAddContactInputs.forEach(
        (input) => {
            input.value = ''
        }
    )
}

/**
 * Clears all input fields in the "Edit Contact" form.
 * Iterates through the predefined collection of edit input elements and resets their values to an empty string.
 */
const resetAllEditContactInput = () => {
    allEditContactInputs.forEach(
        (input) => {
            input.value = ''
        }
    )
}

/**
 * Removes the selection highlight from all contact cards in the list.
 * Iterates through all DOM elements with the 'contacts-member' class and removes 
 * the 'contact-member-selected' class to reset their visual state.
 */
const refreshmarksOnContactCards = () => {
    const memberCards = document.querySelectorAll('.contacts-member')
    memberCards.forEach(
        (card) => {
            card.classList.remove('contact-member-selected')
        }
    )
}


/**
 * Closes the expanded contact details view and cleans up the UI state.
 * Hides the functions menu and immediately triggers responsive layout resets. 
 * Uses a short timeout (127ms) before clearing the rendered HTML and removing 
 * the selection highlights, allowing exit animations to finish smoothly.
 *
 * @returns {Promise<void>} A promise that resolves when the function executes.
 */
const closeExpandingCards = async () => {
    hideFunctionsMenu()
    setTimeout(() => {
        const expandedContact = document.querySelector('.contact-member-selected')
        expandedContact?.setAttribute('onclick', 'clicked(this)')
        refreshmarksOnContactCards()
        document.getElementById('contactCardExpandedRenderTarget').innerHTML = ''
    }, 127);
    closeExpandingCardsResponsiveControl()
}

/**
 * Closes the expanded contact details view and cleans up the UI state.
 * Hides the functions menu and immediately triggers responsive layout resets. 
 * Uses a short timeout (127ms) before clearing the rendered HTML and removing 
 * the selection highlights, allowing exit animations to finish smoothly.
 *
 * @returns {Promise<void>} A promise that resolves when the function executes.
 */
const closeExpandingCardsResponsiveControl = () => {
    const contactList = document.querySelector('.contact-list')
    const contactExpandedField = document.querySelector('.contact-expanded-field')
    contactList.classList.remove('hide-in-resp')
    contactExpandedField.classList.remove('show-in-resp')
}

/**
 * Displays the functions menu for a selected contact in the expanded view.
 * Stops event propagation to prevent unintended background clicks, identifies 
 * the closest expanded contact container, and delegates the display logic 
 * to the parameter control function.
 *
 * @param {Event} event - The DOM event triggered by clicking the menu toggle button.
 */
const showFunctionsMenu = (event) => {
    event.stopPropagation()
    const contactExpandedField = event.target.closest('.contact-expanded-field')
    const functions = document.querySelector('.contacts-member-functions ')
    showFunctionsMenuParameterControl(functions, contactExpandedField)
}

/**
 * Applies the visual transition to display the functions menu and sets up a dismiss listener.
 * Adds an animation class to the functions element to show it, and dynamically assigns an 'onclick' 
 * attribute to the expanded contact field so the menu can be closed by clicking the background.
 *
 * @param {HTMLElement} functions - The DOM element representing the functions menu.
 * @param {HTMLElement} contactExpandedField - The DOM element representing the expanded contact container.
 */
const showFunctionsMenuParameterControl = (functions, contactExpandedField) => {
    functions.classList.add('fade-in-responsive-contact-functions-effect-on')
    contactExpandedField.setAttribute('onclick', 'hideFunctionsMenu()')
}

/**
 * Hides the functions menu with a smooth fade-out animation.
 * Resets the 'onclick' attribute of the expanded contact field back to its default 
 * behavior (closing the expanded card). Swaps the fade-in CSS class for a fade-out 
 * class, and removes the animation class entirely after the transition completes (126ms).
 */
const hideFunctionsMenu = () => {
    const functions = document.querySelector('.contacts-member-functions ')
    functions?.classList.replace('fade-in-responsive-contact-functions-effect-on', 'fade-out-responsive-contact-functions-effect-on')
    setTimeout(() => {
        functions?.classList.remove('fade-out-responsive-contact-functions-effect-on')
    }, 126);
}

/**
 * Triggers a temporary fade-in entrance animation on a specified container.
 * Adds an animation class to the element and automatically removes it after 
 * the given transition time (plus a 100ms buffer) has elapsed to reset the state.
 *
 * @param {HTMLElement} container - The DOM element to animate.
 * @param {number} transitionTime - The duration of the CSS transition in milliseconds.
 */
const addEnteranceEffect = (container, transitionTime) => {
    container.classList.add('fade-in-effect-on')
    setTimeout(() => {
        container.classList.remove('fade-in-effect-on')
    }, transitionTime + 100)
}

/**
 * Applies a fade-out exit animation to the contact overlay and hides it cleanly.
 * Adds a fade-out CSS class to the inner container, waits for the animation to finish 
 * (using the transition time plus a 100ms buffer), and then removes the active class 
 * to hide the overlay while also resetting any input error marks.
 *
 * @param {HTMLElement} OverlayInnerContainer - The inner DOM element of the overlay that receives the fade-out animation.
 * @param {HTMLElement} overlayAddContact - The main outer overlay DOM element to be hidden.
 * @param {number} transitionTime - The duration of the CSS fade-out transition in milliseconds.
 */
const addOverlayContactEXitEffect = (OverlayInnerContainer, overlayAddContact, transitionTime) => {
    OverlayInnerContainer.classList.add('fade-out-effect-on')
    setTimeout(() => {
        OverlayInnerContainer.classList.remove('fade-out-effect-on')
        overlayAddContact.classList.remove('contact-overlay-activated')
        resetAllErrorMarks(resetAllErrorMarksCallBack)
    }, transitionTime + 100)
}

/**
 * Initializes and displays the "Add Contact" overlay.
 * Retrieves the main overlay and its inner container from the DOM, makes the overlay 
 * visible by adding an active class, and applies the entrance animation.
 */
const initOverlayAddContact = () => {
    const overlayAddContact = document.getElementById('contactAddOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    overlayAddContact.classList.add('contact-overlay-activated')
    addEnteranceEffect(OverlayInnerContainer, 125)
}

/**
 * Initializes and displays the "Edit Contact" overlay.
 * Retrieves the main edit overlay and its inner container from the DOM, makes it 
 * visible by adding an active class, and applies the smooth entrance animation.
 */
const initOverlayEditContact = () => {
    const overlayAddContact = document.getElementById('contactEditOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    overlayAddContact.classList.add('contact-overlay-activated')
    addEnteranceEffect(OverlayInnerContainer, 125)
}

/**
 * Closes the "Add Contact" overlay.
 * Retrieves the necessary DOM elements, triggers the fade-out exit animation, 
 * and resets all input fields in the form to ensure a clean state for the next use.
 */
const closeOverlayAddContact = () => {
    const overlayAddContact = document.getElementById('contactAddOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    addOverlayContactEXitEffect(OverlayInnerContainer, overlayAddContact, 125)
    resetAllContactInput()
}

/**
 * Closes the "Edit Contact" overlay and cleans up related temporary data.
 * Triggers the fade-out exit animation, resets all input fields within the edit form, 
 * and clears the currently edited contact ID from both local storage and the global state 
 * to prevent unintended data carry-over to future edits.
 */
const closeOverlayEditContact = () => {
    const overlayEditContact = document.getElementById('contactEditOverlay')
    const OverlayInnerContainer = overlayEditContact.querySelector('.contact-overlay-inner-container')
    addOverlayContactEXitEffect(OverlayInnerContainer, overlayEditContact, 125)
    resetAllEditContactInput()
    localStorage.removeItem('currentContactIdToEdit')
    savedID = ''
}

/**
 * Resets all validation error marks across the contact overlay forms.
 * Iterates through all designated form section containers and executes a provided 
 * callback function for each, allowing for flexible cleanup of error states.
 *
 * @param {Function} resetAllErrorMarksCallBack - A callback function that receives the parent DOM element as an argument and handles the removal of error styles.
 */
const resetAllErrorMarks = (resetAllErrorMarksCallBack) => {
    const parents = document.querySelectorAll('.contact-overlay-form-body-second-section')
    parents.forEach(
        (parent) => {
            resetAllErrorMarksCallBack(parent)
        }
    )
}

/**
 * Callback function to clear error states within a specific form section.
 * Hides all error message spans by setting their opacity to 0 and removes the 
 * 'error-message-activated' class from all input containers within the provided parent element.
 *
 * @param {HTMLElement} parent - The parent DOM element (form section) to be cleaned up.
 */
const resetAllErrorMarksCallBack = (parent) => {
    const allErrorMessage = parent.querySelectorAll('.input-error-span')
    const allInputContainer = parent.querySelectorAll('.contact-input-parent')
    allErrorMessage.forEach(
        (error) => {
            error.setAttribute('style', 'opacity:0')
        }
    )
    allInputContainer.forEach(
        (container) => {
            container.classList.remove('error-message-activated')
        }
    )
}

/** 
 * Temporarily stores the placeholder text of the currently focused input field. 
 * @type {string} 
 */
let contactFormInputPlaceHolder = ''

/**
 * Handles the focus event on a contact form input field.
 * Temporarily saves and removes the input's placeholder, clears any existing 
 * error highlighting from its parent container, applies a active focus style, 
 * and hides the specific error message associated with this input.
 *
 * @param {HTMLInputElement} element - The DOM element of the input field receiving focus.
 */
const contactFormFocused = (element) => {
    let focusedPlaceHolder = element.getAttribute('placeholder')
    contactFormInputPlaceHolder = focusedPlaceHolder
    element.setAttribute('placeholder', '')
    const inputParent = element.closest('.contact-input-parent')
    inputParent.classList.remove('error-message-activated')
    inputParent.classList.add('contact-form-overlay-input-parent-focused')
    document.getElementById(`${element.id}ContainerError`).setAttribute('style', 'opacity:0')
}

/**
 * Handles the blur (loss of focus) event on a contact form input field.
 * Restores the original placeholder text from the global variable and removes 
 * the active focus styling from the input's parent container.
 *
 * @param {HTMLInputElement} element - The DOM element of the input field losing focus.
 */
const contactFormBlured = (element) => {
    element.setAttribute('placeholder', contactFormInputPlaceHolder)
    const inputParent = element.closest('.contact-input-parent')
    inputParent.classList.remove('contact-form-overlay-input-parent-focused')
}

/**
 * Triggers the display of the success alert after a new contact is added.
 * Retrieves the specific alert element and its parent container from the DOM, 
 * then passes them to a helper function that handles the timer and animation logic.
 */
const setAlertAddContactSuccess = () => {
    const alertElement = document.getElementById('AddContactSuccessAlert')
    const alertElementParent = alertElement.closest('.contact-success-message-parent')
    setAlertAddContactSuccessTimer(alertElement, alertElementParent)
}

/**
 * Manages the animation sequence and timing for the success alert notification.
 * Sequentially adds and removes CSS classes using timeouts to show the parent container,
 * fade in the alert message, pause for readability, fade it out, and finally hide the container.
 * The entire visual sequence spans 3000 milliseconds (3 seconds).
 *
 * @param {HTMLElement} alertElement - The DOM element of the actual alert message to be animated.
 * @param {HTMLElement} alertElementParent - The parent container of the alert used for managing layout visibility.
 */
const setAlertAddContactSuccessTimer = (alertElement, alertElementParent) => {
    alertElementParent.classList.add('show-in-resp')
    setTimeout(() => {
        alertElement.classList.add('fade-in-effect-on')
    }, 600);
    setTimeout(() => {
        alertElement.classList.remove('fade-in-effect-on')
        alertElement.classList.add('fade-out-effect-on')
    }, 2550);
    setTimeout(() => {
        alertElement.classList.remove('fade-out-effect-on')
        alertElementParent.classList.remove('show-in-resp')
    }, 3000);
}

/** 
 * Stores the ID of the contact currently being edited.
 * @type {string} 
 */
let savedID = ''

/**
 * Initializes the edit process for a specific contact.
 * Saves the targeted contact ID in the global state and local storage, retrieves 
 * the contact's data from the central library, populates the edit form inputs with 
 * this data, and finally displays the edit overlay.
 *
 * @param {string|number} id - The unique identifier of the contact to be edited.
 */
const initEditContact = (id) => {
    savedID = id
    localStorage.setItem('currentContactIdToEdit', id)
    const contactAsJson = contactListJsonLibrary[id];
    setAllEditContactInputs(
        'editContactOverlayFormName', 'editContactOverlayFormPhone', 'editContactOverlayFormEmail',
        'editContactOverlayFormInitial', `${contactAsJson.forename} ${contactAsJson.surname}`, `${contactAsJson.email}`,
        contactAsJson.phone, contactAsJson.badgeColor, contactAsJson.fornameFirstLetter, contactAsJson.surnameFirstLetter
    )
    initOverlayEditContact()
}
