function getContactListCard(contact, checkedAttr) {
    return `<div class="contact-input-class-card" onclick="contactSelected(this)">
                <div class="input-name-and-badge">
                <div class="contact-input-badge" style="background-color: rgb(${contact.badgeColor[0]},${contact.badgeColor[1]},${contact.badgeColor[2]});">${contact.fornameFirstLetter}${contact.surnameFirstLetter}</div>
                <div class="contact-input-name"> ${contact.forename} ${contact.surname}</div>
                </div>
                <input ${checkedAttr} onclick="contactSelectedCheckbox(this)" type="checkbox" name="${contact.forename} ${contact.surname}" id=${contact.id} class="checkbox">
                </div>`;
}

function getSelectedContactBadge(contact) {
    return `<div class="contact-input-badge" style="background-color: rgb(${contact.badgeColor[0]},${contact.badgeColor[1]},${contact.badgeColor[2]});">${contact.fornameFirstLetter}${contact.surnameFirstLetter}</div>`;
}

function getMoreBadgeHtml(remainingCount) {
    return `<div class="contact-input-badge">+${remainingCount}</div>`;
}

function subtaskItemTemplate(subtask, i) {
    return `<li class="subtask-preview-item subtask-actions" data-index="${i}">
        <span class="subtask-text">${subtask}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="editSubtask(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="deleteSubtask(this)">
    </li>`;
}

function subtaskListItemInnerTemplate(value) {
    return `<span class="editSubtaskText subtask-text">${value}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="handleEditClick(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="handleDeleteClick(this)">`;
}