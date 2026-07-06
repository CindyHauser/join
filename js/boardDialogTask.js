let taskState = 'toDo';

function stopPropagationFunction(event) {
    event.stopPropagation();
};

function toggleDialog(id, state) {
    const dialog = document.getElementById(id);
    contactSelectedList = []
    document.getElementById('selectedContactField').innerHTML = ''
    if (dialog.open) {
        dialog.close();
    } else {
        // if a state was provided when opening, use it
        if (state) {
            taskState = state;
        }
        dialog.showModal();
        initAddTaskPage();
        
    }
};

async function openTaskDialog(taskId) {
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    const dialogTaskContent = document.getElementById('dialogTaskContent');
    const dialogEditTaskContent = document.getElementById('dialogContentEditTask');
    dialogEditTaskContent.innerHTML = taskDialogEditContentTemplate(task, contactListJsonLibrary);
    dialogTaskContent.innerHTML = taskDialogContentTemplate(task, contactListJsonLibrary);
    toggleDialog('dialogOpenBigCard');
};

function openEditTaskDialog(task) {
    toggleDialog('dialogEditTask');
    const dialog = document.getElementById('dialogEditTask');
    setPriority(dialog, task.priority);
    selectCategoryByValue('categoryEdit', task.category);
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

function selectCategoryByValue(selectId, value) {
    const select = document.getElementById(selectId);

    Array.from(select.options).forEach(option => {
        option.removeAttribute("selected");
    });

    const option = Array.from(select.options).find(opt => opt.value === value);

    if (option) {
        option.setAttribute("selected", "selected");
        select.value = value;
    } else {select.value = "";}
}

async function addEditSubtask(event, taskId) {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const input = event.target;
    const value = input.value.trim();

    if (!value) return;

    const subtaskList = document.getElementById("editSubtaskDescription");
    const lastLi = subtaskList.querySelector("li:last-child");

    const nextIndex = lastLi
        ? Number(lastLi.dataset.value) + 1
        : 0;

    const newSubtask = {
        taskDescription: value,
        subtaskStateDone: false
    };

    await fetch(`${BASE_URL}/task/${taskId}/subtasks/${nextIndex}.json`, putMethode(newSubtask));

    const li = document.createElement("li");
    li.dataset.value = nextIndex;
    li.textContent = value;

    subtaskList.appendChild(li);

    input.value = "";
}

async function submitEditTask(event, editTaskForm, taskId, taskState) {
    event.preventDefault();
    if (!validateForm(editTaskForm)) return;
    await editTask(event, taskId, taskState);
    toggleDialog('dialogEditTask');
    await initBoardPage();
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    document.getElementById('dialogTaskContent').innerHTML =  taskDialogContentTemplate(task, contactListJsonLibrary);
};

async function toggleSubtaskState(taskId, index, checked) {
    await fetch(`${BASE_URL}/task/${taskId}/subtasks/${index}/subtaskStateDone.json`, putMethode(checked));
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    document.getElementById('dialogTaskContent').innerHTML = taskDialogContentTemplate(task, contactListJsonLibrary);
    await initBoardPage();
}

async function editTask(event, taskId , taskState) {
    const formData = new FormData(event.target);
    const taskTitle = formData.get('editTitle');
    const taskDescription = formData.get('editDescription');
    const taskDate = formData.get('editDate');
    const taskPriority = getSelectedPriority();
    const taskCategory = formData.get('categoryEdit');
    const taskSubtasks = formData.getAll('editSubtasks').filter(subtask => subtask.trim() !== '');
    putTaskDataToFireBase(taskId, {
        title: taskTitle,
        description: taskDescription,
        date: taskDate,
        state: taskState,
        contactSelect: contactSelectedList,
        priority: taskPriority,
        category: taskCategory,
        subtasks: taskSubtasks
    });
}

function deleteTask(taskId) {
    deleteTaskDataFromFireBase(taskId);
    toggleDialog('dialogOpenBigCard');
    initBoardPage();
}