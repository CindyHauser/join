/**
 * Prevents the default behavior of a DOM event.
 * Most commonly used to stop the browser from reloading the page when a form is submitted,
 * allowing for custom JavaScript handling instead.
 *
 * @param {Event} event - The DOM event object triggered by the user's action (e.g., a submit event).
 */
const setSubmitPreventDefault = (event) => {
    event.preventDefault()
}

/**
 * Initializes event listeners for all forms on the document.
 * Iterates through every `<form>` element currently in the DOM and attaches the 
 * `setSubmitPreventDefault` function to the 'submit' event. This ensures that 
 * no form submission triggers a disruptive page reload.
 */
const forms = document.querySelectorAll('form')
forms.forEach(
    (form) => {
        form.addEventListener('submit', setSubmitPreventDefault)
    }
)

/**
 * Prevents an event from bubbling up the DOM tree.
 * Stops parent event handlers from being triggered by the current event.
 * Highly useful for overlays or modals to ensure clicking inside them doesn't trigger 
 * a "close overlay" event attached to a background container.
 *
 * @param {Event} event - The DOM event object triggered by the user's action.
 */
const setEventBubbling = (event) => {
    event.stopPropagation()
}


/**
 * Asynchronously fetches the entire task library from the Firebase Realtime Database.
 * It accesses the "/task.json" endpoint and parses the response.
 *
 * @returns {Promise<Object>} A promise that resolves to a JSON object containing all task records.
 */
const getTaskLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/task" + ".json")
    return response.json()
}

/**
 * Asynchronously updates the selected contacts array for a specific task in the Firebase Realtime Database.
 * Uses a PUT request to overwrite the existing "contactSelect" data for the given task ID.
 *
 * @param {string|number} id - The unique identifier of the task being updated.
 * @param {Array} [array=[]] - An array of contact IDs to be saved. Defaults to an empty array if not provided.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from Firebase after the update.
 */
const putTaskContactSelectToFireBase = async (id, array = []) => {
    const response = await fetch(BASE_URL + "/task/" + `${id}/` + "contactSelect" + ".json", putMethode(array))
    return await response.json()
}

/**
 * Extracts specific task data from a larger collection object and maps it into a simplified structure.
 * Isolates the task ID and its associated selected contacts for easier processing.
 *
 * @param {string|number} key - The unique identifier for the specific task within the source object.
 * @param {Object.<string, Object>} object - The source dictionary object containing all task records.
 * @returns {Object} A structured object containing only the isolated task data.
 * @returns {string|number} return.id - The unique task identifier mapped from the key.
 * @returns {Array} return.contactSelect - The array of selected contact IDs associated with the task.
 */
const setTaskDataStructure = (key, object) => {
    return {
        "id": key,
        "contactSelect": object[key].contactSelect,
    }
}

/**
 * Constructs an updated data structure for a task's assigned contacts.
 * Utilizes a helper function to modify the existing contact array (e.g., removing a deleted contact) 
 * and returns an object containing the task ID and the newly updated array.
 *
 * @param {string|number} taskId - The unique identifier of the task.
 * @param {Array} contactSelectArray - The current array of assigned contact IDs.
 * @param {string|number} contactId - The specific contact ID to be modified or removed from the array.
 * @returns {Object} A structured object containing the updated task contact data.
 * @returns {string|number} return.taskId - The ID of the task.
 * @returns {Array} return.contactSelectNew - The newly updated array of contact IDs.
 */
const refreshContactSelectDataStructure = (taskId, contactSelectArray, contactId) => {
    return {
        "taskId": taskId,
        "contactSelectNew": setNewContactSelect(contactSelectArray, contactId),
    }
}

/**
 * Iterates through an object library to generate an array of formatted data structures.
 * Filters out the "position" key and processes all other valid entries using the provided callback function.
 *
 * @param {Object.<string, Object>} objectLibrary - The source dictionary object containing the data entries.
 * @param {Function} callbackFn - A callback function executed on each valid key to format and extract the data.
 * @returns {Array} An array of processed and formatted data objects.
 */
const getPreludeGeneralTaskArray = (objectLibrary, callbackFn) => {
    let preludeGeneralTaskArray = []
    for (key in objectLibrary) {
        if (key != "position") {
            preludeGeneralTaskArray.push(callbackFn(key, objectLibrary))
        }
    }
    return preludeGeneralTaskArray
}

/**
 * Executes a higher-order callback function to process an object library into an array.
 * Acts as a wrapper that passes the data library and a mapping callback down to the execution callback.
 *
 * @param {Object.<string, Object>} objectLibrary - The source dictionary object containing the data.
 * @param {Function} callbackFn - The primary callback function used for formatting individual entries.
 * @param {Function} callbackFn2 - The execution callback function (e.g., getPreludeGeneralTaskArray) that handles the iteration.
 * @returns {Array} The final processed array generated by the secondary callback.
 */
const getGeneralTaskArray = (objectLibrary, callbackFn, callbackFn2) => {
    generalTaskArray = callbackFn2(objectLibrary, callbackFn)
    return generalTaskArray
}

