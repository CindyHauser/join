/**
 * Generates the HTML string for a subtask progress indicator.
 * Calculates the width of the progress bar based on the ratio of finished subtasks 
 * to total subtasks, and includes a text label for the current progress.
 * 
 * @param {Array} finishedSubtask - An array containing the completed subtasks.
 * @param {Array} subtasks - An array containing all subtasks for the current task.
 * @returns {string} The HTML string representing the progress bar and its label.
 */
const setCatchZeroSubtaskForBarHtml = (finishedSubtask, subtasks) => {
    return `<div class="subtask-progress-indicator">
                    <div class="subtask-indicator-bar100">
                        <div class="subtask-indicator-bar-current" style="width: calc(${finishedSubtask.length}/${subtasks.length}*100%);"></div>
                    </div>
                    <div class="subtask-indicator-in-number">
                        ${catchZeroSubtaskForLabel(subtasks)}
                    </div>
                </div>`
}

/**
 * Creates markup for an editable subtask item in the edit dialog.
 *
 * @param {Object|string} subtask - The subtask data or string.
 * @param {number} index - The index of the subtask.
 * @returns {string} HTML markup for an editable subtask list item.
 */
const renderEditableSubtaskItem = (subtask, index) => {
    const description = getSubtaskDescription(subtask);
    return `<li class="subtask-preview-item subtask-actions" data-value="${index}">
        <span class="editSubtaskText subtask-text">${description}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="handleEditClick(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="handleDeleteClick(this)">
    </li>`;
};

/**
 * Creates the HTML markup for a task card rendered in the board.
 *
 * @param {Function} subtaskCatcherCallbackBar - Callback that renders the subtask progress bar.
 * @param {Function} subtaskCatcherCallbackLabel - Callback that renders the subtask progress label.
 * @param {Function} contactAssignedCatcherCallback - Callback that renders the assigned contact badges.
 * @param {Array<Object>} array - The list of tasks to render.
 * @param {number} index - The position of the current task inside the array.
 * @returns {string} HTML markup for a board task card.
 */
const setContactCard = (subtaskCatcherCallbackBar, subtaskCatcherCallbackLabel, contactAssignedCatcherCallback, array, index) => {
    let template = `<div onclick="openTaskDialog('${array[index].id}')" class="task-board-card" id="${array[index].id}" draggable="true" ondragstart="cardDragged(event)" ondragend="cardDragEnd(event)">
    <div class="task-card-inner-hug">
        <div class="task-card-header">
            <div class="task-category ${convertStringToClass(array[index].category)}">${array[index].category}</div>
                <button type="button" class="move-task-btn" onclick="openMoveMenu(event, '${array[index].id}', '${array[index].state}')" aria-label="Move task">
                    <img src="../assets/ui-icons/moveTo.svg" alt="" class="move-task-icon">
                </button>
                    <section class="move-menu" id="moveMenu${array[index].id}" onclick="stopEventPropagation(event)">
                        <h4>Move To:</h4>
                        <button onclick="moveTaskTo (this, '${array[index].id}')"  type="button" class="move-menu-item" data-state="toDo">To Do</button>
                        <button onclick="moveTaskTo (this, '${array[index].id}')"  type="button" class="move-menu-item" data-state="inProgress">In Progress</button>
                        <button onclick="moveTaskTo (this, '${array[index].id}')"  type="button" class="move-menu-item" data-state="awaitFeedBack">Await Feedback</button>
                        <button onclick="moveTaskTo (this, '${array[index].id}')"  type="button" class="move-menu-item" data-state="done">Done</button>
                        <button onclick="closeMoveMenu('${array[index].id}')"      type="button" class="move-menu-item" data-state="cancel"><b>Cancel</b></button>
                    </section>
        </div>
        <div class="task-card-body">
            <div class="task-card-title">
                <span>
                    ${array[index].title}
                </span>
            </div>
            <div class="task-card-description">
                <span>
                    ${array[index].description}
                </span>
            </div>
            ${subtaskCatcherCallbackBar(array[index].subtasks)}
            <div class="task-assigned-contact-and-priority-indicator">
                ${contactAssignedCatcherCallback(array[index].contactSelect, contactListJsonLibrary)}
                <div class="priority-indicator">
                    <img src="../assets/ui-icons/${array[index].priority}.svg" alt="${array[index].priority}">
                </div>
            </div>
        </div>
    </div>
</div>`
    return template
};

