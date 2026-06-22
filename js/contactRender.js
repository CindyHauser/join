const renderContactList = () =>{
    let contactList = document.getElementById('contactMainListParent')
    contactList.innerHTML = ''
    for (let index = 0; index < contactsArray.length; index++) {
        contactList.innerHTML += setContactCards(index,contactsArray)
    }
}