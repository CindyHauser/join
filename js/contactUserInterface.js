const overlayAdd = document.getElementById('contactAddOverlay')
const allAddContactInputs = overlayAdd.querySelectorAll('input')
const overlayEdit = document.getElementById('contactEditOverlay')
const allEditContactInputs = overlayEdit.querySelectorAll('input')


// general ui
const clicked = (element) => {
    const container = element
    const expandedContactField = document.getElementById('contactCardExpandedRenderTarget')
    refreshmarksOnContactCards()
    container.classList.add('contact-member-selected')
    expandedContactField.innerHTML = setExpandedContactcardsTemplate(element.id, contactListJsonLibrary)
    addEnteranceEffect(expandedContactField, 450)
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
        resetAllErrorMarks(resetAllErrorMarksCallBack)
    }, transitionTime + 100)
}

const initOverlayAddContact = () => {
    const overlayAddContact = document.getElementById('contactAddOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    overlayAddContact.classList.add('contact-overlay-activated')
    addEnteranceEffect(OverlayInnerContainer, 450)
}

const initOverlayEditContact = () => {
    const overlayAddContact = document.getElementById('contactEditOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    overlayAddContact.classList.add('contact-overlay-activated')
    addEnteranceEffect(OverlayInnerContainer, 450)
}

const closeOverlayAddContact = () => {
    const overlayAddContact = document.getElementById('contactAddOverlay')
    const OverlayInnerContainer = overlayAddContact.querySelector('.contact-overlay-inner-container')
    addOverlayContactEXitEffect(OverlayInnerContainer, overlayAddContact, 450)
    resetAllContactInput()
}

const closeOverlayEditContact = () => {
    const overlayEditContact = document.getElementById('contactEditOverlay')
    const OverlayInnerContainer = overlayEditContact.querySelector('.contact-overlay-inner-container')
    addOverlayContactEXitEffect(OverlayInnerContainer, overlayEditContact, 450)
    resetAllEditContactInput()
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

const refreshContactSelectDataStructure = (taskId, contactSelectArray,contactId) => {
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
        if (task.contactSelect == undefined) {
            positionList = []
        } else if (task.contactSelect.includes(id)) {
            positionList.push(refreshContactSelectDataStructure(task.id, task.contactSelect,id))
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
    console.log(taskArray,id);
    
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