/**
 * Creates the HTML markup for the task details dialog.
 *
 * @param {Object} task - The task object to display.
 * @param {Object<string, Object>} contactLibrary - The contact library used for rendering assigned contacts.
 * @returns {string} HTML markup for the task dialog content.
 */
const taskDialogContentTemplate = (task, contactLibrary) => {
    let template = `
<div class="dialog-task-board-card" id="${task.id}">
    <div class="dialog-task-card-inner-hug">
        <header class="dialog-task-card-header">
            <div class="task-category ${convertStringToClass(task.category)}">${task.category}</div>
            <button type="button" onclick="toggleDialog('dialogOpenBigCard')" class="dialog-close-btn">
            <img class="x-btn" src="../assets/ui-icons/Close.svg" alt="Schliessen"></button>
        </header>
        <div class="dialog-task-card-body">
            <h3 class="dialog-task-card-title">
                ${task.title}
            </h3>
            <p class="dialog-task-card-description">
                ${task.description}
            </p>
            <section class="due-date-dialog">
                <span class="dialog-task-card-distance dialog-task-card-color">Due Date: </span> <span>${task.date}</span>         
            </section>
            <section>
                <span class="dialog-task-card-distance dialog-task-card-color">Priority: </span> <span>${task.priority[0].charAt(0).toUpperCase() + task.priority.slice(1)}
                        <img src="../assets/ui-icons/${task.priority}.svg" alt="${task.priority}"></span>
            </section>
            <section class="dialog-task-card-contacts">
                <p class="dialog-task-card-color">Assigned To:</p>
                ${renderDialogAssignedContacts(task.contactSelect, contactLibrary)}
            </section>
            <section class="subtasks-dialog">
             <p class="dialog-task-card-color">Subtasks</p>
              <div class="dialog-subtasks">
                 ${dialogSubtask(task.subtasks, false, task.id)}
              </div>
            </section>
        </div>
            <footer class="dialog-task-card-footer">
                <button class="dialog-task-card-btn" onclick="deleteTask('${task.id}')"><img src="../assets/ui-icons/delete.svg" alt="delete Button"> Delete</button>
                <button class="dialog-task-card-btn border-left-btn" onclick="openEditTaskDialog(${JSON.stringify(task).replace(/"/g, '&quot;')})"><img src="../assets/ui-icons/edit.svg" alt="edit Button"> Edit</button>
            </footer>
    </div>`
    return template
}

/**
 * Creates the HTML markup for the task edit dialog form.
 *
 * @param {Object} task - The task object currently being edited.
 * @param {Object<string, Object>} contactLibrary - The contact library used for rendering assigned contacts.
 * @returns {string} HTML markup for the edit dialog form.
 */
