/**
 * Normalizes a task object from the raw data structure for further rendering.
 *
 * @param {string} key - The unique task identifier.
 * @param {Object} object - The source object containing all task entries.
 * @returns {Object} A normalized task object with the expected rendering fields.
 */
const setTaskDataStructure = (key, object) => {
    const allSubtasks = object[key].subtasks
    const subtasksArray = reconstructSubTaskArray(allSubtasks)
    return {
        "id": key,
        "title": object[key].title,
        "category": object[key].category,
        "contactSelect": object[key].contactSelect,
        "date": object[key].date,
        "description": object[key].description,
        "priority": object[key].priority,
        "state": object[key].state,
        "subtasks": subtasksArray
    }
}

/**
 * Rebuilds a subtask array into a simplified structure that can be rendered in the UI.
 *
 * @param {Array<Object|String>} [array] - The raw subtask list from the task data.
 * @returns {Array<Object>} A normalized array of subtask objects.
 */
const reconstructSubTaskArray = (array) => {
    let reconstructedArray = []
    if (array == undefined) {
        return []
    }
    for (let index = 0; index < array.length; index++) {
        const subtasksObject = {
            "taskDescription": array[index].taskDescription,
            "subtaskStateDone": array[index].subtaskStateDone
        }
        reconstructedArray.push(subtasksObject)
    }
    return reconstructedArray
}

/**
 * Creates the HTML markup for subtasks shown in a dialog.
 *
 * @param {Array<Object|String>} subtasks - The subtasks associated with the task.
 * @param {boolean} editTask - Indicates whether the dialog is used in edit mode.
 * @param {string} taskId - The identifier of the parent task.
 * @returns {string} HTML string containing the rendered subtask list.
 */
const dialogSubtask = (subtasks, editTask, taskId) => {
    if (!subtasks || subtasks.length === 0) return ``;
    if (editTask) {
        return subtasks.map((subtask, index) => {
            const description = subtask.taskDescription || subtask;
            return `<li class="subtask-preview-item subtask-actions" data-value="${index}">
                <span class="editSubtaskText subtask-text">${description}</span>
                <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="handleEditClick(this)">
                <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="handleDeleteClick(this)">
            </li>`;
        }).join("");
    }
    return subtasks.map((subtask, index) => {
        const description = subtask.taskDescription || subtask;
        const checked = subtask.subtaskStateDone ? 'checked' : '';
        const safeId = `${taskId}-subtask-${index}`;
        return `<p class="input-label"><input class="checkbox" type="checkbox" id="${safeId}" data-value="${index}" 
         onchange="toggleSubtaskState('${taskId}', ${index}, this.checked)" ${checked}>
       <label class="dialog-task-card-checkbox-label" for="${safeId}">${description}</label></p>`;
    }).join("");
};

/**
 * Builds the progress bar markup for subtasks based on completed items.
 *
 * @param {Array<Object>} subtasks - The subtasks of the current task.
 * @returns {string} HTML markup for the subtask progress bar.
 */
const catchZeroSubtaskForBar = (subtasks) => {
    let finishedSubtask = []
    for (let index = 0; index < subtasks.length; index++) {
        if (subtasks[index].subtaskStateDone == true) {
            finishedSubtask.push(subtasks[index])
        }
    }
    if (subtasks.length == 0) {
        return `no subtask selected yet`
    } else {
        return `    <div class="subtask-indicator-bar100">
                          <div class="subtask-indicator-bar-current" style="width: calc(${finishedSubtask.length}/${subtasks.length}*100%);"></div>
                    </div>
                `
    }
}

/**
 * Creates the label text that shows how many subtasks are completed.
 *
 * @param {Array<Object>} subtasks - The subtasks of the current task.
 * @returns {string} A label string or empty markup if there are no subtasks.
 */
const catchZeroSubtaskForLabel = (subtasks) => {
    let finishedSubtask = []
    for (let index = 0; index < subtasks.length; index++) {
        if (subtasks[index].subtaskStateDone == true) {
            finishedSubtask.push(subtasks[index])
        }
    }
    if (subtasks.length == 0) {
        return ``
    } else {
        return `<span>${finishedSubtask.length}/${subtasks.length} Subtasks</span>`
    }
}

/**
 * Builds the markup for a single assigned contact in the dialog view.
 *
 * @param {string} contactId - The contact identifier.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the contact entry.
 */
