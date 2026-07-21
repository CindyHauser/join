/**
 * Returns the display description for a subtask entry.
 *
 * @param {Object|string} subtask - The subtask data or string.
 * @returns {string} The subtask description text.
 */
const getSubtaskDescription = (subtask) => {
    return subtask.taskDescription || subtask;
};

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
 * Creates markup for a readonly subtask item in the dialog view.
 *
 * @param {Object|string} subtask - The subtask data or string.
 * @param {number} index - The index of the subtask.
 * @param {string} taskId - The task identifier used to build unique element IDs.
 * @returns {string} HTML markup for a readonly subtask item.
 */
const renderReadonlySubtaskItem = (subtask, index, taskId) => {
    const description = getSubtaskDescription(subtask);
    const checked = subtask.subtaskStateDone ? 'checked' : '';
    const safeId = `${taskId}-subtask-${index}`;
    return `<p class="input-label"><input class="checkbox" type="checkbox" id="${safeId}" data-value="${index}"
     onchange="toggleSubtaskState('${taskId}', ${index}, this.checked)" ${checked}>
   <label class="dialog-task-card-checkbox-label" for="${safeId}">${description}</label></p>`;
};

/**
 * Renders all subtasks in editable mode.
 *
 * @param {Array<Object|string>} subtasks - The list of subtasks.
 * @returns {string} HTML markup for editable subtasks.
 */
const renderEditableSubtasks = (subtasks) => {
    return subtasks.map(renderEditableSubtaskItem).join("");
};

/**
 * Renders all subtasks in readonly mode.
 *
 * @param {Array<Object|string>} subtasks - The list of subtasks.
 * @param {string} taskId - The task identifier used to build unique checkbox IDs.
 * @returns {string} HTML markup for readonly subtasks.
 */
const renderReadonlySubtasks = (subtasks, taskId) => {
    return subtasks.map((subtask, index) => renderReadonlySubtaskItem(subtask, index, taskId)).join("");
};

/**
 * Returns subtask markup for either edit or readonly dialog mode.
 *
 * @param {Array<Object|string>} subtasks - The list of subtasks.
 * @param {boolean} editTask - Whether the subtasks should be rendered editable.
 * @param {string} taskId - The task identifier used for readonly subtask inputs.
 * @returns {string} HTML markup for the task subtasks.
 */
const dialogSubtask = (subtasks, editTask, taskId) => {
    if (!subtasks || subtasks.length === 0) return ``;
    if (editTask) return renderEditableSubtasks(subtasks);
    return renderReadonlySubtasks(subtasks, taskId);
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