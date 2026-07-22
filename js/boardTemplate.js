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
            <div class="subtask-progress-indicator">
                        ${subtaskCatcherCallbackBar(array[index].subtasks)}
                <div class="subtask-indicator-in-number">
                       ${subtaskCatcherCallbackLabel(array[index].subtasks)}
                </div>
            </div>
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
            <section>
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
            <section>
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
                                <input type="date" id="editDate" name="editDate" placeholder="dd/mm/yyyy" value="${task.date}" required
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
                                onclick="assignedToLabelClicked(event)">Assigned to</label>
                            <div class="contact-list-input-container" onclick="initInputContainer(this)">
                                <input type="text" placeholder="Select contact to assign"
                                    onfocus="initInput(this,event)" onblur="finishedInput(this,event)" id="contactInputEdit"
                                    oninput="initContactListSearch(this,event)">
                                <img src="../assets/ui-icons/arrow-down.svg" alt="arrow.svg" onmousedown="event.preventDefault()">
                            </div>
                            <div class="contact-input-list" id="contactInputListEdit" onmousedown="contactInputListClicked(event)"></div>
                            <div class="selected-contact-field" id="selectedContactFieldEdit">${renderDialogAssignedContactsEdit(task.contactSelect, contactLibrary)}</div>  
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