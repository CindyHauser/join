const isValidName = (name) => /^[a-zA-ZäöüÄÖÜß\s\-]{2,}$/.test(name);
const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPhone = (phone) => /^[\+]?[0-9\s\-()]{6,20}$/.test(phone);


const setObjectValidation = (input, RegexFunction) => {
    let dataStrcture = {
        "id": input.id,
        "checkvalue": RegexFunction(input.value)
    }
    return dataStrcture
}

const setValidationArray = (allInputQuerry, ObjectArray) => {
    allInputQuerry.forEach(
        (input) => {
            if ((input.id).includes('Name')) {
                ObjectArray.push(setObjectValidation(input, isValidName))
            } else if ((input.id).includes('Email')) {
                ObjectArray.push(setObjectValidation(input, isValidEmail))
            } else if (input.id.includes('Phone')) {
                ObjectArray.push(setObjectValidation(input, isValidPhone))
            }
        }
    )
    return ObjectArray
}


const ObjectArrayValidation = (arrayObject) => {
    let falseObjects = []
    for (let index = 0; index < arrayObject.length; index++) {
        if (arrayObject[index].checkvalue === false) {
            falseObjects.push(arrayObject[index].id)
        }
    }
    if (falseObjects.length == 0) {
        return true
    } else {
        return falseObjects
    }
}

const markFalsevalue = (validationCheckvalue) => {
    validationCheckvalue.forEach(
        (value) => {
            document.getElementById(`${value}ContainerError`).setAttribute('style', 'opacity:1');
            document.getElementById(`${value}`).closest('.contact-input-parent').classList.add('error-message-activated')
        }
    )
}