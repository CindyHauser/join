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
    const contactSelectInnerHtml = contact.map(contactId => createDialogAssignedContactMarkupEdit(contactId, library)).join('')
    return ` ${contactSelectInnerHtml}`
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
                    <span>no contact selected yet</span>
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