/**
 * Removes a specific contact ID from an array of selected contacts.
 * Locates the index of the provided ID and mutates the original array by splicing out that specific element.
 *
 * @param {Array} array - The array containing the currently selected contact IDs.
 * @param {string|number} id - The specific contact ID to be removed from the array.
 * @returns {Array} The modified array with the specified ID removed.
 */
const setNewContactSelect = (array, id) => {
    let index = array.indexOf(id)
    array.splice(index, 1);
    return array
}

/**
 * Scans an array of tasks to identify which tasks contain a specific contact ID.
 * If a task includes the target ID in its selected contacts array, it generates an updated 
 * task structure (with the contact removed) and adds it to a result list.
 *
 * @param {Array<Object>} array - The array of task objects to be evaluated.
 * @param {string|number} id - The ID of the contact being deleted or searched for.
 * @returns {Array<Object>} A list of updated task data structures for all affected tasks.
 */
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

/**
 * Initiates the creation of a new contact.
 * Triggers the form validation logic. If all inputs are valid, it proceeds to 
 * upload the new contact data to the server and refreshes the UI.
 *
 * @returns {Promise<void>} A promise that resolves when the validation and (if successful) the upload process are complete.
 */
const createContact = async () => {
    let validationResultObject = initValidation(
        setContactInputsValidationArray, getValidationValue, markFalsevalue, allAddContactInputs
    )
    if (validationResultObject.value == true) {
        await uploadAndinitNewContactList(validationResultObject.array)
    }
}

/**
 * Uploads a newly created contact to the Firebase database and updates the user interface.
 * After a successful upload, it refreshes the contact page, closes the add contact overlay,
 * highlights and scrolls to the newly created contact card, and displays a success alert.
 *
 * @param {Array} validationArray - An array of validated input data to be formatted and saved.
 * @returns {Promise<void>} A promise that resolves when the upload and all UI updates are complete.
 */
const uploadAndinitNewContactList = async (validationArray) => {
    const response = await postContactDataToFireBase("/contact", setUpContactData(getAllValue, validationArray))
    await initContactPage()
    closeOverlayAddContact()
    const newContactCard = document.getElementById(response.name)
    clicked(newContactCard)
    newContactCard.scrollIntoView({ behavior: 'smooth' })
    setAlertAddContactSuccess()
}

/**
 * Initiates the process of editing an existing contact.
 * Retrieves the currently selected contact ID, triggers the validation logic for the edit form inputs,
 * and if valid, proceeds to upload the changes and refresh the UI.
 *
 * @returns {Promise<void>} A promise that resolves when the validation and (if successful) the update process are complete.
 */
const editContact = async () => {
    const contactID = savedID
    let validationResultObject = initValidation(
        setContactInputsValidationArray, getValidationValue, markFalsevalue, allEditContactInputs
    )
    if (validationResultObject.value == true) {
        await uploadAndShowEdit(validationResultObject.array, contactID)
    }
}

/**
 * Uploads the edited contact data to the Firebase database and updates the user interface.
 * After a successful update, it refreshes the contact list, closes the edit overlay, 
 * selects the newly updated contact card, and smoothly scrolls it into view.
 *
 * @param {Array} validationArray - An array of validated input data to be formatted and saved.
 * @param {string|number} id - The unique identifier of the contact being edited.
 * @returns {Promise<void>} A promise that resolves when the database update and all UI transitions are complete.
 */
const uploadAndShowEdit = async (validationArray, id) => {
    const response = await putContactDataToFireBase("/contact/", `${id}`, setUpContactData(getAllValue, validationArray))
    await initContactPage()
    closeOverlayEditContact()
    const newContactCard = document.getElementById(id)
    clicked(newContactCard)
    newContactCard.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Iterates through an array of task updates and sequentially pushes the new data to the Firebase database.
 * Typically used to update multiple tasks at once, such as removing a deleted contact from 
 * all tasks they were previously assigned to.
 *
 * @param {Array<Object>} array - An array of objects, each containing a `taskId` and an updated `contactSelectNew` array.
 * @returns {Promise<void>} A promise that resolves when all individual database update requests have finished executing.
 */
const putIterateAllPositionsOfContacts = async (array) => {
    for (let index = 0; index < array.length; index++) {
        await putTaskContactSelectToFireBase(array[index].taskId, array[index].contactSelectNew)
    }
}

/**
 * Deletes a contact from the database and safely removes their assignments from all tasks.
 * It fetches the current tasks, finds any that include the target contact, updates those tasks 
 * to remove the contact, and then finally deletes the contact record itself. Afterwards, 
 * it triggers a full UI and local state refresh.
 *
 * @param {string|number} id - The unique identifier of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves when the database cleanup, deletion, and UI re-rendering are complete.
 */
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

/**
 * Handles the deletion of a contact triggered from the responsive edit overlay.
 * Retrieves the currently active contact ID from local storage, executes the full 
 * contact deletion process, and closes the edit overlay upon completion.
 *
 * @returns {Promise<void>} A promise that resolves when the contact is deleted and the overlay is closed.
 */
const deleteContactOverlayRespFunction = async () => {
    let id = localStorage.getItem('currentContactIdToEdit')
    await deleteContact(id)
    closeOverlayEditContact()
}