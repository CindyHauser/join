let taskListJsonLibrary = ''
let contactListJsonLibrary = ''
const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"
let contactsArray = []
let generalTaskArray = []
let toDoTaskArray = []
let inProgressTaskArray = []
let awaitFeedbackTaskArray = []
let doneTaskArray = []

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

const getContactLibraryForFirebaseInit = async () => {
    const response = await fetch(BASE_URL + "/contact" + ".json")
    return response.json()
}

const setContactLibraryForFirebaseInit = async () => {
    contactListJsonLibrary = await getContactLibraryForFirebaseInit()
    return
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
    const response = await fetch(BASE_URL + "/task/" + `${id}` + ".json", putMethode(data))
    return await response.json()
}

const putTaskDataToFireBaseOnDrop = async (id, data) => {
    const response = await fetch(BASE_URL + "/task/" + `${id}` + "/state/" + ".json", putMethode(data))
    return await response.json()
}

const deleteTaskDataFromFireBase = async (id, data = {}) => {
    const response = await fetch(BASE_URL + "/task/" + `${id}` + ".json", deleteMethode())
    return await response.json()
}


const getPreludeGeneralTaskArray = (objectLibrary, callbackFn) => {
    let preludeGeneralTaskArray = []
    for (key in objectLibrary) {
        if (key != "position") {
            preludeGeneralTaskArray.push(callbackFn(key, objectLibrary))
        }
    }
    return preludeGeneralTaskArray
}

const getToDoArray = () => {
    let preludeArray = []
    for (let index = 0; index < generalTaskArray.length; index++) {
        if (generalTaskArray[index].state === "toDo") {
            preludeArray.push(generalTaskArray[index])
        }
    }
    toDoTaskArray = preludeArray
}

const getInProgressArray = () => {
    let preludeArray = []
    for (let index = 0; index < generalTaskArray.length; index++) {
        if (generalTaskArray[index].state === "inProgress") {
            preludeArray.push(generalTaskArray[index])
        }
    }
    inProgressTaskArray = preludeArray
}

const getAwaitFeedbackArray = () => {
    let preludeArray = []
    for (let index = 0; index < generalTaskArray.length; index++) {
        if (generalTaskArray[index].state === "awaitFeedBack") {
            preludeArray.push(generalTaskArray[index])
        }
    }
    awaitFeedbackTaskArray = preludeArray
}

const getDoneTaskArray = () => {
    let preludeArray = []
    for (let index = 0; index < generalTaskArray.length; index++) {
        if (generalTaskArray[index].state === "done") {
            preludeArray.push(generalTaskArray[index])
        }
    }
    doneTaskArray = preludeArray
}

const getGeneralTaskArray = (objectLibrary, callbackFn, callbackFn2) => {
    generalTaskArray = callbackFn2(objectLibrary, callbackFn)
}


