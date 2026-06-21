const renderContactList = () =>{
    let contactListInnerHtml = ''
    for (let index = 0; index < contactsArray.length; index++) {
        contactListInnerHtml += setContactCards(index,contactsArray)
    }
    document.getElementById('contactMainListParent').innerHTML = contactListInnerHtml
}