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