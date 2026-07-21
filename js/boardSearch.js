/**
 * Filters tasks based on the current search input value.
 *
 * @param {HTMLElement} element - The input element containing the search term.
 * @returns {void}
 */
const initFindTask = (element) => {
    const value = element.value
    if (value.length >= 3) {
        let array = initFilteringArray(value)
        setNoTaskFoundMessage(array)
        const allcards = getAllArrayGeneralFunction(array)
        renderAllCards(allcards.toDo,allcards.inProgress,allcards.awaitFeedback,allcards.doneTask)
    }
    if (value.length < 3) {
        getGeneralTaskArray(taskListJsonLibrary, setTaskDataStructure, getPreludeGeneralTaskArray)
        setNoTaskFoundMessage(generalTaskArray)
        getAllArray()
        renderAllCards(toDoTaskArray, inProgressTaskArray, awaitFeedbackTaskArray, doneTaskArray)
    }
}

/**
 * show the no task found message if the keywords dont match to the task
 *
 * @param {array} array - The array containing the matched task
 * @returns {void}
 */

const setNoTaskFoundMessage = (array) => {
    const element = document.getElementById('noTaskFoundMessage')
    if (array.length == 0) {
        element.classList.add('no-task-found-message-showed')
    } else {
        element.classList.remove('no-task-found-message-showed')
    }
}


/**
 * Builds a filtered task list from the global task array using the current search string.
 *
 * @param {string} string - The search term entered by the user.
 * @returns {Array<Object>} The filtered task list.
 */
const initFilteringArray = (string) => {
    const array = generalTaskArray
    return array.filter(
        (arrayMember) => {
            const title = arrayMember.title || 'no title'
            const description = arrayMember.description || 'no description'
            return title.toLowerCase().includes(string.toLowerCase()) || description.toLowerCase().includes(string.toLowerCase())   ;
        }
    )
}


/**
 * Capitalizes the first character of a search string for case-insensitive matching.
 *
 * @param {string} string - The raw search string.
 * @returns {string} The same string with its first character capitalized.
 */
const setStringToMatchTheFilter = (string) => {
    if (!string || string.length === 0) return string
    let stringAsArray = string.split('')
    stringAsArray[0] = stringAsArray[0].toUpperCase()
    return stringAsArray.join('')
}