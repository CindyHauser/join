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
    let template = `<div onclick="openTaskDialog('${array[index].id}')" class="task-board-card" id="${array[index].id}" draggable="true" ondragstart="cardDragged(event)">
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
                ${contactAssignedCatcherCallback(array[index].contactSelect, contactListJsonLibrary)}
                <div class="priority-indicator">
                    <img src="../assets/ui-icons/${array[index].priority}.svg" alt="${array[index].priority}">
                </div>
            </div>
        </div>
    </div>
</div>`
    return template
};

const taskDialogContentTemplate = (task, contactLibrary) => {
    let template = `
<div class="dialog-task-board-card" id="${task.id}">
    <div class="dialog-task-card-inner-hug">
        <header class="dialog-task-card-header">
            <div class="task-category ${convertStringToclass(task.category)}">${task.category}</div>
            <button type="button" onclick="toggleDialog('dialogOpenBigCard')" class="dialog-close-btn">x</button>
        </header>

        <div class="dialog-task-card-body">
            <h3 class="dialog-task-card-title">
                ${task.title}
            </h3>
            <p class="dialog-task-card-description">
                ${task.description}
            </p>

            <section>
                <span class="dialog-task-card-distance dialog-task-card-color">Due Date: </span> <span>${task.date}</span>         
            </section>

            <section>
                <span class="dialog-task-card-distance dialog-task-card-color">Priority: </span> <span>${task.priority[0].charAt(0).toUpperCase() + task.priority.slice(1)}
                        <img src="../assets/ui-icons/${task.priority}.svg" alt="${task.priority}"></span>
            </section>
            
            
            <section class="dialog-task-card-contacts">
                <p class="dialog-task-card-color">Assigned To:</p>
                ${renderDialogAssignedContacts(task.contactSelect, contactLibrary)}
            </section>

            <section>
             <p class="dialog-task-card-color">Subtasks</p>
              <div class="dialog-subtasks">
                 ${dialogSubtask(task.subtasks)}
              </div>
            </section>

        </div>
            <footer class="dialog-task-card-footer">
                <button class="dialog-task-card-btn"><img src="../assets/ui-icons/delete.svg" alt="delete Button"> Delete</button>
                <button class="dialog-task-card-btn border-left-btn" onclick="openEditTaskDialog(${JSON.stringify(task).replace(/"/g, '&quot;')})"><img src="../assets/ui-icons/edit.svg" alt="edit Button"> Edit</button>
            </footer>

    </div>`
    return template
}

const taskDialogEditContentTemplate = (task, contactLibrary) => {
    let template = `
    <div class="closeButton">
                <button type="button" onclick="toggleDialog('dialogEditTask')"
                    class="add-task-button btn-secondary">x</button>
            </div>

            <form class="add-task-form" id="editTaskForm" onsubmit="submitEditTask(event, this)" novalidate>
                <div class="dialog-edit-form">
                    <div class="add-task align-start">
                        <div class="form-inputs">
                            <label class="required" for="editTitle">Title</label>
                            <input type="text" id="editTitle" name="editTitle" placeholder="Enter a Title" value="${task.title}" required
                                data-error="Title is required">
                        </div>
                        <div class="form-inputs">
                            <label for="editDescription">Description</label>
                            <textarea name="editDescription" id="editDescription" placeholder="Enter a Description">${task.description}</textarea>
                        </div>
                        <div class="form-inputs">
                            <label class="required" for="editDate">Due date</label>
                            <input type="date" id="editDate" name="editDate" placeholder="dd/mm/yyyy" value="${task.date}" required
                                data-error="Date is required">
                        </div>
                        <fieldset>
                            <legend>Priority</legend>

                            <div class="priority-options">
                                <button type="button" class="priority-btn urgent" onclick="selectPriority(this)">
                                    Urgent <img src="../assets/ui-icons/urgent.svg" alt="urgent.svg">
                                </button>
                                <button type="button" class="priority-btn medium" onclick="selectPriority(this)">
                                    Medium <img src="../assets/ui-icons/medium.svg" alt="medium.svg">
                                </button>
                                <button type="button" class="priority-btn low" onclick="selectPriority(this)">
                                    Low <img src="../assets/ui-icons/low.svg" alt="low.svg">
                                </button>
                            </div>
                        </fieldset>
                        <div class="form-inputs contact-form">
                            <label for="contactInputEdit" id="assignedToLabel"
                                onclick="assignedToLabelClicked(event)">Assigned to</label>
                            <div class="contact-list-input-container" onclick="initInputContainer(this)">
                                <input type="text" placeholder="Select contact to assign"
                                    onfocus="initInput(this,event)" onblur="finishedInput(this,event)" id="contactInputEdit"
                                    oninput="initContactListSearch(this,event)">
                                <img src="../assets/ui-icons/arrow-down.svg" alt="arrow.svg">
                            </div>
                            <div id="contactInputListEdit" onmousedown="contactInputListClicked(event)"></div>
                            <div id="selectedContactFieldEdit"></div>
                        </div>
                        <div class="form-inputs">
                            <label class="required" for="categoryEdit">Category</label>
                            <select required name="category" id="categoryEdit" data-error="Category is required">
                                <option value="" selected hidden>Select task Category</option>
                                <option value="Technical Task">Technical Task</option>
                                <option value="User Story">User Story</option>
                            </select>
                        </div>
                        <div class="form-inputs">
                            <label for="editSubtask">Subtask</label>
                            <input type="text" id="editSubtask" name="editSubtasks" placeholder="Add subtasks with Enter" onkeydown="editSubtask(event,'${task.id}')">
                            <ul id="editSubtaskDescription">${dialogSubtask(task.subtasks, true)}</ul>
                        </div>
                    </div>
                </div>
                <div class="add-task-footer-dialog">
                    <p class="required">This field is required</p>
                    <div class="add-task-buttons">
                        <button type="submit" class="add-task-button btn-main">Ok<img src="../assets/ui-icons/check.svg"
                                alt="check.svg"></button>
                    </div>

                </div>
            </form>`
    return template
}


