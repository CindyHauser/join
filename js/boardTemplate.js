const setTaskDataStructure = (key, object) => {
    const allSubtasks = object[key].subtasks
    const subtasksArray = reconstructSubTaskArray(allSubtasks)
    return {
        "id": key,
        "title": object[key].title,
        "category": object[key].category,
        "contactSelect": object[key].contactSelect,
        "date": object[key].date,
        "description": object[key].description,
        "priority": object[key].priority,
        "state": object[key].state,
        "subtasks": subtasksArray
    }
}



const reconstructSubTaskArray = (array) => {
    let reconstructedArray = []
    if (array == undefined) {
        return []
    }
    for (let index = 0; index < array.length; index++) {
        const subtasksObject = {
            "taskDescription": array[index].taskDescription,
            "subtaskStateDone": array[index].subtaskStateDone
        }
        reconstructedArray.push(subtasksObject)
    }
    return reconstructedArray
}

const setContactCard = (subtaskCatcherCallbackBar, subtaskCatcherCallbackLabel, contactAssignedCatcherCallback, array, index) => {
    let template = `<div class="task-board-card" id="${array[index].id}" draggable="true" ondragstart="cardDragged(event)">
    <div class="task-card-inner-hug">
        <div class="task-card-header">
            <div class="task-category ${convertStringToclass(array[index].category)}">${array[index].category}</div>
        </div>
        <div class="task-card-body">
            <div class="task-card-title">
                <span>
                    ${array[index].title}
                </span>
            </div>
            <div class="task-card-description">
                <span>
                    ${array[index].description}
                </span>
            </div>
            <div class="subtask-progress-indicator">
                        ${subtaskCatcherCallbackBar(array[index].subtasks)}
                <div class="subtask-indicator-in-number">
                       ${subtaskCatcherCallbackLabel(array[index].subtasks)}
                </div>
            </div>
            <div class="task-assigned-contact-and-priority-indicator">
                ${contactAssignedCatcherCallback(array[index].contactSelect)}
                <div class="priority-indicator">
                    <img src="../assets/ui-icons/${array[index].priority}.svg" alt="${array[index].priority}">
                </div>
            </div>
        </div>
    </div>
</div>`
    return template
}

const catchZeroSubtaskForBar = (subtasks) => {
    let finishedSubtask = []
    for (let index = 0; index < subtasks.length; index++) {
        if (subtasks[index].subtaskStateDone == true) {
            finishedSubtask.push(subtasks[index])
        }
    }
    if (subtasks.length == 0) {
        return `no subtask selected yet`
    } else {
        return `    <div class="subtask-indicator-bar100">
                          <div class="subtask-indicator-bar-current" style="width: calc(${finishedSubtask.length}/${subtasks.length}*100%);"></div>
                    </div>
                `
    }
}

const catchZeroSubtaskForLabel = (subtasks) => {
    let finishedSubtask = []
    for (let index = 0; index < subtasks.length; index++) {
        if (subtasks[index].subtaskStateDone == true) {
            finishedSubtask.push(subtasks[index])
        }
    }
    if (subtasks.length == 0) {
        return ``
    } else {
        return `<span>${finishedSubtask.length}/${subtasks.length} Subtasks</span>`
    }
}

const catchZeroContact = (contact) => {
    if (contact == undefined) {
        return `<div class="assigned-contact-indicator assigned-contact-indicator-no-contact-selected">
                    <span>no contact selected yet</span>
                </div>`
    } else {
        return `    <div class="board-card-assigned-contact-badge left0" style="background-color: red;">AB</div>
                    <div class="board-card-assigned-contact-badge left1" style="background-color: green;">CD</div>
                    <div class="board-card-assigned-contact-badge left2" style="background-color: blue;">EF</div>
                    <div class="board-card-assigned-contact-badge left3" style="background-color: rgb(154, 148, 148);">
                        GH</div>`
    }

}


const convertStringToclass = (string) => {
    const stringArray = string.split(" ")
    return `${stringArray[0].toLowerCase()}-${stringArray[1].toLowerCase()}`
}

