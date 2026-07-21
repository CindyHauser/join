let taskState = 'toDo';

/**
 * Stops the propagation of an event to parent elements.
 *
 * @param {Event} event - The event object to stop propagating.
 * @returns {void}
 */
function stopPropagationFunction(event) {
    event.stopPropagation();
};

/**
 * Resets the contact selection state and clears the visible selection area.
 *
 * @returns {void}
 */
function resetContactSelection() {
    contactSelectedList = [];
    document.getElementById('selectedContactField').innerHTML = '';
}

/**
 * Opens a dialog and applies the default dialog state.
 *
 * @param {HTMLDialogElement} dialog - The dialog element to open.
 * @returns {void}
 */
function openDialog(dialog) {
    dialog.showModal();
    dialog.classList.add("opened");
    document.body.style.overflow = 'hidden';
    initAddTaskPage();
}

/**
 * Closes a dialog and resets the page scroll and dialog styling.
 *
 * @param {HTMLDialogElement} dialog - The dialog element to close.
 * @returns {void}
 */
function closeDialog(dialog) {
    dialog.close();
    document.body.style.overflow = 'auto';
    dialog.classList.remove("opened");
}

/**
 * Toggles a dialog by its ID and optionally stores a task state.
 *
 * @param {string} id - The ID of the dialog element.
 * @param {string} [state] - Optional task state to use when opening the dialog.
 * @returns {void}
 */
function toggleDialog(id, state) {
    const dialog = document.getElementById(id);
    resetContactSelection();
    if (dialog.open) {
        closeDialog(dialog);
    } else {
        if (state) { taskState = state; }
        openDialog(dialog);
    }
};

/**
 * Opens the task detail dialog and renders the task content.
 *
 * @param {string} taskId - The ID of the task to display.
 * @returns {Promise<void>}
 */
async function openTaskDialog(taskId) {
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    const dialogTaskContent = document.getElementById('dialogTaskContent');
    dialogTaskContent.innerHTML = taskDialogContentTemplate(task, contactListJsonLibrary);
    toggleDialog('dialogOpenBigCard');
};

/**
 * Opens the edit task dialog and pre-fills it with the provided task data.
 *
 * @param {Object} task - The task object containing the values to display.
 * @returns {void}
 */
function openEditTaskDialog(task) {
    const dialogEditTaskContent = document.getElementById('dialogContentEditTask');
    dialogEditTaskContent.innerHTML = taskDialogEditContentTemplate(task, contactListJsonLibrary);
    toggleDialog('dialogEditTask');
    const dialog = document.getElementById('dialogEditTask');
    setPriority(dialog, task.priority);
    selectCategoryByValue('categoryEdit', task.category);
    initDropdown(dialog);
    const editTaskForm = document.querySelector('#editTaskForm');
    contactSelectedList = task.contactSelect
    initValidation(editTaskForm);
}

/**
 * Handles submission of the add-task dialog form.
 *
 * @param {Event} event - The submit event.
 * @param {string} taskState - The target board state for the new task.
 * @returns {Promise<void>}
 */
async function submitFormDialog(event, taskState) {
    event.preventDefault();
    if (!validateForm(addTaskForm)) return;
    await createTask(event, taskState);
    toggleDialog('dialogAddTask');
    await initBoardPage();
};

/**
 * Submits the edited task data from the edit dialog.
 *
 * @param {Event} event - The submit event.
 * @param {HTMLFormElement} editTaskForm - The edit form element.
 * @param {string} taskId - The ID of the task being edited.
 * @param {string} taskState - The new task state.
 * @returns {Promise<void>}
 */
async function submitEditTask(event, editTaskForm, taskId, taskState) {
    event.preventDefault();
    if (!validateForm(editTaskForm)) return;
    await editTask(event, taskId, taskState);
    await showSuccessDialog('editSuccessDialog');
    toggleDialog('dialogEditTask');
    await initBoardPage();
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    document.getElementById('dialogTaskContent').innerHTML = taskDialogContentTemplate(task, contactListJsonLibrary);
};

/**
 * Updates the checked state of a subtask in the backend.
 *
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} index - The subtask index.
 * @param {boolean} checked - The new checked state.
 * @returns {Promise<void>}
 */
async function toggleSubtaskState(taskId, index, checked) {
    await fetch(`${BASE_URL}/task/${taskId}/subtasks/${index}/subtaskStateDone.json`, putMethode(checked));
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    document.getElementById('dialogTaskContent').innerHTML = taskDialogContentTemplate(task, contactListJsonLibrary);
    await initBoardPage();
}

/**
 * Loads a task by ID from the backend.
 *
 * @param {string} taskId - The ID of the task to load.
 * @returns {Promise<Object>}
 */
async function getTask(taskId) {
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    return setTaskDataStructure(taskId, taskListLibrary);
}

/**
 * Extracts the relevant form values from the edit form submission event.
 *
 * @param {Event} event - The form submit event.
 * @returns {{formData: FormData, taskTitle: FormDataEntryValue|null, taskDescription: FormDataEntryValue|null, taskDate: FormDataEntryValue|null}}
 */
function getEditFormValues(event) {
    const formData = new FormData(event.target);
    return {
        formData,
        taskTitle: formData.get('editTitle'),
        taskDescription: formData.get('editDescription'),
        taskDate: formData.get('editDate')
    };
}

/**
 * Reads the currently selected task category from the custom dropdown.
 *
 * @param {FormData} formData - The form data object.
 * @returns {string|FormDataEntryValue|null}
 */
function getTaskCategory(formData) {
    const categoryTrigger = document.getElementById('categoryEdit');
    return categoryTrigger?.dataset.value || formData.get('categoryEdit');
}

/**
 * Builds the edited subtask object from the visible subtask list.
 *
 * @param {Object} task - The current task object.
 * @returns {Object}
 */
function buildEditedSubtasks(task) {
    return Object.fromEntries(
        [...document.querySelectorAll('#editSubtaskDescription li')]
            .map(li => [
                li.dataset.value,
                {
                    subtaskStateDone: task.subtasks[li.dataset.value].subtaskStateDone,
                    taskDescription: li.querySelector('.editSubtaskText')?.textContent.trim()
                }
            ])
    );
}

/**
 * Collects all edited task data into one object for persistence.
 *
 * @param {Event} event - The submit event.
 * @param {Object} task - The current task object.
 * @returns {Object}
 */
function collectEditData(event, task) {
    const { formData, taskTitle, taskDescription, taskDate } = getEditFormValues(event);
    return {
        title: taskTitle,
        description: taskDescription,
        date: taskDate,
        contactSelect: contactSelectedList,
        priority: getSelectedPriority(),
        category: getTaskCategory(formData),
        subtasks: buildEditedSubtasks(task)
    };
}

/**
 * Saves the edited task data to the backend.
 *
 * @param {Event} event - The submit event.
 * @param {string} taskId - The ID of the task to update.
 * @param {string} taskState - The task state to save.
 * @returns {Promise<void>}
 */
async function editTask(event, taskId, taskState) {
    const task = await getTask(taskId);
    const data = collectEditData(event, task);
    data.state = taskState;
    putTaskDataToFireBase(taskId, data);
}

/**
 * Deletes a task and refreshes the board view.
 *
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
    deleteTaskDataFromFireBase(taskId);
    toggleDialog('dialogOpenBigCard');
    await initBoardPage();
    await showSuccessDialog('deleteSuccessDialog');
}