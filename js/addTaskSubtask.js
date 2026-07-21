/**
 * Parses raw subtask textarea content into structured subtask objects.
 *
 * @param {string} value - The raw subtask string.
 * @returns {Array<Object>} The parsed subtask list.
 */
const parseSubtasks = (value) => {
    const subtaskValue = value.trim();
    return subtaskValue === ''
        ? []
        : subtaskValue
            .split(/\n+/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
            .map((taskDescription) => ({ taskDescription, subtaskStateDone: false }));
};

/**
 * Returns the preview list container for the subtask input, creating it if necessary.
 *
 * @param {HTMLInputElement} input - The subtask input element.
 * @returns {HTMLElement} The preview list container.
 */
const getSubtaskPreviewList = (input) => {
    let previewList = input.parentElement?.parentElement?.querySelector('.subtask-preview-list');
    if (!previewList) {
        previewList = document.createElement('ul');
        previewList.className = 'subtask-preview-list';
        input.parentElement?.insertAdjacentElement('afterend', previewList);
    }
    return previewList;
};

/**
 * Renders the subtask preview list under the input field.
 *
 * @param {HTMLInputElement} input - The subtask input element.
 * @returns {void}
 */
const renderSubtaskPreview = (input) => {
    const subtasks = getSubtaskArray(input);
    if (subtasks.length === 0) {
        removeSubtaskPreviewList(input);
        return;
    }
    const previewList = getSubtaskPreviewList(input);
    previewList.innerHTML = buildSubtaskListHTML(subtasks);
};

/**
 * Removes the subtask preview list from the DOM.
 *
 * @param {HTMLInputElement} input - The subtask input element.
 * @returns {void}
 */
function removeSubtaskPreviewList(input) {
    const previewList = input.parentElement?.parentElement?.querySelector('.subtask-preview-list');
    previewList?.remove();
}

/**
 * Builds HTML markup for the subtask preview list.
 *
 * @param {Array<string>} subtasks - The list of subtask strings.
 * @returns {string} The generated list HTML.
 */
function buildSubtaskListHTML(subtasks) {
    return subtasks.map((subtask, i) => `<li class="subtask-preview-item subtask-actions" data-index="${i}"><span class="subtask-text">${subtask}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="editSubtask(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="deleteSubtask(this)">
    </li>`).join('');
}

/**
 * Clears the subtask preview display for the given input.
 *
 * @param {HTMLInputElement} input - The subtask input element.
 * @returns {void}
 */
const clearSubtaskPreview = (input) => {
    input?.parentElement?.parentElement?.querySelector('.subtask-preview-list')?.remove();
};

/**
 * Reads the current subtasks stored on the input element.
 *
 * @param {HTMLInputElement} input - The subtask input element.
 * @returns {Array<string>} The array of subtask text strings.
 */
function getSubtaskArray(input) {
    return input.dataset.subtasks ? input.dataset.subtasks.split(/\r?\n/).filter(Boolean) : [];
}

/**
 * Stores an array of subtasks back onto the input element.
 *
 * @param {HTMLInputElement} input - The subtask input element.
 * @param {Array<string>} arr - The array of subtask text strings.
 * @returns {void}
 */
function setSubtaskArray(input, arr) {
    input.dataset.subtasks = arr.join('\n');
}

/**
 * Deletes a subtask preview item and updates the stored subtask list.
 *
 * @param {HTMLElement} icon - The delete icon element.
 * @returns {void}
 */
function deleteSubtask(icon) {
    const li = icon.closest('.subtask-preview-item');
    const input = document.getElementById('subtask');
    const index = Number(li.dataset.index);

    const arr = getSubtaskArray(input);
    arr.splice(index, 1);
    setSubtaskArray(input, arr);
    renderSubtaskPreview(input);
}

/**
 * Enables inline editing for a subtask preview item.
 *
 * @param {HTMLElement} icon - The edit icon element.
 * @returns {void}
 */
function editSubtask(icon) {
    const li = icon.closest('.subtask-preview-item');
    const span = li.querySelector('.subtask-text');
    const isEditing = span.getAttribute('contenteditable') === 'true';
    if (isEditing) return;

    startEditing(span);
    attachEnterHandler(span);
    attachBlurHandler(span, li);
}

/**
 * Enables contentEditable mode and focuses the subtask text.
 *
 * @param {HTMLElement} span - The subtask text span element.
 * @returns {void}
 */
function startEditing(span) {
    span.setAttribute('contenteditable', 'true');
    span.focus();
    placeCaretAtEnd(span);
}

/**
 * Attaches a keyboard handler to submit a subtask edit on Enter.
 *
 * @param {HTMLElement} span - The editable subtask text span.
 * @returns {void}
 */
function attachEnterHandler(span) {
    function onKey(e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        span.removeEventListener('keydown', onKey);
        span.blur();
    }
    span.addEventListener('keydown', onKey);
}

/**
 * Attaches a blur handler to save or remove the edited subtask.
 *
 * @param {HTMLElement} span - The editable subtask text span.
 * @param {HTMLElement} li - The parent subtask list item.
 * @returns {void}
 */
function attachBlurHandler(span, li) {
    span.addEventListener('blur', function onBlur() {
        saveSubtaskEdit(span, li);
    }, { once: true });
}

/**
 * Saves the edited subtask text back to the input and rerenders the preview.
 *
 * @param {HTMLElement} span - The edited subtask text span.
 * @param {HTMLElement} li - The parent list item element.
 * @returns {void}
 */
function saveSubtaskEdit(span, li) {
    const input = document.getElementById('subtask');
    const index = Number(li.dataset.index);
    const newValue = span.textContent.trim();
    const arr = getSubtaskArray(input);

    updateSubtaskArray(arr, index, newValue);
    setSubtaskArray(input, arr);
    renderSubtaskPreview(input);
}

/**
 * Updates the stored subtask array for a single index.
 *
 * @param {Array<string>} arr - The current subtask array.
 * @param {number} index - The index to update.
 * @param {string} newValue - The new subtask text.
 * @returns {void}
 */
function updateSubtaskArray(arr, index, newValue) {
    if (newValue) {
        arr[index] = newValue;
    } else {
        arr.splice(index, 1);
    }
}

/**
 * Moves the caret to the end of an editable element.
 *
 * @param {HTMLElement} el - The editable element.
 * @returns {void}
 */
function placeCaretAtEnd(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

/**
 * Adds a new subtask to the draft list for the input.
 *
 * @param {HTMLInputElement} input - The subtask input element.
 * @param {string} value - The subtask text.
 * @returns {void}
 */
const addSubtaskDraft = (input, value) => {
    const storedSubtasks = input.dataset.subtasks ? input.dataset.subtasks.split(/\r?\n/).filter(Boolean) : [];
    storedSubtasks.push(value);
    input.dataset.subtasks = storedSubtasks.join('\n');
    input.value = '';
    renderSubtaskPreview(input);
};

/**
 * Shows the subtask action icons in the UI.
 *
 * @returns {void}
 */
function showSubtaskIcons() {
    document.querySelector('.subtask-field').classList.add('icons-visible');
}

/**
 * Hides subtask action icons after a short delay.
 *
 * @returns {void}
 */
function hideSubtaskIconsDelayed() {
    setTimeout(() => {
        document.querySelector('.subtask-field').classList.remove('icons-visible');
    }, 150);
}

/**
 * Confirms a subtask entry and adds it if valid.
 *
 * @returns {void}
 */
function confirmSubtask() {
    const input = document.getElementById('subtask');
    if (input.value.trim() === '') return;
    addEditSubtask({ key: 'Enter', target: input, preventDefault: () => {} });
}

/**
 * Cancels the current subtask input and clears the field.
 *
 * @returns {void}
 */
function cancelSubtask() {
    const input = document.getElementById('subtask');
    input.value = '';
    input.blur();
}

/**
 * Adds a subtask draft or persists a subtask to Firebase if editing an existing task.
 *
 * @param {Event} event - The keyboard event.
 * @param {string} [taskId] - The optional task id for persistence.
 * @returns {Promise<void>}
 */
async function addEditSubtask(event, taskId) {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    const input = event.target;
    const value = input.value.trim();
    if (!value) return;

    if (!taskId) {
        addSubtaskDraft(input, value);
        return;
    }
    await addSubtaskToFirebase(taskId, value);
    input.value = '';
}

/**
 * Adds a new subtask to Firebase and updates the edit view.
 *
 * @param {string} taskId - The task id.
 * @param {string} value - The subtask text.
 * @returns {Promise<void>}
 */
async function addSubtaskToFirebase(taskId, value) {
    const subtaskList = getOrCreateSubtaskList();
    const nextIndex = getNextSubtaskIndex(subtaskList);
    const newSubtask = { taskDescription: value, subtaskStateDone: false };
    await fetch(`${BASE_URL}/task/${taskId}/subtasks/${nextIndex}.json`, putMethode(newSubtask));
    subtaskList.appendChild(buildSubtaskListItem(nextIndex, value));
}

/**
 * Returns the edit subtask list element or creates one if it does not exist.
 *
 * @returns {HTMLElement} The subtask list element.
 */
function getOrCreateSubtaskList() {
    let list = document.getElementById('editSubtaskDescription');
    if (!list) {
        list = document.createElement('ul');
        list.id = 'editSubtaskDescription';
        document.getElementById('editSubtask').insertAdjacentElement('afterend', list);
    }
    return list;
}

/**
 * Returns the next available index for a new subtask list item.
 *
 * @param {HTMLElement} subtaskList - The subtask list element.
 * @returns {number} The next subtask index.
 */
const getNextSubtaskIndex = (subtaskList) => {
    const lastLi = subtaskList.querySelector('li:last-child');
    return lastLi ? Number(lastLi.dataset.value) + 1 : 0;
};

/**
 * Builds a new subtask list item element for edit mode.
 *
 * @param {number} index - The new subtask index.
 * @param {string} value - The subtask text.
 * @returns {HTMLElement} The new list item element.
 */
const buildSubtaskListItem = (index, value) => {
    const li = document.createElement('li');
    li.className = 'subtask-preview-item subtask-actions';
    li.dataset.value = index;
    li.innerHTML = `<span class="editSubtaskText subtask-text">${value}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="handleEditClick(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="handleDeleteClick(this)">`;
    return li;
};