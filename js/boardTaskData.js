/**
 * Normalizes a task object from the raw data structure for further rendering.
 *
 * @param {string} key - The unique task identifier.
 * @param {Object} object - The source object containing all task entries.
 * @returns {Object} A normalized task object with the expected rendering fields.
 */
const setTaskDataStructure = (key, object) => {
    const allSubtasks = object[key].subtasks
    const subtasksArray = reconstructSubTaskArray(allSubtasks)
    return {
        "id": key,
        "title": object[key].title,
        "category": object[key].category,
        "contactSelect": object[key].contactSelect,
        "date": object[key].date,
        "description": object[key].description,
        "priority": object[key].priority,
        "state": object[key].state,
        "subtasks": subtasksArray
    }
}

/**
 * Rebuilds a subtask array into a simplified structure that can be rendered in the UI.
 *
 * @param {Array<Object|String>} [array] - The raw subtask list from the task data.
 * @returns {Array<Object>} A normalized array of subtask objects.
 */
const reconstructSubTaskArray = (array) => {
    let reconstructedArray = []
    if (array == undefined) {
        return []
    }
    for (let index = 0; index < array.length; index++) {
        const subtasksObject = {
            "taskDescription": array[index].taskDescription,
            "subtaskStateDone": array[index].subtaskStateDone
        }
        reconstructedArray.push(subtasksObject)
    }
    return reconstructedArray
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
}

/**
 * Converts a human-readable string into a CSS-friendly class name.
 *
 * @param {string} string - The input string to transform.
 * @returns {string} A normalized class name or an empty string if the input is invalid.
 */
const convertStringToClass = (string) => {
    if (!string || typeof string !== 'string') {
        return ''
    }
    return string
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
}