let contactListJsonLibrary = ''
const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"
let contactsArray = []

/**
 * Creates the configuration object for a POST fetch request.
 * 
 * @param {Object} data - The payload data to be sent as a JSON string in the body.
 * @returns {Object} The complete fetch options object (method, headers, and body).
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
 * Creates the configuration object for a DELETE fetch request.
 * 
 * @param {Object} [data] - Optional payload data (currently unused in the configuration).
 * @returns {Object} The fetch options object specifying the DELETE method.
 */
const deleteMethode = (data) => {
    const methode = {
        method: "DELETE"
    }
    return methode
}

/**
 * Creates the configuration object for a PUT fetch request.
 * 
 * @param {Object} data - The payload data to be updated and sent as a JSON string in the body.
 * @returns {Object} The complete fetch options object (method, headers, and body).
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
 * Fetches the initialization or contact data from the Firebase database.
 * 
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 */
const getLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/contact" + ".json")
    return response.json()
}

/**
 * Initializes the contact list library by fetching data from Firebase.
 * Updates the higher-scoped `contactListJsonLibrary` variable.
 * 
 * @returns {Promise<void>} A promise that resolves when the data has been fetched and assigned.
 */
const setLibraryForFirebaseInit = async () => {
    contactListJsonLibrary = await getLibraryForFirebaseInit()
    return
}

/**
 * Sends a POST request to Firebase to save contact data at the specified path.
 * 
 * @param {string} path - The specific database path (appended to BASE_URL).
 * @param {Object} [data={}] - The payload data to be posted (defaults to an empty object).
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON response from Firebase.
 */
const postContactDataToFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json", postMethode(data))
    return await response.json()
}

/**
 * Sends a PUT request to Firebase to update existing contact data at the specified path and ID.
 * 
 * @param {string} path - The base database path.
 * @param {string} id - The unique identifier for the specific entry to update.
 * @param {Object} [data={}] - The updated payload data (defaults to an empty object).
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON response from Firebase.
 */
const putContactDataToFireBase = async (path,id, data = {}) => {
    const response = await fetch(BASE_URL + path +id+ ".json", putMethode(data))
    return await response.json()
}

/**
 * Sends a DELETE request to Firebase to remove data at the specified path.
 * 
 * @param {string} path - The specific database path (appended to BASE_URL) of the entry to delete.
 * @param {Object} [data={}] - Optional payload data (passed to the configuration, though typically unused for DELETE).
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON response from Firebase.
 */
const deleteContactDataFromFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json", deleteMethode(data))
    return await response.json()
}

/**
 * Converts a raw contact object into an array of structured contact objects,
 * filtering out the "position" key, and sorts the array alphabetically by forename.
 * 
 * @param {Object} object - The raw contact data object retrieved from the database.
 * @returns {Array<Object>} An array of formatted contact objects sorted by forename.
 */
const getPreldudeContactArray = (object) => {
    let preludeContactArray = []
    for (let key in object) {
        if (key != "position") {
            preludeContactArray.push(setPreludeContactArrayStructure(key, object))
        }
    }
    return preludeContactArray.sort(
        (a, b) => a.forename.localeCompare(b.forename)
    )
}

/**
 * Processes the preliminary contact array to insert alphabetical section headers 
 * whenever the first letter of the forename changes, creating a structured list for UI rendering.
 * 
 * @returns {Array<Object|string>} An array containing both section header strings and structured contact objects.
 */
const getContactsArray = () => {
    contactsArray = []
    let fornameFirstLetter = ''
    const preludeArray = getPreldudeContactArray(contactListJsonLibrary)
    for (let index = 0; index < preludeArray.length; index++) {
        if (preludeArray[index].fornameFirstLetter.toLowerCase() != fornameFirstLetter.toLowerCase()) {
            contactsArray.push(preludeArray[index].fornameFirstLetter)
            fornameFirstLetter = preludeArray[index].fornameFirstLetter
        }
        contactsArray.push(preludeArray[index])
    }
    return contactsArray
}


