const cardDragged = (event) => {
    const element = event.target.closest('.progress-tasks')
    const card = event.target
    card.classList.add('task-board-card-dragged');
    element.querySelector('.drag-and-drop-tasks').classList.add('drag-zone-entered')
    const cardData = {
        "cardId": card.id,
        "cardState": element.id
    }
    event.dataTransfer.setData("application/json", JSON.stringify(cardData))
}

const cardDropped = async (event) => {
    event.preventDefault()
    const element = event.target.closest('.progress-tasks')
    const dropZone = element.querySelector('.drag-and-drop-tasks')
    const preludeStringifyData = event.dataTransfer.getData("application/json")
    const cardData = JSON.parse(preludeStringifyData)
    cardData.cardState = element.id
    await putTaskDataToFireBaseOnDrop(cardData.cardId, cardData.cardState)
    await initBoardPage()
    visualRefreshCardAndDragZone(dropZone)
}



const visualRefreshCardAndDragZone = (zone) => {
    zone.classList.remove('drag-zone-entered')
}

const renderDragzoneVisual = (zone, card) => {
    if (zone.contains(card)) {
        visualRefreshCardAndDragZone(zone, card)
    } else {
        if (zone) {
            zone.appendChild(card)
            visualRefreshCardAndDragZone(zone, card)
        } else
            return
    }
}

const cardDraggedOver = (event) => {
    event.preventDefault()
    const element = event.target.closest('.progress-tasks')
    const dropZone = element.querySelector('.drag-and-drop-tasks')
    dropZone.classList.add('drag-zone-entered')

}

const cardEnteringDragZone = (event) => {
    event.preventDefault()
    const element = event.target.closest('.progress-tasks')
    const dropZone = element.querySelector('.drag-and-drop-tasks')
    dropZone.classList.add('drag-zone-entered')
}

const cardLeavingDragZone = (event) => {
    event.preventDefault()
    const element = event.target.closest('.progress-tasks')
    const dropZone = element.querySelector('.drag-and-drop-tasks')
    dropZone.classList.remove('drag-zone-entered')
}

const initFindTask = (element) => {
    const value = element.value
    if (value.length >= 5) {
        generalTaskArray = initFilteringArray(value)
        getAllArray()
        renderAllCards(toDoTaskArray, inProgressTaskArray, awaitFeedbackTaskArray, doneTaskArray)
    }
    if (value.length < 4) {
        getGeneralTaskArray(taskListJsonLibrary, setTaskDataStructure, getPreludeGeneralTaskArray)
        getAllArray()
        renderAllCards(toDoTaskArray, inProgressTaskArray, awaitFeedbackTaskArray, doneTaskArray)
    }
}

const initFilteringArray = (string) => {
    let filteredArray = []
    for (let index = 0; index < generalTaskArray.length; index++) {
        if (checkDesctiptionValue(string, generalTaskArray, index)) {
            filteredArray.push(generalTaskArray[index])
        } else if (checkTitleValue(string, generalTaskArray, index)) {
            filteredArray.push(generalTaskArray[index])
        }
    }
    return filteredArray
}

const setStringToMatchTheFilter = (string) => {
    let stringAsArray = string.split('')
    stringAsArray[0] = stringAsArray[0].toUpperCase()
    stringAsArray = stringAsArray.join('')
    return stringAsArray
}

const checkDesctiptionValue = (string, generalTaskArray, index) => {
    if (generalTaskArray[index].description.includes(string) ||
        generalTaskArray[index].description.includes(setStringToMatchTheFilter(string))) {
        return true
    } else {
        return false
    }
}

const checkTitleValue = (string, generalTaskArray, index) => {
    if (generalTaskArray[index].title.includes(string) ||
        generalTaskArray[index].title.includes(setStringToMatchTheFilter(string))) {
        return true
    } else {
        return false
    }
}