let contactListJsonLibrary = ''
const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"
let contactsArray = []



const postMethode = (data) => {
    const methode = {
        method: "POST",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    return methode
}

const deleteMethode = (data) => {
    const methode = {
        method: "DELETE"
    }
    return methode
}

const putMethode = (data) => {
    const methode = {
        method: "PUT",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    return methode
}




const getLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/contact" + ".json")
    return response.json()
}

const setLibraryForFirebaseInit = async () => {
    contactListJsonLibrary = await getLibraryForFirebaseInit()
    return
}

const postContactDataToFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json", postMethode(data))
    return await response.json()
}

const putContactDataToFireBase = async (path,id, data = {}) => {
    const response = await fetch(BASE_URL + path +id+ ".json", putMethode(data))
    return await response.json()
}

const deleteContactDataFromFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json", deleteMethode(data))
    return await response.json()
}

const getPreldudeContactArray = (object) => {
    let preludeContactArray = []
    for (key in object) {
        if (key != "position") {
            preludeContactArray.push(setPreludeContactArrayStructure(key, object))
        }
    }
    return preludeContactArray.sort(
        (a, b) => a.forename.localeCompare(b.forename)
    )
}


const getContactsArray = () => {
    contactsArray = []
    let fornameFirstLetter = ''
    const preludeArray = getPreldudeContactArray(contactListJsonLibrary)
    for (let index = 0; index < preludeArray.length; index++) {
        if (preludeArray[index].fornameFirstLetter.toLowerCase() != fornameFirstLetter.toLowerCase()) {
            contactsArray.push(preludeArray[index].fornameFirstLetter)
            fornameFirstLetter = preludeArray[index].fornameFirstLetter
        }
        contactsArray.push(preludeArray[index])
    }
    return contactsArray
}


