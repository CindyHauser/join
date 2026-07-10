const renderCards = (array,id) => {
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

const renderAllCards = (todoArray, inProgressArray, awaitFeedbackArray, doneTaskArray) => {
    renderCards(todoArray,'toDo')
    renderCards(inProgressArray,'inProgress')
    renderCards(awaitFeedbackArray,'awaitFeedBack')
    renderCards(doneTaskArray,'done')
}

const getAllArray = () => {
    getToDoArray()
    getInProgressArray()
    getAwaitFeedbackArray()
    getDoneTaskArray()
}