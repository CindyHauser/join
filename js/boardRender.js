/**
 * Renders all task cards for a specific board column.
 *
 * @param {Array<Object>} array - The task list for the current column.
 * @param {string} id - The HTML id of the column container.
 * @returns {void}
 */
const renderCards = (array, id) => {
    let cardListHtml = ''
    const mainElement = document.getElementById(id)
    const renderZone = mainElement.querySelector('.drag-and-drop-tasks')
    renderZone.innerHTML = ''
    for (let index = 0; index < array.length; index++) {
        cardListHtml += setContactCard(catchZeroSubtaskForBar, catchZeroSubtaskForLabel, catchZeroContact, array, index)
    }
    if (cardListHtml === '') {
        cardListHtml = `<div class="noTask-Container"><p>No Task ${id === 'toDo' ? 'To do' : id === 'inProgress' ? 'In Progress' : id === 'awaitFeedBack' ? 'in Await Feedback' : 'in Done'}</p></div>`
    }
    renderZone.innerHTML = cardListHtml
}

/**
 * Renders all task cards for the complete board.
 *
 * @param {Array<Object>} todoArray - The tasks in the To Do column.
 * @param {Array<Object>} inProgressArray - The tasks in the In Progress column.
 * @param {Array<Object>} awaitFeedbackArray - The tasks in the Await Feedback column.
 * @param {Array<Object>} doneTaskArray - The tasks in the Done column.
 * @returns {void}
 */
const renderAllCards = (todoArray, inProgressArray, awaitFeedbackArray, doneTaskArray) => {
    renderCards(todoArray, 'toDo')
    renderCards(inProgressArray, 'inProgress')
    renderCards(awaitFeedbackArray, 'awaitFeedBack')
    renderCards(doneTaskArray, 'done')
}

/**
 * Fetches all task arrays for the board from their respective data sources.
 *
 * @returns {void}
 */
const getAllArray = () => {
    const allTasks = getAllArrayGeneralFunction(generalTaskArray)
    toDoTaskArray = allTasks.toDo
    inProgressTaskArray = allTasks.inProgress
    awaitFeedbackTaskArray = allTasks.awaitFeedback
    doneTaskArray = allTasks.doneTask
}

/**
 * Filters an array of objects based on a provided state.
 * 
 * @param {Array<Object>} generalArray - The main array containing all objects (e.g., all tasks).
 * @param {string} state - The state to filter by (e.g., "todo", "in progress").
 * @returns {Array<Object>} A new array containing exclusively the objects that match the specified state.
 */

const getStateDependentArray = (generalArray, state) => {
    let preludeArray = []
    for (let index = 0; index < generalArray.length; index++) {
        if (generalArray[index].state === state) {
            preludeArray.push(generalArray[index])
        }
    }
    return preludeArray
}

/**
 * Categorizes an array of task objects into a structured object based on their status.
 * 
 * @param {Array<Object>} generalArray - The main array containing all task objects.
 * @returns {Object} An object containing separated arrays for each task state ("toDo", "inProgress", "awaitFeedback", "doneTask").
 */
const getAllArrayGeneralFunction = (generalArray) => {
    return {
        "toDo": getStateDependentArray(generalArray, 'toDo'),
        "inProgress": getStateDependentArray(generalArray, 'inProgress'),
        "awaitFeedback": getStateDependentArray(generalArray, 'awaitFeedBack'),
        "doneTask": getStateDependentArray(generalArray, 'done')
    }
}

