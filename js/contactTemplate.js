/**
 * @typedef {Object} ContactTemplate
 * @property {string|number} id - The unique identifier of the contact.
 * @property {string} forename - The first name of the contact.
 * @property {string} surname - The last name of the contact.
 * @property {string} phone - The contact's phone number.
 * @property {string} fornameFirstLetter - Initial of the first name.
 * @property {string} surnameFirstLetter - Initial of the last name.
 * @property {string} email - The contact's email address.
 * @property {string} badgeColor - Color value for UI badges.
 */

/**
 * Maps raw object data into a standardized ContactTemplate structure.
 *
 * @param {string|number} key - The unique identifier/key of the contact.
 * @param {Object.<string, Object>} object - The dictionary object containing contact entries.
 * @returns {ContactTemplate} The formatted contact object.
 */
const setPreludeContactArrayStructure = (key, object) => {
    let template = {
        "id": key,
        "forename": object[key].forename,
        "surname": object[key].surname,
        "phone": object[key].phone,
        "fornameFirstLetter": object[key].fornameFirstLetter,
        "surnameFirstLetter": object[key].surnameFirstLetter,
        "email": object[key].email,
        "badgeColor": object[key].badgeColor
    }
    return template
}

/**
 * Parses a raw name string and formats it based on the number of word tokens.
 * It trims whitespace, splits the string into an array of words, and delegates 
 * the formatting to specific helper functions depending on the word count.
 *
 * @param {string} name - The raw input string containing the person's name.
 * @returns {Object} A structured object containing the processed and formatted name data.
 */
const setName = (name) => {
    let output = name.trim()
    output = output.split(" ")
    if (output.length == 1) {
        output = setObjectSingleName(output)
    } else if (output.length == 2) {
        output = setObjectDoubleName(output)
    } else if (output.length > 2) {
        output = setTripleAndMoreName(output)
    }
    return output
}

/**
 * Constructs a structured name object from a single-element array.
 * Since only one name token is provided, it assigns this value to both 
 * the first name and the second name properties to maintain data consistency.
 *
 * @param {string[]} array - An array containing a single name string token.
 * @returns {Object} A structured object containing the mapped name.
 * @returns {string} return.firstName - The provided single name.
 * @returns {string} return.secondName - The provided single name (duplicated).
 */
const setObjectSingleName = (array) => {
    return {
        "firstName": array[0],
        "secondName": array[0]
    }
}

/**
 * Constructs a structured name object from a two-element array.
 * Maps the first array element to the first name and the second element 
 * to the second (last) name.
 *
 * @param {string[]} array - An array containing exactly two name string tokens.
 * @returns {Object} A structured object containing the mapped name.
 * @returns {string} return.firstName - The first name extracted from the array.
 * @returns {string} return.secondName - The second (last) name extracted from the array.
 */
const setObjectDoubleName = (array) => {
    return {
        "firstName": array[0],
        "secondName": array[1]
    }
}

/**
 * Constructs a structured name object from an array with three or more elements.
 * Assigns the first element as the first name, and concatenates the second element 
 * with the very last element to form the second (last) name. 
 * Note: Any intermediate tokens between the second and the last element are ignored.
 *
 * @param {string[]} array - An array containing three or more name string tokens.
 * @returns {Object} A structured object containing the mapped name.
 * @returns {string} return.firstName - The first name (first element of the array).
 * @returns {string} return.secondName - A string combining the second and the last element of the array.
 */
const setTripleAndMoreName = (array) => {
    return {
        "firstName": array[0],
        "secondName": array[1] + " " + array[array.length - 1]
    }
}

/**
 * Generates a random RGB color.
 * Calculates three random integers between 0 and 255 to represent the Red, Green, and Blue color channels.
 *
 * @returns {number[]} An array containing exactly three numbers representing the RGB values [R, G, B].
 */
const setBadgeColor = () => {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
}

/**
 * Processes input data to construct a comprehensive and formatted contact object.
 * Utilizes a callback function to extract raw values from an array, parses the name 
 * via the `setName` helper, and generates a random RGB color for the UI badge.
 *
 * @param {Function} getAllValue - A callback function that extracts raw data (name, phone, email) from the provided array.
 * @param {Array} array - The input array (e.g., form fields or raw data) to be processed by the callback.
 * @returns {Object} A structured object containing the fully processed contact details.
 * @returns {string} return.forename - The processed first name.
 * @returns {string} return.surname - The processed second (last) name.
 * @returns {string} return.phone - The contact's phone number.
 * @returns {string} return.fornameFirstLetter - The initial letter of the first name.
 * @returns {string} return.surnameFirstLetter - The initial letter of the last name.
 * @returns {string} return.email - The contact's email address.
 * @returns {number[]} return.badgeColor - An array of three RGB values [R, G, B] for the UI badge.
 */
const setUpContactData = (getAllValue, array) => {
    let values = getAllValue(array)
    return {
        "forename": setName(getAllValue(array).name).firstName,
        "surname": setName(getAllValue(array).name).secondName,
        "phone": getAllValue(array).phone,
        "fornameFirstLetter": setName(getAllValue(array).name).firstName[0],
        "surnameFirstLetter": setName(getAllValue(array).name).secondName[0],
        "email": getAllValue(array).email,
        "badgeColor": setBadgeColor()
    }
}

