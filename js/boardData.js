let taskListJsonLibrary = ''
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

const deleteMethode = () => {
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

const getTaskLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/task" + ".json")
    return response.json()
}

const setTaskLibraryForFirebaseInit = async () => {
    taskListJsonLibrary = await getTaskLibraryForFirebaseInit()
    return
}

const postTaskDataToFireBase = async (data = {}) => {
    const response = await fetch(BASE_URL + "/task" + ".json", postMethode(data))
    return await response.json()
}

const putTaskDataToFireBase = async (id, data = {}) => {
    const response = await fetch(BASE_URL + "/task/" +`${id}`+ ".json", putMethode(data))
    return await response.json()
}

const deleteTaskDataFromFireBase = async (id, data = {}) => {
    const response = await fetch(BASE_URL + "/task/" +`${id}`+ ".json", deleteMethode())
    return await response.json()
}


