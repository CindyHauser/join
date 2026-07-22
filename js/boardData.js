let taskListJsonLibrary = ''
let contactListJsonLibrary = ''
const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"
let generalTaskArray = []
let toDoTaskArray = []
let inProgressTaskArray = []
let awaitFeedbackTaskArray = []
let doneTaskArray = []

/**
 * Creates a fetch configuration object for a POST request.
 *
 * @param {Object} data - The payload to send to the backend.
 * @returns {Object} A fetch options object with JSON headers and body.
 */
const postMethode = (data) => {
    const methode = {
        method: "POST",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    return methode
}

/**
 * Creates a fetch configuration object for a DELETE request.
 *
 * @returns {Object} A fetch options object for deletion.
 */
const deleteMethode = () => {
    const methode = {
        method: "DELETE"
    }
    return methode
}

/**
 * Creates a fetch configuration object for a PUT request.
 *
 * @param {Object} data - The payload to store in the backend.
 * @returns {Object} A fetch options object with JSON headers and body.
 */
const putMethode = (data) => {
    const methode = {
        method: "PUT",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    return methode
}

/**
 * Fetches the contact library from Firebase.
 *
 * @returns {Promise<Object>} A promise resolving to the contact data.
 */
const getContactLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/contact" + ".json")
    return response.json()
}

/**
 * Stores the fetched contact library in the global contact data variable.
 *
 * @returns {Promise<void>}
 */
const setContactLibraryForFirebaseInit = async () => {
    contactListJsonLibrary = await getContactLibraryForFirebaseInit()
    return
}

/**
 * Fetches the task library from Firebase.
 *
 * @returns {Promise<Object>} A promise resolving to the task data.
 */
const getTaskLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/task" + ".json")
    return response.json()
}

/**
 * Stores the fetched task library in the global task data variable.
 *
 * @returns {Promise<void>}
 */
const setTaskLibraryForFirebaseInit = async () => {
    taskListJsonLibrary = await getTaskLibraryForFirebaseInit()
    return
}

/**
 * Sends a new task to the Firebase backend.
 *
 * @param {Object} [data={}] - The task object to create.
 * @returns {Promise<Object>} A promise resolving to the server response.
 */
const postTaskDataToFireBase = async (data = {}) => {
    const response = await fetch(BASE_URL + "/task" + ".json", postMethode(data))
    return await response.json()
}

/**
 * Updates an existing task in the Firebase backend.
 *
 * @param {string} id - The task identifier.
 * @param {Object} [data={}] - The task data to overwrite.
 * @returns {Promise<Object>} A promise resolving to the server response.
 */
const putTaskDataToFireBase = async (id, data = {}) => {
    const response = await fetch(BASE_URL + "/task/" + `${id}` + ".json", putMethode(data))
    return await response.json()
}

/**
 * Updates only the state of an existing task after dropping it on a board column.
 *
 * @param {string} id - The task identifier.
 * @param {string} data - The new task state.
 * @returns {Promise<Object>} A promise resolving to the server response.
 */
const putTaskDataToFireBaseOnDrop = async (id, data) => {
    const response = await fetch(BASE_URL + "/task/" + `${id}` + "/state/" + ".json", putMethode(data))
    return await response.json()
}

/**
 * Deletes a task from the Firebase backend.
 *
 * @param {string} id - The task identifier.
 * @param {Object} [data={}] - Optional payload kept for compatibility.
 * @returns {Promise<Object>} A promise resolving to the server response.
 */
const deleteTaskDataFromFireBase = async (id, data = {}) => {
    const response = await fetch(BASE_URL + "/task/" + `${id}` + ".json", deleteMethode())
    return await response.json()
}