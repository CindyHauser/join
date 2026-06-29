let taskState = 'toDo';

function stopPropagationFunction(event) {
    event.stopPropagation();
};

function toggleDialog(id, state) {
    const dialog = document.getElementById(id);
    if (dialog.open) {
        dialog.close();
    } else {
        // if a state was provided when opening, use it
        if (state) {
            taskState = state;
        }
        dialog.showModal();
    }
};

async function openTaskDialog(taskId) {
    const taskListLibrary = await getTaskLibraryForFirebaseInit();
    const task = setTaskDataStructure(taskId, taskListLibrary);
    const dialogTaskContent = document.getElementById('dialogTaskContent');
    dialogTaskContent.innerHTML = taskDialogContentTemplate(task);
    toggleDialog('dialogOpenBigCard');
};

async function submitFormDialog(event, taskState) {
    createTask(event, taskState);
    await initBoardPage();
};