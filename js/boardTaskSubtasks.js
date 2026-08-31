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
    return readonlySubtaskItemTemplate(safeId, index, checked, description, taskId);
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
    subtasks = subtasks || []
    let finishedSubtask = []
    for (let index = 0; index < subtasks.length; index++) {
        if (subtasks[index].subtaskStateDone == true) {
            finishedSubtask.push(subtasks[index])
        }
    }
    if (subtasks.length === 0) {
        return '';
    } else {
        return setCatchZeroSubtaskForBarHtml(finishedSubtask, subtasks)
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

