const overlayAdd = document.getElementById('contactAddOverlay')
const allAddContactInputs = overlayAdd.querySelectorAll('input')
const overlayEdit = document.getElementById('contactEditOverlay')
const allEditContactInputs = overlayEdit.querySelectorAll('input')


const setSubmitPreventDefault = (event) => {
    event.preventDefault()
}

const forms = document.querySelectorAll('form')
forms.forEach(
    (form) => {
        form.addEventListener('submit', setSubmitPreventDefault)
    }
)

const clicked = (element) => {
    const container = element
    const expandedContactField = document.getElementById('contactCardExpandedRenderTarget')
    refreshmarksOnContactCards()
    container.classList.add('contact-member-selected')
    clickedResponsiveControl(element)
    expandedContactField.innerHTML = setExpandedContactcardsTemplate(element.id, contactListJsonLibrary)
    addEnteranceEffect(expandedContactField, 125)
}

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

const resetAllContactInput = () => {
    allAddContactInputs.forEach(
        (input) => {
            input.value = ''
        }
    )
}

const resetAllEditContactInput = () => {
    allEditContactInputs.forEach(
        (input) => {
            input.value = ''
        }
    )
}

const refreshmarksOnContactCards = () => {
    const memberCards = document.querySelectorAll('.contacts-member')
    memberCards.forEach(
        (card) => {
            card.classList.remove('contact-member-selected')
        }
    )
}

const setEventBubbling = (event) => {
    event.stopPropagation()
}

const closeExpandingCards = async () => {
    hideFunctionsMenu()
    setTimeout(() => {
        refreshmarksOnContactCards()
        document.getElementById('contactCardExpandedRenderTarget').innerHTML = ''
    }, 127);
    closeExpandingCardsResponsiveControl()
}

const closeExpandingCardsResponsiveControl = () => {
    const contactList = document.querySelector('.contact-list')
    const contactExpandedField = document.querySelector('.contact-expanded-field')
    contactList.classList.remove('hide-in-resp')
    contactExpandedField.classList.remove('show-in-resp')
}

const showFunctionsMenu = (event) => {
    event.stopPropagation()
    const contactExpandedField = event.target.closest('.contact-expanded-field')
    const functions = document.querySelector('.contacts-member-functions ')
    showFunctionsMenuParameterControl(functions, contactExpandedField)
}

const showFunctionsMenuParameterControl = (functions, contactExpandedField) => {
    functions.classList.add('fade-in-responsive-contact-functions-effect-on')
    contactExpandedField.setAttribute('onclick', 'hideFunctionsMenu()')
}

const hideFunctionsMenu = () => {
    const contactExpandedField = document.querySelector('.contact-expanded-field')
    contactExpandedField.setAttribute('onclick', 'closeExpandingCards()')
    const functions = document.querySelector('.contacts-member-functions ')
    functions.classList.replace('fade-in-responsive-contact-functions-effect-on', 'fade-out-responsive-contact-functions-effect-on')
    setTimeout(() => {
        functions.classList.remove('fade-out-responsive-contact-functions-effect-on')
    }, 126);
}

const addEnteranceEffect = (container, transitionTime) => {
    container.classList.add('fade-in-effect-on')
    setTimeout(() => {
        container.classList.remove('fade-in-effect-on')
    }, transitionTime + 100)
}

const addOverlayContactEXitEffect = (OverlayInnerContainer, overlayAddContact, transitionTime) => {
    OverlayInnerContainer.classList.add('fade-out-effect-on')
    setTimeout(() => {
        OverlayInnerContainer.classList.remove('fade-out-effect-on')
        overlayAddContact.classList.remove('contact-overlay-activated')
        resetAllErrorMarks(resetAllErrorMarksCallBack)
    }, transitionTime + 100)
}

const initOverlayAddContact = () => {
    const overlayAddContact = document.getElementById('contactAddOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    overlayAddContact.classList.add('contact-overlay-activated')
    addEnteranceEffect(OverlayInnerContainer, 125)
}

const initOverlayEditContact = () => {
    const overlayAddContact = document.getElementById('contactEditOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    overlayAddContact.classList.add('contact-overlay-activated')
    addEnteranceEffect(OverlayInnerContainer, 125)
}

const closeOverlayAddContact = () => {
    const overlayAddContact = document.getElementById('contactAddOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    addOverlayContactEXitEffect(OverlayInnerContainer, overlayAddContact, 125)
    resetAllContactInput()
}

const closeOverlayEditContact = () => {
    const overlayEditContact = document.getElementById('contactEditOverlay')
    const OverlayInnerContainer = overlayEditContact.querySelector('.contact-overlay-inner-container')
    addOverlayContactEXitEffect(OverlayInnerContainer, overlayEditContact, 125)
    resetAllEditContactInput()
    localStorage.removeItem('currentContactIdToEdit')
    savedID = ''
}

const resetAllErrorMarks = (resetAllErrorMarksCallBack) => {
    const parents = document.querySelectorAll('.contact-overlay-form-body-second-section')
    parents.forEach(
        (parent) => {
            resetAllErrorMarksCallBack(parent)
        }
    )
}

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

let contactFormInputPlaceHolder = ''
const contactFormFocused = (element) => {
    let focusedPlaceHolder = element.getAttribute('placeholder')
    contactFormInputPlaceHolder = focusedPlaceHolder
    element.setAttribute('placeholder', '')
    const inputParent = element.closest('.contact-input-parent')
    inputParent.classList.remove('error-message-activated')
    inputParent.classList.add('contact-form-overlay-input-parent-focused')
    document.getElementById(`${element.id}ContainerError`).setAttribute('style', 'opacity:0')
}

const contactFormBlured = (element) => {
    element.setAttribute('placeholder', contactFormInputPlaceHolder)
    const inputParent = element.closest('.contact-input-parent')
    inputParent.classList.remove('contact-form-overlay-input-parent-focused')
}


const setAlertAddContactSuccess = () => {
    const alertElement = document.getElementById('AddContactSuccessAlert')
    const alertElementParent = alertElement.closest('.contact-success-message-parent')
    setAlertAddContactSuccessTimer(alertElement,alertElementParent)
}

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

let savedID = ''
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