const taskDialogEditContentTemplate = (task, contactLibrary) => {
    let template = `
            <div class="closeButton">
                <button type="button" onclick="toggleDialog('dialogEditTask')"
                    class="dialog-close-btn"><img src="../assets/ui-icons/Close.svg" alt="Schliessen"></button>
            </div>
            <form class="add-task-form dialog-edit-form-height" id="editTaskForm" onsubmit="submitEditTask(event, this, '${task.id}', '${task.state}')" novalidate>
                <div class="dialog-edit-form">
                    <div class="add-task align-start dialog-edit-rem">
                        <div class="form-inputs">
                            <label class="required" for="editTitle">Title</label>
                            <div class="pos-rel">
                                <input type="text" id="editTitle" name="editTitle" placeholder="Enter a Title" value="${task.title}" required
                                data-error="Title is required">
                            </div>
                        </div>
                        <div class="form-inputs">
                            <label for="editDescription">Description</label>
                            <textarea name="editDescription" id="editDescription" placeholder="Enter a Description">${task.description}</textarea>
                        </div>
                        <div class="form-inputs">
                            <label class="required" for="editDate">Due date</label>
                            <div class="pos-rel">
                                <input type="date" min="${new Date().toISOString().split('T')[0]}" id="editDate" name="editDate" placeholder="dd/mm/yyyy" value="${task.date}" required
                                    data-error="Date is required">
                            </div>
                        </div>
                        <fieldset>
                            <legend>Priority</legend>
                            <div class="priority-options">
                                <button type="button" class="priority-btn urgent" onclick="selectPriority(this)">
                                    Urgent <img src="../assets/ui-icons/urgent.svg" alt="urgent.svg">
                                </button>
                                <button type="button" class="priority-btn medium" onclick="selectPriority(this)">
                                    Medium <img src="../assets/ui-icons/medium.svg" alt="medium.svg">
                                </button>
                                <button type="button" class="priority-btn low" onclick="selectPriority(this)">
                                    Low <img src="../assets/ui-icons/low.svg" alt="low.svg">
                                </button>
                            </div>
                        </fieldset>
                        <div class="form-inputs contact-form">
                            <label for="contactInputEdit" id="assignedToLabel"
                                onclick="contactInputClicked(event)">Assigned to</label>
                            <div class="contact-list-input-container" onclick="initInputContainer(this)">
                                <input type="text" placeholder="Select contact to assign"
                                    onfocus="initInput(this,event)" onblur="finishedInput(this,event)" id="contactInputEdit"
                                    oninput="initContactListSearch(this,event)">
                                <img src="../assets/ui-icons/arrow-down.svg" alt="arrow.svg" onmousedown="event.preventDefault()">
                            </div>
                            <div class="contact-input-list" id="contactInputListEdit" onmousedown="contactInputClicked(event)"></div>
                            <div class="selected-contact-field" id="selectedContactFieldEdit" style="display: flex;">${renderDialogAssignedContactsEdit(task.contactSelect, contactLibrary)}</div>
                        </div>
                        <div class="form-inputs">
                            <label class="required" for="categoryEdit">Category</label>
                            <div class="dropdown" id="categoryDropdownEdit">
                                    <button type="button" class="dropdown-trigger" id="categoryEdit" required
                                        data-error="Category is required" data-custom-dropdown="true"
                                        aria-required="true" aria-haspopup="listbox" aria-expanded="false">
                                        <span class="placeholder" id="dropdownLabelEdit">Select task Category</span>
                                        <img class="arrow" id="dropdownArrowEdit" src="../assets/ui-icons/arrow-down.svg"
                                            alt="arrow-down" />
                                    </button>
                                    <ul class="dropdown-list" id="dropdownListEdit" role="listbox" tabindex="-1"
                                        aria-labelledby="categoryEdit" hidden>
                                        <li class="dropdown-option" role="option" aria-selected="false"
                                            data-value="Technical Task">Technical Task</li>
                                        <li class="dropdown-option" role="option" aria-selected="false"
                                            data-value="User Story">User Story</li>
                                    </ul>
                                </div>
                        </div>
                        <div class="form-inputs">
                            <label for="editSubtask">Subtask</label>
                            <input type="text" id="editSubtask" name="editSubtasks" placeholder="Add subtasks with Enter" onkeydown="addEditSubtask(event,'${task.id}')">
                            <ul id="editSubtaskDescription">${dialogSubtask(task.subtasks, true, task.id)}</ul>
                        </div>
                    </div>
                </div>
                <div class="add-task-footer-dialog">
                    <p class="required">This field is required</p>
                    <div class="add-task-buttons">
                        <button type="submit" class="add-task-button btn-main">Ok<img src="../assets/ui-icons/check.svg"
                                alt="check.svg"></button>
                    </div>
                </div>
            </form>`
    return template
}

/**
 * Creates a checkbox row for a subtask in the task dialog.
 *
 * @param {string} safeId - A sanitized DOM id for the checkbox.
 * @param {number} index - The index of the subtask within the task.
 * @param {string} checked - The HTML attribute string for the checked state.
 * @param {string} description - The subtask description text.
 * @param {string} taskId - The task id associated with the subtask.
 * @returns {string} HTML markup for a readonly subtask checkbox item.
 */
function readonlySubtaskItemTemplate(safeId, index, checked, description, taskId) {
    return `<p class="input-label"><input class="checkbox" type="checkbox" id="${safeId}" data-value="${index}"
     onchange="toggleSubtaskState('${taskId}', ${index}, this.checked)" ${checked}>
   <label class="dialog-task-card-checkbox-label" for="${safeId}">${description}</label></p>`;
}

