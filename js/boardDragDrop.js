/**
 * Marks a dragged task card as active and stores its drag metadata.
 *
 * @param {DragEvent} event - The drag event triggered by dragging a task card.
 * @returns {void}
 */
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

/**
 * Removes the visual drag state from the currently dragged task card and drag zones.
 *
 * @param {DragEvent} event - The drag end event.
 * @returns {void}
 */
const cardDragEnd = (event) => {
    const card = event.currentTarget || event.target.closest('.task-board-card')
    if (card) {
        card.classList.remove('task-board-card-dragged')
    }
    document.querySelectorAll('.drag-zone-entered').forEach((zone) => {
        zone.classList.remove('drag-zone-entered')
    })
}

/**
 * Handles the drop action for a task card and updates the task state in the backend.
 *
 * @param {DragEvent} event - The drop event.
 * @returns {Promise<void>}
 */
const cardDropped = async (event) => {
    event.preventDefault()
    const element = event.target.closest('.progress-tasks')
    const dropZone = element.querySelector('.drag-and-drop-tasks')
    const preludeStringifyData = event.dataTransfer.getData("application/json")
    const cardData = JSON.parse(preludeStringifyData)
    const draggedCard = document.querySelector('.task-board-card-dragged')
    if (draggedCard) {
        draggedCard.classList.remove('task-board-card-dragged')
    }
    cardData.cardState = element.id
    await putTaskDataToFireBaseOnDrop(cardData.cardId, cardData.cardState)
    await initBoardPage()
    visualRefreshCardAndDragZone(dropZone)
}

/**
 * Removes the drag-zone highlight from the provided container.
 *
 * @param {HTMLElement} zone - The drag-and-drop zone to update.
 * @returns {void}
 */
const visualRefreshCardAndDragZone = (zone) => {
    zone.classList.remove('drag-zone-entered')
}

/**
 * Re-renders the dragged card inside the target drop zone.
 *
 * @param {HTMLElement} zone - The current drop zone.
 * @param {HTMLElement} card - The task card element being moved.
 * @returns {void}
 */
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

/**
 * Applies the drag-over visual state to a drop zone.
 *
 * @param {DragEvent} event - The drag-over event.
 * @returns {void}
 */
const cardDraggedOver = (event) => {
    event.preventDefault()
    const element = event.target.closest('.progress-tasks')
    const dropZone = element.querySelector('.drag-and-drop-tasks')
    dropZone.classList.add('drag-zone-entered')
}

/**
 * Applies the drag-enter visual state to a drop zone.
 *
 * @param {DragEvent} event - The drag-enter event.
 * @returns {void}
 */
const cardEnteringDragZone = (event) => {
    event.preventDefault()
    const element = event.target.closest('.progress-tasks')
    const dropZone = element.querySelector('.drag-and-drop-tasks')
    dropZone.classList.add('drag-zone-entered')
}

/**
 * Removes the drag-enter visual state when leaving a drop zone.
 *
 * @param {DragEvent} event - The drag-leave event.
 * @returns {void}
 */
const cardLeavingDragZone = (event) => {
    event.preventDefault()
    const element = event.target.closest('.progress-tasks')
    const dropZone = element.querySelector('.drag-and-drop-tasks')
    dropZone.classList.remove('drag-zone-entered')
}