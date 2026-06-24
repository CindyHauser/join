const overlayAdd = document.getElementById('contactAddOverlay')
const allAddContactInputs = overlayAdd.querySelectorAll('input')

const clicked = (element) => {
    const container = element
    const expandedContactField = document.getElementById('contactCardExpandedRenderTarget')
    refreshmarksOnContactCards()
    container.classList.add('contact-member-selected')
    expandedContactField.innerHTML = setExpandedContactcardsTemplate(element.id, contactListJsonLibrary)
    addEnteranceEffect(expandedContactField, 450)


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

const closeExpandingCards = () => {
    refreshmarksOnContactCards()
    document.getElementById('contactCardExpandedRenderTarget').innerHTML = ''
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
        resetAllErrorMarks()
    }, transitionTime + 100)
}

const deleteContact = async (id) => {
    await deleteContactDataFromFireBase("/contact/" + `${id}`)
    closeExpandingCards()
    await setLibraryForFirebaseInit();
    getContactsArray();
    renderContactList()
}

const initOverlayAddContact = () => {
    const overlayAddContact = document.getElementById('contactAddOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    overlayAddContact.classList.add('contact-overlay-activated')
    addEnteranceEffect(OverlayInnerContainer, 450)
}

const closeOverlayAddContact = () => {
    const overlayAddContact = document.getElementById('contactAddOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    addOverlayContactEXitEffect(OverlayInnerContainer, overlayAddContact, 450)
    
}

const resetAllErrorMarks = () => {
    const parent = document.querySelector('.contact-overlay-form-body-second-section')
    const allErrorMessage = parent.querySelectorAll('.input-error-span')
    const allInputContainer = parent.querySelectorAll('.contact-input-parent')
    allErrorMessage.forEach(
        (error) => {
            error.setAttribute('style', 'opacity:0')
        }
    )
    allInputContainer.forEach(
        (container)=>{
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



const createContact = () => {
    let validationArray = []
    validationArray = setValidationArray(allAddContactInputs, validationArray)
    let validationCheckvalue = ObjectArrayValidation(validationArray)
    if (validationCheckvalue != true) {
        markFalsevalue(validationCheckvalue)
    }
}