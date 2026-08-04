let moveMenuTaskId = null;

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
    event.dataTransfer.setData("text/plain", JSON.stringify(cardData))
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
    const preludeStringifyData = event.dataTransfer.getData("text/plain")
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



/**
 * Opens the move menu for a specific task and triggers the slide-in animation.
 * Stops the event from bubbling up to prevent unintended clicks on parent elements.
 *
 * @param {Event} event - The DOM event triggered by the user interaction (e.g., click).
 * @param {string|number} taskId - The unique identifier of the task to locate its specific menu.
 */
const openMoveMenu = (event, taskId) => {
    event.stopPropagation();
    const moveDownMenu = document.getElementById(`moveMenu${taskId}`)
    const moveDownMenuParent = moveDownMenu.closest('.progress-tasks')
    moveDownMenuParent.classList.add('drag-zone-entered')
    moveDownMenu.classList.add('move-menu-slide-in-resp-board-functions-effect-on')
};

/**
 * Closes the move menu for a specific task and triggers the slide-out animation.
 * Cleans up the animation classes after a short delay (150ms) to allow the transition to finish.
 *
 * @param {string|number} taskId - The unique identifier of the task to locate its specific menu.
 */
const closeMoveMenu = (taskId) => {
    const moveDownMenu = document.getElementById(`moveMenu${taskId}`)
    const moveDownMenuParent = moveDownMenu.closest('.progress-tasks')
    moveDownMenuParent.classList.remove('drag-zone-entered')
    moveDownMenu.classList.replace('move-menu-slide-in-resp-board-functions-effect-on', 'move-menu-slide-in-resp-board-functions-effect-off')
    setTimeout(() => {
        moveDownMenu.classList.remove('move-menu-slide-in-resp-board-functions-effect-off')
    }, 150);
}

/**
 * Prevents further propagation of the current event in the capturing and bubbling phases.
 * Useful to stop parent elements from triggering their own event listeners (e.g., when clicking a button inside a clickable container).
 *
 * @param {Event} event - The DOM event triggered by the user interaction.
 */
const stopEventPropagation = (event) => {
    event.stopPropagation();
}

/**
 * Asynchronously moves a task to a new state (column), updates the database, and refreshes the UI.
 * Saves the task ID to local storage and scrolls the newly moved task into view after the board reloads.
 *
 * @param {HTMLElement} element - The DOM element that was clicked, containing the target state in its dataset (e.g., data-state="todo").
 * @param {string|number} taskId - The unique identifier of the task being moved.
 */
const moveTaskTo = async (element, taskId) => {
    localStorage.setItem('movedTask', `${taskId}`)
    await putTaskDataToFireBaseOnDrop(`${taskId}`, element.dataset.state);
    closeMoveMenu(`${taskId}`);
    await initBoardPage();
    scrollToMovedTask(taskId)
};

/**
 * Smoothly scrolls the viewport so that the specified task is centered on the screen.
 * Also retrieves the task's parent container and triggers subsequent time-based visual effects (e.g., highlighting).
 *
 * @param {string|number} taskId - The unique identifier of the task to scroll into view.
 */
const scrollToMovedTask = (taskId) => {
    const movedTask = document.getElementById(`${taskId}`)
    const movedTaskParent = movedTask.closest('.progress-tasks')
    movedTask.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    scrollToMovedTaskTimeFunctions(movedTask, movedTaskParent) 
}

/**
 * Applies temporary visual highlight effects to a recently moved task and its new parent container.
 * Automatically removes the highlight classes after 750ms and cleans up the local storage after 1000ms.
 *
 * @param {HTMLElement} movedTask - The DOM element of the task that was moved.
 * @param {HTMLElement} movedTaskParent - The DOM element of the task's new parent column.
 */
const scrollToMovedTaskTimeFunctions = (movedTask, movedTaskParent) => {
    movedTask.classList.add('task-board-card-dragged')
    movedTaskParent.classList.add('drag-zone-entered')
    setTimeout(() => {
        movedTaskParent.classList.remove('drag-zone-entered')
        movedTask.classList.remove('task-board-card-dragged')
    }, 750);
    setTimeout(() => {
        localStorage.removeItem('movedTask')
    }, 1000);
}

/**
 * Enables native drag on cards above 768px, disables it below.
 *
 * @returns {void}
 */
const updateCardDraggability = () => {
    const isMobile = window.innerWidth < 768;
    document.querySelectorAll('.task-board-card').forEach(card => {
        card.draggable = !isMobile;
    });
};
window.addEventListener('resize', updateCardDraggability);