/**
 * Populates the edit contact form and UI elements with the provided contact data.
 * Updates the input fields for name, phone, and email, and configures the visual 
 * representation of the contact's initial badge (background color and text).
 *
 * @param {string} nameInputId - The DOM element ID of the name input field.
 * @param {string} phoneInputId - The DOM element ID of the phone input field.
 * @param {string} emailInputId - The DOM element ID of the email input field.
 * @param {string} initialBadgeId - The DOM element ID of the visual badge element.
 * @param {string} name - The contact's name to be set in the name input.
 * @param {string} email - The contact's email address to be set in the email input.
 * @param {string} phone - The contact's phone number to be set in the phone input.
 * @param {number[]} colorArray - An array of three RGB values [R, G, B] for the badge's background color.
 * @param {string} fornameFirstLetter - The initial letter of the contact's first name.
 * @param {string} surnameFirstLetter - The initial letter of the contact's last name.
 */
const setAllEditContactInputs = (
    nameInputId, phoneInputId, emailInputId, initialBadgeId, name, email, phone, colorArray,
    fornameFirstLetter, surnameFirstLetter
) => {
    document.getElementById(nameInputId).value = name
    document.getElementById(phoneInputId).value = phone
    document.getElementById(emailInputId).value = email
    document.getElementById(initialBadgeId).style.backgroundColor = `rgba(${colorArray[0]},${colorArray[1]},${colorArray[2]})`
    document.getElementById(initialBadgeId).innerText = `${fornameFirstLetter.toUpperCase()}${surnameFirstLetter.toUpperCase()}`
}

/**
 * Generates the HTML markup for a contact list item based on its data type.
 * If the item at the specified index is a string, it renders a letter divider 
 * (used for alphabetical grouping). Otherwise, it renders a full contact card 
 * containing the user's initials badge, name, and email.
 *
 * @param {number} index - The current index of the item being processed.
 * @param {Array<string|Object>} array - The array containing both alphabetical string dividers and structured contact objects.
 * @returns {string} The generated HTML template string to be injected into the DOM.
 */
const setContactCards = (index, array) => {
    let template;
    if (typeof array[index] === 'string') {
        template = `<div class="contact-card letter-border">
                        <div class="leter-border-letter-box" aria-label="${(array[index].toUpperCase())}">${(array[index].toUpperCase())}</div>
                        <div class="letter-border-line"></div>
                    </div>`
    } else {
        template = `<div class="contact-card contacts-member" id="${array[index].id}" onclick="clicked(this)">
                        <div aria-label="${array[index].fornameFirstLetter.toUpperCase()}${array[index].surnameFirstLetter.toUpperCase()}" class="contacts-member-circle-initial" style="background-color: rgba(${array[index].badgeColor[0]}, ${array[index].badgeColor[1]}, ${array[index].badgeColor[2]}, 1);"><span>${array[index].fornameFirstLetter.toUpperCase()}${array[index].surnameFirstLetter.toUpperCase()}</span></div>
                        <div class="contacts-member-name-and-email-parent">
                            <div aria-label="${array[index].forename} ${array[index].surname}" class="contacts-member-name"><span>${array[index].forename} ${array[index].surname}</span></div>
                            <div aria-label="${array[index].email}"  class="contacts-member-email"><span>${array[index].email}</span></div>
                        </div>
                    </div>`
    }
    return template
}

/**
 * Generates the HTML markup for the expanded (detailed) view of a specific contact.
 * Looks up the contact's data in the provided library using the unique ID and populates 
 * a comprehensive UI card that includes the user's initials badge, full name, functional 
 * action buttons (edit/delete), and clickable contact links (email and phone).
 *
 * @param {string|number} id - The unique identifier used to look up the specific contact.
 * @param {Object.<string, Object>} library - The data dictionary/object containing all contact records.
 * @returns {string} The generated HTML template string for the expanded contact card.
 */
const setExpandedContactcardsTemplate = (id, library) => {
    let template;
    template = `<div class="contact-main-expanded-card">
    <div class="contact-expanded-name-and-functions">
        <div aria-label="${library[id].fornameFirstLetter.toUpperCase()}${library[id].surnameFirstLetter.toUpperCase()}" class="contacts-member-circle-initial-expanded"style="background-color: rgba(${library[id].badgeColor[0]}, ${library[id].badgeColor[1]}, ${library[id].badgeColor[2]}, 1);">${library[id].fornameFirstLetter.toUpperCase()}${library[id].surnameFirstLetter.toUpperCase()}</div>
        <div class="contacts-member-name-and-functions-expanded">
            <div aria-label="${library[id].forename} ${library[id].surname}" class="contacts-member-name-expanded">${library[id].forename} ${library[id].surname}</div>
            <div class="contacts-member-functions" onclick="setEventBubbling(event)">
              <button aria-label=" edit contact ${library[id].forename} ${library[id].surname}" class="edit-delete-btns" onclick="initEditContact('${id}')" id="editBtnContact">
                <img src="../assets/ui-icons/edit.svg" alt="edit.svg">
                <span>Edit</span>
              </button>
              <button aria-label=" delete contact ${library[id].forename} ${library[id].surname}" class="edit-delete-btns" onclick="deleteContact('${id}')" id="deleteBtnContact">
                <img  src="../assets/ui-icons/delete.svg" alt="delete.svg">
                <span>Delete</span>
              </button>
            </div>
        </div>
    </div>
    <div class="contact-info-txt"><span>Contact Information</span></div>
    <div class="contact-telephone-and-email-parent" onclick="setEventBubbling(event)">
        <div aria-label="beginning Email text section" class="contact-email-txt"><span>Email</span></div>
        <div onclick="hideFunctionsMenu()" aria-label="contact email is ${library[id].email}" class="contact-email" id="contactEmail"><a href="mailto:${library[id].email}">${library[id].email}</a></div>
        <div aria-label="beginning Phone text section" class="contact-phone-txt"><span>Phone</span></div>
        <div onclick="hideFunctionsMenu()" aria-label="contact phone is ${library[id].phone}" class="contact-phone" id="contactPhone"><a href="tel:${library[id].phone}">${library[id].phone}</a></div>
    </div>
</div>`
    return template
}