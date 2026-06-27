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