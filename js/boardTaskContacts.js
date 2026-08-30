/**
 * Builds the markup for a single assigned contact in the dialog view.
 *
 * @param {string} contactId - The contact identifier.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the contact entry.
 */
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

/**
 * Builds the compact contact markup used in edit mode for dialogs.
 *
 * @param {string} contactId - The contact identifier.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the compact contact badge.
 */
const createDialogAssignedContactMarkupEdit = (contactId, library) => {
    const contactData = library[contactId]
    if (!contactData) {
        return ''
    };
    const initials = `${contactData.fornameFirstLetter.toUpperCase()}${contactData.surnameFirstLetter.toUpperCase()}`
    return `
        <div class="dialog-assigned-contact-item">
            <div class="dialog-assigned-contact-badge" 
            style="background-color: rgb(${contactData.badgeColor[0]}, ${contactData.badgeColor[1]}, ${contactData.badgeColor[2]});">${initials}</div>
        </div>
    `
};

/**
 * Renders the assigned contacts for the dialog view.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup that displays the assigned contacts or a placeholder.
 */
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

/**
 * Renders the compact assigned contact list used during editing.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup that displays the assigned contacts or a placeholder.
 */
const renderDialogAssignedContactsEdit = (contact, library) => {
    if (contact == undefined || contact.length == 0) {
        return `  <span>no contact selected yet</span>
                `
    };
    const contactSelectInnerHtml = setContactSelectInnerHtmlAssignedContactsEdit(contact, library)
    return ` ${contactSelectInnerHtml}`
};

/**
 * Determines and generates the HTML markup for the assigned contacts in the edit task dialog.
 * If more than 4 contacts are assigned, it delegates to a helper function to show the first 4 
 * along with an overflow badge. Otherwise, it renders all assigned contacts directly.
 * 
 * @param {Array} contact - An array of the currently assigned contact IDs or objects.
 * @param {Object|Array} library - The data library containing full contact details.
 * @returns {string} The generated HTML string for displaying the assigned contacts.
 */
const setContactSelectInnerHtmlAssignedContactsEdit = (contact, library) => {
    if (contact.length > 4) {
        return selectedContactsToEdit(contact, library)
    }
    return contact.map(contactId => createDialogAssignedContactMarkupEdit(contactId, library)).join('')
}

/**
 * Generates the HTML markup for displaying assigned contacts in the edit task dialog.
 * Creates the visual representations for up to the first 4 contacts and appends 
 * a badge indicating the number of additional contacts if the total exceeds 4.
 * 
 * @param {Array} contact - An array of the currently selected or assigned contacts.
 * @param {Object|Array} library - The complete contact library used to fetch specific contact details.
 * @returns {string} The combined HTML string containing the assigned contacts and the overflow badge.
 */
const selectedContactsToEdit = (contact, library) => {
    let template = ''
    for (let index = 0; index < 4; index++) {
        template += createDialogAssignedContactMarkupEdit(contact[index], library)
    }
    return template + buildMoreBadgeHtmlEditTask(contact.length, 4)
}

/**
 * Generates the HTML for a "+X" badge when the number of items exceeds the maximum visible limit.
 * Calculates the difference between the total items and the maximum visible items. 
 * If there are remaining items, it returns a badge containing the surplus count; otherwise, it returns an empty string.
 * 
 * @param {number} total - The total number of items (e.g., assigned contacts).
 * @param {number} maxVisible - The maximum number of items allowed to be displayed.
 * @returns {string} The HTML string representing the "+X" badge, or an empty string if no extra items exist.
 */
const buildMoreBadgeHtmlEditTask = (total, maxVisible) => {
    const remaining = total - maxVisible;
    return remaining > 0 ? `<div class="dialog-assigned-contact-item">
                            <div class="contact-input-badge">+${remaining}</div>
                            </div>` : '';
};

/**
 * Returns the appropriate contact badge markup depending on the number of assigned contacts.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the contact indicators.
 */
const catchZeroContact = (contact, library) => {
    if (contact == undefined) {
        return `<div class="assigned-contact-indicator assigned-contact-indicator-no-contact-selected">
                </div>`
    } else if (contact.length >= 4) {
        return catchContactAssignedLengthMoreThan3(contact, library)
    } else {
        return catchContactAssignedLength3(contact, library)
    }
}

/**
 * Builds the compact contact preview for a task with up to three assigned contacts.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the preview.
 */
const catchContactAssignedLengthMoreThan3 = (contact, library) => {
    let contactSelectInnerHtml = ''
    for (let index = 0; index < 3; index++) {
        contactSelectInnerHtml += `<div class="board-card-assigned-contact-badge left${index}" style="background-color: rgb(${library[contact[index]].badgeColor[0]}, ${library[contact[index]].badgeColor[1]}, 
        ${library[contact[index]].badgeColor[2]});">${library[contact[index]].fornameFirstLetter}${library[contact[index]].surnameFirstLetter}</div>`
    }
    return ` <div class="assigned-contact-indicator">
                    ${contactSelectInnerHtml}
                    <div class="board-card-assigned-contact-badge left3" style="background-color: rgb(154, 148, 148);">+${contact.length - 3}</div>
                </div>`
}

/**
 * Builds the contact preview for tasks with fewer than four assigned contacts.
 *
 * @param {Array<string>} contact - The list of assigned contact identifiers.
 * @param {Object<string, Object>} library - The contact library used for lookup.
 * @returns {string} HTML markup for the preview.
 */
const catchContactAssignedLength3 = (contact, library) => {
    let contactSelectInnerHtml = ''
    for (let index = 0; index < contact.length; index++) {
        contactSelectInnerHtml += `<div class="board-card-assigned-contact-badge left${index}" style="background-color: rgb(${library[contact[index]].badgeColor[0]}, 
        ${library[contact[index]].badgeColor[1]}, ${library[contact[index]].badgeColor[2]});">
        ${library[contact[index]].fornameFirstLetter}${library[contact[index]].surnameFirstLetter}</div>`
    }
    return ` <div class="assigned-contact-indicator">
                    ${contactSelectInnerHtml}
                </div>`
}