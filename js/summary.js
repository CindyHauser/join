const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"
const greetingUserName = document.getElementById('greetingUserName');
greetingUserName.textContent = localStorage.getItem("currentUserName");

const greetingUserElement = document.getElementById('greetingUser');
if (greetingUserName.textContent) {
    greetingUserElement.textContent = `,`;
}

const fetchTasksFromFirebase = async () => {
    try {
        const res = await fetch(BASE_URL + "task.json");
        if (!res.ok) return {};
        const data = await res.json();
        return data || {};
    } catch (e) {
        console.error('fetchTasksFromFirebase error', e);
        return {};
    }
};

const countByState = (tasks, state) => {
    if (!tasks) return 0;
    let count = 0;
    for (const key in tasks) {
        if (!Object.prototype.hasOwnProperty.call(tasks, key)) continue;
        if (key === 'position') continue;
        const task = tasks[key];
        if (task && task.state === state) count++;
    }
    return count;
}

const countTotal = (tasks) => {
    if (!tasks) return 0;
    let count = 0;
    for (const key in tasks) {
        if (!Object.prototype.hasOwnProperty.call(tasks, key)) continue;
        if (key === 'position') continue;
        count++;
    }
    return count;
}

const updateField = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

const updateSummaryMetrics = async () => {
    const tasks = await fetchTasksFromFirebase();
    updateField('numberToDo', countByState(tasks, 'toDo'));
    updateField('numberDoneTasks', countByState(tasks, 'done'));
    updateField('numberTotalTasks', countTotal(tasks));
    updateField('numberPendingTasks', countByState(tasks, 'inProgress'));
    updateField('numberAwaitingFeedback', countByState(tasks, 'awaitFeedBack'));
    const urgent = computeUrgentStats(tasks);
    updateField('numberOfUrgent', urgent.count);
    if (urgent.date) updateField('urgentDate', urgent.date);
}
const isUrgent = (task) => {
    return (task && (task.priority || '').toLowerCase() === 'urgent');
}

const getTaskDate = (task) => {
    if (!task || !task.date) return null;
    const d = new Date(task.date);
    return isNaN(d) ? null : d;
}

const updateEarliestDate = (earliest, candidate) => {
    if (!candidate) return earliest;
    if (earliest === null || candidate < earliest) return candidate;
    return earliest;
}

const computeUrgentCount = (tasks) => {
    if (!tasks) return 0;
    let count = 0;
    for (const key in tasks) {
        if (!Object.prototype.hasOwnProperty.call(tasks, key) || key === 'position') continue;
        if (isUrgent(tasks[key])) count++;
    }
    return count;
}

const computeEarliestUrgentDate = (tasks) => {
    if (!tasks) return null;
    let earliest = null;
    for (const key in tasks) {
        if (!Object.prototype.hasOwnProperty.call(tasks, key) || key === 'position') continue;
        const d = getTaskDate(tasks[key]);
        earliest = updateEarliestDate(earliest, d);
    }
    return earliest;
}

const computeUrgentStats = (tasks) => {
    const count = computeUrgentCount(tasks);
    const earliest = computeEarliestUrgentDate(tasks);
    const formatted = earliest ? earliest.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;
    return { count, date: formatted };
}

document.addEventListener('DOMContentLoaded', () => {
    updateSummaryMetrics();
});
