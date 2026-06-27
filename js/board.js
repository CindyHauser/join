const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"

async function init() {
    await getTasksCards();
};

async function getTasksFromFirebase() {
    const tasks = await fetch(BASE_URL + "task.json");
    const tasksData = await tasks.json();

    console.log(Object.values(tasksData));

    return Object.values(tasksData);
};

async function getTasksCards() {
    const tasks = await getTasksFromFirebase();
    const taskContainer = document.getElementById('toDoColumn');
    for (let i = 0; i < tasks.length - 1; i++) {
        const task = tasks[i];
        const taskCard = createTaskCard(task);

        console.log(task);

        taskContainer.innerHTML += taskCard;
    };
};

function createTaskCard(task) {
    return `
                <div class="task-board-card" id="${task}" draggable="true" ondragstart="cardDragged(event)">
                   <p>${task.category}</p>
                   <h3>${task.title}</h3>
                   <p>${task.description}</p>
                   <p>${task.subtasks[1]}</p>
                   <div>
                       <div>contacts</div>
                       <div><img src="../assets/ui-icons/${task.priority}.svg"></div>
                   </div>

                </div>
    `;
}