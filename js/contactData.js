let contactListJsonArray = ''

const BASE_URL = "https://join3195-7c673-default-rtdb.europe-west1.firebasedatabase.app/"

const setArrayForFirebaseInit = async () => {
    const response = await fetch('../mock-data/contact-list.json')
    contactListJsonArray = response.json()
    return contactListJsonArray
}

const postContactDataToFireBase = async (path, data = {}) => {
    const response = await fetch(BASE_URL + path + ".json",
        {
            method: "POST",
            header: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    )
    return await response.json()

}


