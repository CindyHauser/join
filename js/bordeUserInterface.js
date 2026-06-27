const cardDragged = (event) => {
    event.target.classList.add('task-board-card-dragged');
    const cardData = {
        "cardId": event.target.id,
        "cardState": event.target.parentElement.id
    }
    event.dataTransfer.setData("application/json", JSON.stringify(cardData))
}

const cardDropped = (event) => {
    event.preventDefault()
    const parentElement = document.getElementById(event.target.id)
    const preludeStringifyData = event.dataTransfer.getData("application/json")
    const cardData = JSON.parse(preludeStringifyData)
    cardData.cardState = event.target.id
    const draggedCard = document.getElementById(cardData.cardId)
    visualRefreshCardAndDragZone(parentElement, draggedCard)
    renderDragzoneVisual(parentElement,draggedCard)
}



const visualRefreshCardAndDragZone = (zone, card) => {
    zone.classList.remove('drag-zone-entered')
    card.classList.remove('task-board-card-dragged')
}

const renderDragzoneVisual = (zone, card) => {
    if (zone.contains(card)) {
        console.log('already in position');

    } else {
        zone.appendChild(card)
    }
}

const cardDraggedOver = (event) => {
    event.preventDefault()

}

const cardEnteringDragZone = (event) => {
    event.preventDefault()
    event.target.classList.add('drag-zone-entered')
}

const cardLeavingDragZone = (event) => {
    event.preventDefault()
    event.target.classList.remove('drag-zone-entered')
}