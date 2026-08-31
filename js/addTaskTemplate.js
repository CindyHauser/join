/**
 * Creates a selectable contact entry in the assignment list.
 *
 * @param {Object} contact - The contact object to render.
 * @param {string} checkedAttr - The HTML attribute for the checked state of the checkbox.
 * @returns {string} HTML markup for one contact selection row.
 */
function getContactListCard(contact, checkedAttr) {
    return `<div class="contact-input-class-card" onclick="contactSelected(this)">
                <div class="input-name-and-badge">
                <div class="contact-input-badge" style="background-color: rgb(${contact.badgeColor[0]},${contact.badgeColor[1]},${contact.badgeColor[2]});">${contact.fornameFirstLetter}${contact.surnameFirstLetter}</div>
                <div class="contact-input-name"> ${contact.forename} ${contact.surname}</div>
                </div>
                <input ${checkedAttr} onclick="contactSelectedCheckbox(this)" type="checkbox" name="${contact.forename} ${contact.surname}" id=${contact.id} class="checkbox">
                </div>`;
}

/**
 * Builds a badge for a selected contact in the assignment field.
 *
 * @param {Object} contact - The selected contact object.
 * @returns {string} HTML markup for the contact badge.
 */
function getSelectedContactBadge(contact) {
    return `<div class="contact-input-badge" style="background-color: rgb(${contact.badgeColor[0]},${contact.badgeColor[1]},${contact.badgeColor[2]});">${contact.fornameFirstLetter}${contact.surnameFirstLetter}</div>`;
}

/**
 * Creates an overflow badge showing how many additional contacts are hidden.
 *
 * @param {number} remainingCount - Number of hidden contacts beyond the visible ones.
 * @returns {string} HTML markup for the overflow badge.
 */
function getMoreBadgeHtml(remainingCount) {
    return `<div class="contact-input-badge">+${remainingCount}</div>`;
}

/**
 * Creates a rendered list item for a subtask in the add-task form.
 *
 * @param {string} subtask - The subtask description text.
 * @param {number} i - The index of the subtask.
 * @returns {string} HTML markup for a subtask list item.
 */
function subtaskItemTemplate(subtask, i) {
    return `<li class="subtask-preview-item subtask-actions" data-index="${i}">
        <span class="subtask-text">${subtask}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="editSubtask(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="deleteSubtask(this)">
    </li>`;
}

/**
 * Creates the editable inner content of a subtask item.
 *
 * @param {string} value - The current subtask description.
 * @returns {string} HTML markup for the editable subtask text and action icons.
 */
function subtaskListItemInnerTemplate(value) {
    return `<span class="editSubtaskText subtask-text">${value}</span>
        <img class="subtask-icon subtask-edit" src="../assets/ui-icons/edit.svg" alt="Edit subtask" onclick="handleEditClick(this)">
        <img class="subtask-icon subtask-delete" src="../assets/ui-icons/delete.svg" alt="Delete subtask" onclick="handleDeleteClick(this)">`;
}