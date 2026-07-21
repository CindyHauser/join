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

const getSubtaskPreviewList = (input) => {
    let previewList = input.parentElement?.parentElement?.querySelector('.subtask-preview-list');
    if (!previewList) {
        previewList = document.createElement('ul');
        previewList.className = 'subtask-preview-list';
        input.parentElement?.insertAdjacentElement('afterend', previewList);
    }
    return previewList;
};

const renderSubtaskPreview = (input) => {
    const subtasks = getSubtaskArray(input);
    if (subtasks.length === 0) {
        removeSubtaskPreviewList(input);
        return;
    }
    const previewList = getSubtaskPreviewList(input);
    previewList.innerHTML = buildSubtaskListHTML(subtasks);
};

function removeSubtaskPreviewList(input) {
    const previewList = input.parentElement?.parentElement?.querySelector('.subtask-preview-list');
    previewList?.remove();
}

function buildSubtaskListHTML(subtasks) {
    return subtasks.map((subtask, i) => `<li class="subtask-preview-item subtask-actions" data-index="${i}"><span class="subtask-text">${subtask}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="editSubtask(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="deleteSubtask(this)">
    </li>`).join('');
}

const clearSubtaskPreview = (input) => {
    input?.parentElement?.parentElement?.querySelector('.subtask-preview-list')?.remove();
};

function getSubtaskArray(input) {
    return input.dataset.subtasks ? input.dataset.subtasks.split(/\r?\n/).filter(Boolean) : [];
}

function setSubtaskArray(input, arr) {
    input.dataset.subtasks = arr.join('\n');
}

function deleteSubtask(icon) {
    const li = icon.closest('.subtask-preview-item');
    const input = document.getElementById('subtask');
    const index = Number(li.dataset.index);

    const arr = getSubtaskArray(input);
    arr.splice(index, 1);
    setSubtaskArray(input, arr);
    renderSubtaskPreview(input);
}

function editSubtask(icon) {
    const li = icon.closest('.subtask-preview-item');
    const span = li.querySelector('.subtask-text');
    const isEditing = span.getAttribute('contenteditable') === 'true';
    if (isEditing) return;

    startEditing(span);
    attachEnterHandler(span);
    attachBlurHandler(span, li);
}

function startEditing(span) {
    span.setAttribute('contenteditable', 'true');
    span.focus();
    placeCaretAtEnd(span);
}

function attachEnterHandler(span) {
    function onKey(e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        span.removeEventListener('keydown', onKey);
        span.blur();
    }
    span.addEventListener('keydown', onKey);
}

function attachBlurHandler(span, li) {
    span.addEventListener('blur', function onBlur() {
        saveSubtaskEdit(span, li);
    }, { once: true });
}

function saveSubtaskEdit(span, li) {
    const input = document.getElementById('subtask');
    const index = Number(li.dataset.index);
    const newValue = span.textContent.trim();
    const arr = getSubtaskArray(input);

    updateSubtaskArray(arr, index, newValue);
    setSubtaskArray(input, arr);
    renderSubtaskPreview(input);
}

function updateSubtaskArray(arr, index, newValue) {
    if (newValue) {
        arr[index] = newValue;
    } else {
        arr.splice(index, 1);
    }
}

function placeCaretAtEnd(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

const addSubtaskDraft = (input, value) => {
    const storedSubtasks = input.dataset.subtasks ? input.dataset.subtasks.split(/\r?\n/).filter(Boolean) : [];
    storedSubtasks.push(value);
    input.dataset.subtasks = storedSubtasks.join('\n');
    input.value = '';
    renderSubtaskPreview(input);
};

function showSubtaskIcons() {
    document.querySelector('.subtask-field').classList.add('icons-visible');
}

function hideSubtaskIconsDelayed() {
    setTimeout(() => {
        document.querySelector('.subtask-field').classList.remove('icons-visible');
    }, 150);
}

function confirmSubtask() {
    const input = document.getElementById('subtask');
    if (input.value.trim() === '') return;
    addEditSubtask({ key: 'Enter', target: input, preventDefault: () => {} });
}

function cancelSubtask() {
    const input = document.getElementById('subtask');
    input.value = '';
    input.blur();
}

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

async function addSubtaskToFirebase(taskId, value) {
    const subtaskList = getOrCreateSubtaskList();
    const nextIndex = getNextSubtaskIndex(subtaskList);
    const newSubtask = { taskDescription: value, subtaskStateDone: false };
    await fetch(`${BASE_URL}/task/${taskId}/subtasks/${nextIndex}.json`, putMethode(newSubtask));
    subtaskList.appendChild(buildSubtaskListItem(nextIndex, value));
}

function getOrCreateSubtaskList() {
    let list = document.getElementById('editSubtaskDescription');
    if (!list) {
        list = document.createElement('ul');
        list.id = 'editSubtaskDescription';
        document.getElementById('editSubtask').insertAdjacentElement('afterend', list);
    }
    return list;
}

const getNextSubtaskIndex = (subtaskList) => {
    const lastLi = subtaskList.querySelector('li:last-child');
    return lastLi ? Number(lastLi.dataset.value) + 1 : 0;
};

const buildSubtaskListItem = (index, value) => {
    const li = document.createElement('li');
    li.className = 'subtask-preview-item subtask-actions';
    li.dataset.value = index;
    li.innerHTML = `<span class="editSubtaskText subtask-text">${value}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="handleEditClick(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="handleDeleteClick(this)">`;
    return li;
};