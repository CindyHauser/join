const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"

function selectPriority(button) {
    removePriority();
    button.classList.add('selected');
}

function removePriority() {
    document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('selected'));
}

async function createTask(event) {
    if (event) {
        event.preventDefault();
    }

    const form = document.querySelector('.add-task-form');
    const newTask = {};

    if (form) {
        Array.from(form.elements).forEach((element) => {
            if (element.id === 'subtask') {
                const subtaskValue = element.value.trim();
                newTask.subtasks = subtaskValue === ''
                    ? ''
                    : subtaskValue
                        .split(/[\n,;]+/)
                        .map((item) => item.trim())
                        .filter((item) => item.length > 0);
            } else if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
                const key = element.id || element.name || 'field';
                newTask[key] = element.value;
            }
        });
    }

    const selectedPriorityButton = document.querySelector('.priority-btn.selected');
    newTask.priority = selectedPriorityButton
        ? selectedPriorityButton.textContent.trim().split(' ')[0].toLowerCase()
        : '';
    newTask.state = 'toDo'
    await postNewTaskToFireBase("task", newTask);
    clearAllInput();
    return;
}

function clearAllInput() {
    const form = document.querySelector('.add-task-form');

    if (form) {
        form.reset();
    }

    removePriority();
}

const postNewTaskToFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json",
        {
            method: "POST",
            header: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    )
    return await response.json()
}