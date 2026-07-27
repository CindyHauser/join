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

// delete contact
// get Task Library 
// make array from the library 
const getTaskLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/task" + ".json")
    return response.json()
}

const putTaskContactSelectToFireBase = async (id, array = []) => {
    const response = await fetch(BASE_URL + "/task/" + `${id}/` + "contactSelect" + ".json", putMethode(array))
    return await response.json()
}

const setTaskDataStructure = (key, object) => {
    return {
        "id": key,
        "contactSelect": object[key].contactSelect,
    }
}

const refreshContactSelectDataStructure = (taskId, contactSelectArray, contactId) => {
    return {
        "taskId": taskId,
        "contactSelectNew": setNewContactSelect(contactSelectArray, contactId),
    }
}

const getPreludeGeneralTaskArray = (objectLibrary, callbackFn) => {
    let preludeGeneralTaskArray = []
    for (key in objectLibrary) {
        if (key != "position") {
            preludeGeneralTaskArray.push(callbackFn(key, objectLibrary))
        }
    }
    return preludeGeneralTaskArray
}

const getGeneralTaskArray = (objectLibrary, callbackFn, callbackFn2) => {
    generalTaskArray = callbackFn2(objectLibrary, callbackFn)
    return generalTaskArray
}

// search alghorithm

const setNewContactSelect = (array, id) => {
    let index = array.indexOf(id)
    array.splice(index, 1);
    return array
}

const findDeletedContactSelectPosition = (array, id) => {
    let positionList = []
    for (let index = 0; index < array.length; index++) {
        const task = array[index]
        if (task.contactSelect && task.contactSelect.includes(id)) {
            positionList.push(refreshContactSelectDataStructure(task.id, task.contactSelect, id))
        }
    }
    return positionList
}

const putIterateAllPositionsOfContacts = async (array) => {
    for (let index = 0; index < array.length; index++) {
        await putTaskContactSelectToFireBase(array[index].taskId, array[index].contactSelectNew)
    }
}

const deleteContact = async (id) => {
    const taskLibrary = await getTaskLibraryForFirebaseInit()
    const taskArray = getGeneralTaskArray(taskLibrary, setTaskDataStructure, getPreludeGeneralTaskArray)
    if (taskArray.length == 0) {
        await deleteContactDataFromFireBase("/contact/" + `${id}`)
    } else {
        const positions = findDeletedContactSelectPosition(taskArray, id);
        await putIterateAllPositionsOfContacts(positions)
        await deleteContactDataFromFireBase("/contact/" + `${id}`)
    }
    closeExpandingCards()
    await setLibraryForFirebaseInit();
    getContactsArray();
    renderContactList()
}

const deleteContactOverlayRespFunction = async()=>{
    let id = localStorage.getItem('currentContactIdToEdit')
    await deleteContact(id)
    closeOverlayEditContact()
}
//createcontact
const createContact = async () => {
    let validationResultObject = initValidation(
        setContactInputsValidationArray, getValidationValue, markFalsevalue, allAddContactInputs
    )
    if (validationResultObject.value == true) {
        await uploadAndinitNewContactList(validationResultObject.array)
    }
}

const uploadAndinitNewContactList = async (validationArray) => {
    const response = await postContactDataToFireBase("/contact", setUpContactData(getAllValue, validationArray))
    await initContactPage()
    closeOverlayAddContact()
    const newContactCard = document.getElementById(response.name)
    clicked(newContactCard)
    newContactCard.scrollIntoView({ behavior: 'smooth' })
    setAlertAddContactSuccess()
}

const setAlertAddContactSuccess = () => {
    const alertElement = document.getElementById('AddContactSuccessAlert')
    setTimeout(() => {
        alertElement.classList.add('fade-in-effect-on')
    }, 600);
    setTimeout(() => {
        alertElement.classList.remove('fade-in-effect-on')
        alertElement.classList.add('fade-out-effect-on')
    }, 2550);
    setTimeout(() => {
        alertElement.classList.remove('fade-out-effect-on')
    }, 3000);
}

// edit contact


let savedID = ''
const initEditContact = (id) => {
    savedID = id
    localStorage.setItem('currentContactIdToEdit',id)
    const contactAsJson = contactListJsonLibrary[id];
    setAllEditContactInputs(
        'editContactOverlayFormName', 'editContactOverlayFormPhone', 'editContactOverlayFormEmail',
        'editContactOverlayFormInitial', `${contactAsJson.forename} ${contactAsJson.surname}`, `${contactAsJson.email}`,
        contactAsJson.phone, contactAsJson.badgeColor, contactAsJson.fornameFirstLetter, contactAsJson.surnameFirstLetter
    )
    initOverlayEditContact()
}

const editContact = async () => {
    const contactID = savedID
    let validationResultObject = initValidation(
        setContactInputsValidationArray, getValidationValue, markFalsevalue, allEditContactInputs
    )
    if (validationResultObject.value == true) {
        await uploadAndShowEdit(validationResultObject.array, contactID)
    }
}

const uploadAndShowEdit = async (validationArray, id) => {
    const response = await putContactDataToFireBase("/contact/", `${id}`, setUpContactData(getAllValue, validationArray))
    await initContactPage()
    closeOverlayEditContact()
    const newContactCard = document.getElementById(id)
    clicked(newContactCard)
    newContactCard.scrollIntoView({ behavior: 'smooth' })
}