const dialogSubtask = (subtasks, editTask) => {
    let dialogSubtaskArray = [];
    if (subtasks.length == 0) {
        return ``
    } else {
        for (let index = 0; index < subtasks.length; index++) {
            dialogSubtaskArray.push(subtasks[index].taskDescription)
        }
        if (editTask) {
            return dialogSubtaskArray.map(element => `<li data-value="${dialogSubtaskArray.indexOf(element)}">${element}</li>`).join("")
        }
        return dialogSubtaskArray.map(element => `<p class="input-label"><input class="checkbox" type="checkbox" id="${element}" data-value="${dialogSubtaskArray.indexOf(element)}">
       <label class="dialog-task-card-checkbox-label" for="${element}">${element}</label></p>`).join("")
    }
};

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

const createDialogAssignedContactMarkup = (contactId, library) => {
    const contactData = library[contactId]
    if (!contactData) {
        return ''
    };

    const initials = `${contactData.fornameFirstLetter.toUpperCase()}${contactData.surnameFirstLetter.toUpperCase()}`
    return `
        <div class="dialog-assigned-contact-item">
            <div class="dialog-assigned-contact-badge" 
            style="background-color: rgb(${contactData.badgeColor[0]}, ${contactData.badgeColor[1]}, ${contactData.badgeColor[2]});">${initials}</div>
            <span>${contactData.forename} ${contactData.surname}</span>
        </div>
    `
};

const renderDialogAssignedContacts = (contact, library) => {
    if (contact == undefined || contact.length == 0) {
        return `<div class="dialog-assigned-contact-indicator">
                    <span>no contact selected yet</span>
                </div>`
    };

    const contactSelectInnerHtml = contact.map(contactId => createDialogAssignedContactMarkup(contactId, library)).join('')
    return ` <div class="dialog-assigned-contact-indicator">
                    ${contactSelectInnerHtml}
                </div>`
};

const catchZeroContact = (contact, library) => {
    if (contact == undefined) {
        return `<div class="assigned-contact-indicator assigned-contact-indicator-no-contact-selected">
                    <span>no contact selected yet</span>
                </div>`
    } else if (contact.length >= 4) {
        return catchContactAssignedLength3(contact, library)
    } else {
        return catchContactAssignedLengthMoreThan3(contact, library)
    }
}

const catchContactAssignedLength3 = (contact, library) => {
    let contactSelectInnerHtml = ''
    for (let index = 0; index < 3; index++) {
        contactSelectInnerHtml += `<div class="board-card-assigned-contact-badge left${index}" style="background-color: rgb(${library[contact[index]].badgeColor[0]}, ${library[contact[index]].badgeColor[1]}, ${library[contact[index]].badgeColor[2]});">${library[contact[index]].fornameFirstLetter}${library[contact[index]].surnameFirstLetter}</div>`
    }
    return ` <div class="assigned-contact-indicator">
                    ${contactSelectInnerHtml}
                    <div class="board-card-assigned-contact-badge left3" style="background-color: rgb(154, 148, 148);">+${contact.length - 3}</div>
                </div>`

}

const catchContactAssignedLengthMoreThan3 = (contact, library) => {
    let contactSelectInnerHtml = ''
    for (let index = 0; index < contact.length; index++) {
        contactSelectInnerHtml += `<div class="board-card-assigned-contact-badge left${index}" style="background-color: rgb(${library[contact[index]].badgeColor[0]}, ${library[contact[index]].badgeColor[1]}, ${library[contact[index]].badgeColor[2]});">${library[contact[index]].fornameFirstLetter}${library[contact[index]].surnameFirstLetter}</div>`
    }
    return ` <div class="assigned-contact-indicator">
                    ${contactSelectInnerHtml}
                </div>`
}


const convertStringToclass = (string) => {
    const stringArray = string.split(" ")
    return `${stringArray[0].toLowerCase()}-${stringArray[1].toLowerCase()}`
}

