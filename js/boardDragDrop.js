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
 * Toggles the move-to menu for a task; opens it if closed or for a different task, closes otherwise.
 *
 * @param {Event} event - The click event on the move icon.
 * @param {string} taskId - The task identifier.
 * @param {string} currentState - The task's current column state.
 * @returns {void}
 */
const openMoveMenu = (event, taskId, currentState) => {
    event.stopPropagation();
    const menu = document.getElementById('moveMenu');
    if (!menu.hidden && moveMenuTaskId === taskId) {
        closeMoveMenu();
        return;
    }
    moveMenuTaskId = taskId;
    filterMoveMenuOptions(menu, currentState);
    positionMoveMenu(menu, event.currentTarget);
    menu.hidden = false;
};

/**
 * Shows only the move-menu options that differ from the task's current state.
 *
 * @param {HTMLElement} menu - The move menu element.
 * @param {string} currentState - The task's current column state.
 * @returns {void}
 */
const filterMoveMenuOptions = (menu, currentState) => {
    menu.querySelectorAll('.move-menu-item').forEach(btn => {
        btn.hidden = btn.dataset.state === currentState;
    });
};

/**
 * Positions the move menu directly under the icon that triggered it.
 *
 * @param {HTMLElement} menu - The move menu element.
 * @param {HTMLElement} anchor - The icon element the menu should appear under.
 * @returns {void}
 */
const positionMoveMenu = (menu, anchor) => {
    const rect = anchor.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
};

/**
 * Closes the move-to menu.
 *
 * @returns {void}
 */
const closeMoveMenu = () => {
    const menu = document.getElementById('moveMenu');
    menu.hidden = true;
    moveMenuTaskId = null;
};

/**
 * Moves a task to the selected state and refreshes the board.
 *
 * @param {string} newState - The target column state.
 * @returns {Promise<void>}
 */
const moveTaskTo = async (newState) => {
    if (!moveMenuTaskId) return;
    await putTaskDataToFireBaseOnDrop(moveMenuTaskId, newState);
    closeMoveMenu();
    await initBoardPage();
};

document.addEventListener('click', (event) => {
    const menu = document.getElementById('moveMenu');
    if (!menu.hidden && !menu.contains(event.target) && !event.target.closest('.move-task-btn')) {
        closeMoveMenu();
    }
});

document.querySelectorAll('.move-menu-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveTaskTo(btn.dataset.state);
    });
});

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