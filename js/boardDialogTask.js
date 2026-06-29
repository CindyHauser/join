// const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"

// async function init() {
//     await getTasksCards();
// };

// async function getTasksFromFirebase() {
//     const tasks = await fetch(BASE_URL + "task.json");
//     const tasksData = await tasks.json();

//     console.log(Object.values(tasksData));

//     return Object.values(tasksData);
// };

// async function getTasksCards() {
//     const tasks = await getTasksFromFirebase();
//     const taskContainer = document.getElementById('toDoColumn');
//     for (let curentTask = 0; curentTask < tasks.length - 1; curentTask++) {
//         const task = tasks[curentTask];
//         const taskCard = createTaskCard(task, curentTask);

//         console.log(task);

//         taskContainer.innerHTML += taskCard;
//     };
// };

// global task state used by the Add Task form
let taskState = 'toDo';

// function createTaskCard(task, id) {
//     return `
//                 <div class="task-board-card" id="${id}" draggable="true" ondragstart="cardDragged(event)">
//                    <p>${task.category}</p>
//                    <h3>${task.title}</h3>
//                    <p>${task.description}</p>
//                    <p>${task.subtasks[1]}</p>
//                    <div>
//                        <div>contacts</div>
//                        ${task.priority && task.priority.trim() ? `<div><img src="../assets/ui-icons/${task.priority}.svg" alt="${task.priority}"></div>` : ''}
//                    </div>

//                 </div>
//     `;
// }

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

async function submitFormDialog(event, taskState) {
    createTask(event, taskState);
    await initBoardPage();
}