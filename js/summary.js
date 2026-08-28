const greetingUserName = document.getElementById('greetingUserName');
greetingUserName.textContent = sessionStorage.getItem("currentUserName");

const greetingUserElement = document.getElementById('greetingUser');
if (greetingUserName.textContent) {
    greetingUserElement.textContent = `,`;
}

/**
 * Returns a time-appropriate greeting string based on the given date's hour.
 * @param {Date} [date=new Date()] - The date/time used to determine the greeting.
 * @returns {string} One of "Good morning", "Good afternoon", "Good evening", or "Good night".
 */
function getGreeting(date = new Date()) {
    const h = date.getHours();
    if (h >= 5 && h < 12) return "Good morning";
    if (h >= 12 && h < 17) return "Good afternoon";
    if (h >= 17 && h < 21) return "Good evening";
    return "Good night";
}

document.querySelector('.greeting-section h3').firstChild.textContent = getGreeting();

/**
 * Fetches all tasks from the Firebase Realtime Database.
 * @returns {Promise<Object>} The tasks object, or an empty object on failure or no data.
 */
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

/**
 * Counts tasks matching a given state, ignoring the "position" key.
 * @param {Object} tasks - The tasks object keyed by task id.
 * @param {string} state - The state to match (e.g. "toDo", "done", "inProgress").
 * @returns {number} The number of tasks matching the given state.
 */
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

/**
 * Counts the total number of tasks, ignoring the "position" key.
 * @param {Object} tasks - The tasks object keyed by task id.
 * @returns {number} The total number of tasks.
 */
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

/**
 * Sets the text content of an element identified by id, if it exists.
 * @param {string} id - The id of the target DOM element.
 * @param {string|number} value - The value to set as the element's text content.
 * @returns {void}
 */
const updateField = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/**
 * Fetches tasks and updates all summary metric elements in the DOM
 * (to-do, done, total, pending, awaiting feedback, urgent count/date).
 * @returns {Promise<void>}
 */
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

/**
 * Determines whether a task has "urgent" priority (case-insensitive).
 * @param {Object} task - The task object to check.
 * @returns {boolean} True if the task's priority is "urgent".
 */
const isUrgent = (task) => {
    return (task && (task.priority || '').toLowerCase() === 'urgent');
}

/**
 * Parses a task's date string into a valid Date object.
 * @param {Object} task - The task object containing a date field.
 * @returns {Date|null} The parsed Date, or null if missing/invalid.
 */
const getTaskDate = (task) => {
    if (!task || !task.date) return null;
    const d = new Date(task.date);
    return isNaN(d) ? null : d;
}

/**
 * Returns the earlier of two dates, treating null as "no date yet".
 * @param {Date|null} earliest - The current earliest date, or null.
 * @param {Date|null} candidate - The candidate date to compare, or null.
 * @returns {Date|null} The earlier of the two dates, or the existing earliest if candidate is null.
 */
const updateEarliestDate = (earliest, candidate) => {
    if (!candidate) return earliest;
    if (earliest === null || candidate < earliest) return candidate;
    return earliest;
}

/**
 * Counts how many tasks are marked as urgent, ignoring the "position" key.
 * @param {Object} tasks - The tasks object keyed by task id.
 * @returns {number} The number of urgent tasks.
 */
const computeUrgentCount = (tasks) => {
    if (!tasks) return 0;
    let count = 0;
    for (const key in tasks) {
        if (!Object.prototype.hasOwnProperty.call(tasks, key) || key === 'position') continue;
        if (isUrgent(tasks[key])) count++;
    }
    return count;
}

/**
 * Finds the earliest date among all tasks, ignoring the "position" key.
 * @param {Object} tasks - The tasks object keyed by task id.
 * @returns {Date|null} The earliest task date found, or null if none exist.
 */
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

/**
 * Computes urgent task statistics: total count and formatted earliest date.
 * @param {Object} tasks - The tasks object keyed by task id.
 * @returns {{count: number, date: string|null}} An object with the urgent task count and its formatted earliest date (e.g. "July 28, 2026"), or null date if none exist.
 */
const computeUrgentStats = (tasks) => {
    const count = computeUrgentCount(tasks);
    const earliest = computeEarliestUrgentDate(tasks);
    const formatted = earliest ? earliest.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;
    return { count, date: formatted };
}

document.addEventListener('DOMContentLoaded', () => {
    updateSummaryMetrics();
});

document.addEventListener('DOMContentLoaded', () => {
    sessionStorage.removeItem('cameFromIndex');
    const html = document.documentElement;
    if (html.classList.contains('pending-greeting')) {
        const greetingSection = document.querySelector('.greeting-section');
        greetingSection.addEventListener('animationend', () => {
            html.classList.remove('pending-greeting');
        }, { once: true });
    }
});