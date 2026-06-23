const clicked = (element) => {
    const container = element
    const expandedContactField = document.getElementById('contactCardExpandedRenderTarget')
    refreshmarksOnContactCards()
    container.classList.add('contact-member-selected')
    expandedContactField.innerHTML = setExpandedContactcardsTemplate(element.id, contactListJsonLibrary)
    addEnteranceEffect(expandedContactField, 450)


}

const refreshmarksOnContactCards = () => {
    const memberCards = document.querySelectorAll('.contacts-member')
    memberCards.forEach(
        (card) => {
            card.classList.remove('contact-member-selected')
        }
    )
}

const setEventBubbling = (event) => {
    event.stopPropagation()
}

const closeExpandingCards = () => {
    refreshmarksOnContactCards()
    document.getElementById('contactCardExpandedRenderTarget').innerHTML = ''
}

const addEnteranceEffect = (container, transitionTime) => {
    container.classList.add('fade-in-effect-on')
    setTimeout(() => {
        container.classList.remove('fade-in-effect-on')
    }, transitionTime + 100)
}

const deleteContact = async (id) => {
    await deleteContactDataFromFireBase("/contact/" + `${id}`)
    closeExpandingCards()
    await initContactPage()
}