/**
 * Creates a circular badge for a contact with an assigned background color.
 *
 * @param {string} initials - The initials to display inside the badge.
 * @param {number[]} badgeColor - RGB color values for the badge background.
 * @returns {string} HTML markup for a contact badge.
 */
function contactBadgeTemplate(initials, badgeColor) {
    return `<div class="dialog-assigned-contact-badge" 
            style="background-color: rgb(${badgeColor[0]}, ${badgeColor[1]}, ${badgeColor[2]});">${initials}</div>`;
}

/**
 * Creates a single assigned-contact row for the task dialog.
 *
 * @param {string} initials - The initials to display in the contact badge.
 * @param {number[]} badgeColor - RGB color values for the badge background.
 * @param {string} name - The full name of the assigned contact.
 * @returns {string} HTML markup for a contact item with badge and label.
 */
function dialogAssignedContactItemTemplate(initials, badgeColor, name) {
    return `
        <div class="dialog-assigned-contact-item">
            ${contactBadgeTemplate(initials, badgeColor)}
            <span>${name}</span>
        </div>
    `;
}

/**
 * Creates a compact assigned-contact badge without a name label for edit mode.
 *
 * @param {string} initials - The initials to display in the badge.
 * @param {number[]} badgeColor - RGB color values for the badge background.
 * @returns {string} HTML markup for an edit-mode contact badge container.
 */
function dialogAssignedContactItemEditTemplate(initials, badgeColor) {
    return `
        <div class="dialog-assigned-contact-item">
            ${contactBadgeTemplate(initials, badgeColor)}
        </div>
    `;
}

/**
 * Wraps rendered assigned contacts in a dedicated container.
 *
 * @param {string} innerHtml - The HTML content of the assigned-contact section.
 * @returns {string} HTML markup for the assigned-contact container.
 */
function dialogAssignedContactIndicatorTemplate(innerHtml) {
    return ` <div class="dialog-assigned-contact-indicator">
                ${innerHtml}
            </div>`;
}

/**
 * Creates a fallback message when no contact is selected in the edit form.
 *
 * @returns {string} HTML text informing the user that no contact has been selected yet.
 */
function noContactSelectedEditTemplate() {
    return `  <span>no contact selected yet</span>`;
}

/**
 * Builds the overflow badge shown when more contacts are assigned than fit visually.
 *
 * @param {number} remaining - The number of remaining contacts to display as overflow.
 * @returns {string} HTML markup for the overflow indicator.
 */
function moreBadgeTemplate(remaining) {
    return `<div class="dialog-assigned-contact-item">
                <div class="dialog-assigned-contact-badge">+${remaining}</div>
            </div>`;
}

/**
 * Creates an empty-state placeholder for contacts that are not assigned.
 *
 * @returns {string} HTML markup for the empty assigned-contact indicator.
 */
function noContactIndicatorTemplate() {
    return `<div class="assigned-contact-indicator assigned-contact-indicator-no-contact-selected"></div>`;
}

/**
 * Creates a contact badge for a board task card with a positioned left offset.
 *
 * @param {number} index - The badge position index.
 * @param {number[]} badgeColor - RGB color values for the badge background.
 * @param {string} initials - The initials to display in the badge.
 * @returns {string} HTML markup for a task card contact badge.
 */
function boardCardContactBadgeTemplate(index, badgeColor, initials) {
    return `<div class="board-card-assigned-contact-badge left${index}" style="background-color: rgb(${badgeColor[0]}, ${badgeColor[1]}, ${badgeColor[2]});">${initials}</div>`;
}

/**
 * Creates the overflow badge displayed on board cards when additional contacts exist.
 *
 * @param {number} remaining - The number of additional contacts not shown individually.
 * @returns {string} HTML markup for the overflow badge.
 */
function boardCardOverflowBadgeTemplate(remaining) {
    return `<div class="board-card-assigned-contact-badge left3" style="background-color: rgb(154, 148, 148);">+${remaining}</div>`;
}

/**
 * Wraps the assigned-contact indicator in a board-card friendly container.
 *
 * @param {string} innerHtml - The HTML content to place inside the wrapper.
 * @returns {string} HTML markup for the assigned-contact indicator wrapper.
 */
function assignedContactIndicatorWrapperTemplate(innerHtml) {
    return ` <div class="assigned-contact-indicator">
                ${innerHtml}
            </div>`;
}