/**
 * Renders the complete contact list into the DOM.
 * Clears the main list container and populates it by generating HTML for each item in the global `contactsArray`.
 * 
 * @returns {void}
 */
const renderContactList = () =>{
    let contactList = document.getElementById('contactMainListParent')
    contactList.innerHTML = ''
    for (let index = 0; index < contactsArray.length; index++) {
        contactList.innerHTML += setContactCards(index,contactsArray)
    }
}