const createDialogAssignedContactMarkup = (contactId, library) => {
    const contactData = library[contactId]
    if (!contactData) {
        return ''
    };
    const initials = `${contactData.fornameFirstLetter.toUpperCase()}${contactData.surnameFirstLetter.toUpperCase()}`
    return `
        <div class="dialog-assigned-contact-item">
            <div class="dialog-assigned-contact-badge" 
            style="background-color: rgb(${contactData.badgeColor[0]}, ${contactData.badgeColor[1]}, ${contactData.badgeColor[2]});">${initials}</div>
            <span>${contactData.forename} ${contactData.surname}</span>
        </div>
    `
};

/**
 * Builds the compact contact markup used in edit mode for dialogs.
 *
 * @param {string} contactId - The contact identifier.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the compact contact badge.
 */
const createDialogAssignedContactMarkupEdit = (contactId, library) => {
    const contactData = library[contactId]
    if (!contactData) {
        return ''
    };
    const initials = `${contactData.fornameFirstLetter.toUpperCase()}${contactData.surnameFirstLetter.toUpperCase()}`
    return `
        <div class="dialog-assigned-contact-item">
            <div class="dialog-assigned-contact-badge" 
            style="background-color: rgb(${contactData.badgeColor[0]}, ${contactData.badgeColor[1]}, ${contactData.badgeColor[2]});">${initials}</div>
        </div>
    `
};

/**
 * Renders the assigned contacts for the dialog view.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup that displays the assigned contacts or a placeholder.
 */
const renderDialogAssignedContacts = (contact, library) => {
    if (contact == undefined || contact.length == 0) {
        return `<div class="dialog-assigned-contact-indicator">
                    <span>no contact selected yet</span>
                </div>`
    };
    const contactSelectInnerHtml = contact.map(contactId => createDialogAssignedContactMarkup(contactId, library)).join('')
    return ` <div class="dialog-assigned-contact-indicator">
                    ${contactSelectInnerHtml}
                </div>`
};

/**
 * Renders the compact assigned contact list used during editing.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup that displays the assigned contacts or a placeholder.
 */
const renderDialogAssignedContactsEdit = (contact, library) => {
    if (contact == undefined || contact.length == 0) {
        return `  <span>no contact selected yet</span>
                `
    };
    const contactSelectInnerHtml = contact.map(contactId => createDialogAssignedContactMarkupEdit(contactId, library)).join('')
    return ` ${contactSelectInnerHtml}`
};

/**
 * Returns the appropriate contact badge markup depending on the number of assigned contacts.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the contact indicators.
 */
const catchZeroContact = (contact, library) => {
    if (contact == undefined) {
        return `<div class="assigned-contact-indicator assigned-contact-indicator-no-contact-selected">
                    <span>no contact selected yet</span>
                </div>`
    } else if (contact.length >= 4) {
        return catchContactAssignedLength3(contact, library)
    } else {
        return catchContactAssignedLengthMoreThan3(contact, library)
    }
}

/**
 * Builds the compact contact preview for a task with up to three assigned contacts.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the preview.
 */
const catchContactAssignedLength3 = (contact, library) => {
    let contactSelectInnerHtml = ''
    for (let index = 0; index < 3; index++) {
        contactSelectInnerHtml += `<div class="board-card-assigned-contact-badge left${index}" style="background-color: rgb(${library[contact[index]].badgeColor[0]}, ${library[contact[index]].badgeColor[1]}, 
        ${library[contact[index]].badgeColor[2]});">${library[contact[index]].fornameFirstLetter}${library[contact[index]].surnameFirstLetter}</div>`
    }
    return ` <div class="assigned-contact-indicator">
                    ${contactSelectInnerHtml}
                    <div class="board-card-assigned-contact-badge left3" style="background-color: rgb(154, 148, 148);">+${contact.length - 3}</div>
                </div>`
}

/**
 * Builds the contact preview for tasks with fewer than four assigned contacts.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the preview.
 */
const catchContactAssignedLengthMoreThan3 = (contact, library) => {
    let contactSelectInnerHtml = ''
    for (let index = 0; index < contact.length; index++) {
        contactSelectInnerHtml += `<div class="board-card-assigned-contact-badge left${index}" style="background-color: rgb(${library[contact[index]].badgeColor[0]}, 
        ${library[contact[index]].badgeColor[1]}, ${library[contact[index]].badgeColor[2]});">
        ${library[contact[index]].fornameFirstLetter}${library[contact[index]].surnameFirstLetter}</div>`
    }
    return ` <div class="assigned-contact-indicator">
                    ${contactSelectInnerHtml}
                </div>`
}

/**
 * Converts a human-readable string into a CSS-friendly class name.
 *
 * @param {string} string - The input string to transform.
 * @returns {string} A normalized class name or an empty string if the input is invalid.
 */
const convertStringToclass = (string) => {
    if (!string || typeof string !== 'string') {
        return ''
    }
    return string
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
}