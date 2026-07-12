let editSubtaskList = null;
let taskState = 'toDo';

function stopPropagationFunction(event) {
    event.stopPropagation();
};

function resetContactSelection() {
    contactSelectedList = [];
    document.getElementById('selectedContactField').innerHTML = '';
}

function openDialog(dialog) {
        dialog.showModal();
        dialog.classList.add("opened");
        document.body.style.overflow = 'hidden';
        initAddTaskPage();
    }

function closeDialog(dialog) {
    dialog.close();
    document.body.style.overflow = 'auto';
    dialog.classList.remove("opened");
}

function toggleDialog(id, state) {
    const dialog = document.getElementById(id);
    resetContactSelection();
    if (dialog.open) {
        closeDialog(dialog);
    } else {
        if (state) {taskState = state;}
        openDialog(dialog);
    }
};

async function openTaskDialog(taskId) {
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    const dialogTaskContent = document.getElementById('dialogTaskContent');
    const dialogEditTaskContent = document.getElementById('dialogContentEditTask');
    dialogEditTaskContent.innerHTML = taskDialogEditContentTemplate(task, contactListJsonLibrary);
    dialogTaskContent.innerHTML = taskDialogContentTemplate(task, contactListJsonLibrary);
    initEditSubtaskListEvents();
    toggleDialog('dialogOpenBigCard');
};

function openEditTaskDialog(task) {
    toggleDialog('dialogEditTask');
    const dialog = document.getElementById('dialogEditTask');
    setPriority(dialog, task.priority);
    selectCategoryByValue('categoryEdit', task.category);
    initDropdown(dialog);
    const editTaskForm = document.querySelector('#editTaskForm');
    contactSelectedList = task.contactSelect
    initValidation(editTaskForm);
}

async function submitFormDialog(event, taskState) {
    event.preventDefault();
    if (!validateForm(addTaskForm)) return;
    await createTask(event, taskState);
    toggleDialog('dialogAddTask');
    await initBoardPage();
};

function resetOptions(options) {
    options.forEach(option => {
        option.setAttribute('aria-selected', 'false');
        option.classList.remove('active');
    });
}

function applySelectedOption(option, trigger, label) {
    option.setAttribute('aria-selected', 'true');
    option.classList.add('active');
    label.textContent = option.textContent;
    trigger.dataset.value = option.dataset.value;
}

function clearSelection(trigger, label) {
    label.textContent = 'Select task Category';
    trigger.dataset.value = '';
}

function getDropdownElements(selectId) {
    const isEdit = selectId === 'categoryEdit';
    const trigger = document.getElementById(selectId);
    const list = document.getElementById(`dropdownList${isEdit ? 'Edit' : ''}`);
    const label = document.getElementById(`dropdownLabel${isEdit ? 'Edit' : ''}`);
    return { trigger, list, label };
}

function selectCategoryByValue(selectId, value) {
    const { trigger, list, label } = getDropdownElements(selectId);
    if (!trigger || !list || !label) return;

    const options = Array.from(list.querySelectorAll('.dropdown-option'));
    resetOptions(options);

    const selectedOption = options.find(option => option.dataset.value === value);
    selectedOption
        ? applySelectedOption(selectedOption, trigger, label)
        : clearSelection(trigger, label);
}

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

async function toggleSubtaskState(taskId, index, checked) {
    await fetch(`${BASE_URL}/task/${taskId}/subtasks/${index}/subtaskStateDone.json`, putMethode(checked));
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    document.getElementById('dialogTaskContent').innerHTML = taskDialogContentTemplate(task, contactListJsonLibrary);
    await initBoardPage();
}

async function getTask(taskId) {
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    return setTaskDataStructure(taskId, taskListLibrary);
}

function getEditFormValues(event) {
    const formData = new FormData(event.target);
    return {
        formData,
        taskTitle: formData.get('editTitle'),
        taskDescription: formData.get('editDescription'),
        taskDate: formData.get('editDate')
    };
}

function getTaskCategory(formData) {
    const categoryTrigger = document.getElementById('categoryEdit');
    return categoryTrigger?.dataset.value || formData.get('categoryEdit');
}

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

async function editTask(event, taskId, taskState) {
    const task = await getTask(taskId);
    const data = collectEditData(event, task);
    data.state = taskState;
    putTaskDataToFireBase(taskId, data);
}

async function deleteTask(taskId) {
    deleteTaskDataFromFireBase(taskId);
    toggleDialog('dialogOpenBigCard');
    await initBoardPage();
    await showSuccessDialog('deleteSuccessDialog');
}

function handleEditSubtaskListClick(e) {
    if (!editSubtaskList || !editSubtaskList.contains(e.target)) return;

    const deleteButton = e.target.closest(".delete-btn");
    if (deleteButton) return handleDeleteClick(deleteButton);

    const editButton = e.target.closest(".edit-btn");
    if (editButton) return handleEditClick(editButton);

    const confirmButton = e.target.closest(".confirm-btn");
    if (confirmButton) return handleConfirmClick(confirmButton);
}

function handleDeleteClick(deleteButton) {
    const li = deleteButton.closest("li");
    decrementFollowingIndices(li);
    li.remove();
}

function decrementFollowingIndices(li) {
    let next = li.nextElementSibling;
    while (next) {
        next.dataset.value = Number(next.dataset.value) - 1;
        next = next.nextElementSibling;
    }
}

function handleEditClick(editButton) {
    const li = editButton.closest("li");
    const text = li.querySelector(".editSubtaskText").textContent;
    li.innerHTML = getEditModeHTML(text);
    li.querySelector(".edit-input").focus();
}

function getEditModeHTML(text) {
    return `
    <div class="subtask-item">
        <input class="edit-input" type="text" value="${text}" name="editSubtask">
        <div class="actions">
            <button class="confirm-btn subtaskButton">
                <img src="../assets/ui-icons/check.svg" alt="Bestätigen">
            </button>
            <button class="delete-btn subtaskButton">
                <img src="../assets/ui-icons/delete.svg" alt="Löschen">
            </button>
        </div>
    </div>`;
}

function handleConfirmClick(confirmButton) {
    const li = confirmButton.closest("li");
    const value = li.querySelector(".edit-input").value;
    li.innerHTML = getViewModeHTML(value);
}

function getViewModeHTML(value) {
    return `
    <div class="subtask-item">
        <span class="editSubtaskText">${value}</span>
        <div class="actions">
            <button class="edit-btn subtaskButton">
                <img src="../assets/ui-icons/edit.svg" alt="Bearbeiten">
            </button>
            <button class="delete-btn subtaskButton">
                <img src="../assets/ui-icons/delete.svg" alt="Löschen">
            </button>
        </div>
    </div>`;
}

function initEditSubtaskListEvents() {
    const list = document.getElementById("editSubtaskDescription");
    if (!list || editSubtaskList === list) return;
    if (editSubtaskList) {
        editSubtaskList.removeEventListener("click", handleEditSubtaskListClick);
    }
    editSubtaskList = list;
    editSubtaskList.addEventListener("click", handleEditSubtaskListClick);
}