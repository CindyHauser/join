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


const setName = (name) => {
    let output = name.trim()
    output = output.split(" ")
    if (output.length == 1) {
        output = setObjectSingleName(output)
    } else if (output.length == 2) {
        output = setObjectDoubleName(output)
    } else if (output.length > 2) {
        output = setTripleAndMoreName(output)
    }
    return output
}


const setObjectSingleName = (array) => {
    return {
        "firstName": array[0],
        "secondName": array[0]
    }
}

const setObjectDoubleName = (array) => {
    return {
        "firstName": array[0],
        "secondName": array[1]
    }
}

const setTripleAndMoreName = (array) => {
    return {
        "firstName": array[0],
        "secondName": array[1] + " " + array[array.length - 1]
    }
}

const setBadgeColor = () => {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]
}


const setUpContactData = (getAllValue, array) => {
    let values = getAllValue(array)
    return {
        "forename": setName(getAllValue(array).name).firstName,
        "surname": setName(getAllValue(array).name).secondName,
        "phone": getAllValue(array).phone,
        "fornameFirstLetter": setName(getAllValue(array).name).firstName[0],
        "surnameFirstLetter": setName(getAllValue(array).name).secondName[0],
        "email": getAllValue(array).email,
        "badgeColor": setBadgeColor()
    }
}


const setAllEditContactInputs = (
    nameInputId, phoneInputId, emailInputId, initialBadgeId, name, email, phone, colorArray,
    fornameFirstLetter, surnameFirstLetter
) => {
    document.getElementById(nameInputId).value = name
    document.getElementById(phoneInputId).value = phone
    document.getElementById(emailInputId).value = email
    document.getElementById(initialBadgeId).style.backgroundColor = `rgba(${colorArray[0]},${colorArray[1]},${colorArray[2]})`
    document.getElementById(initialBadgeId).innerText = `${fornameFirstLetter.toUpperCase()}${surnameFirstLetter.toUpperCase()}`
}



const setContactCards = (index, array) => {
    let template;
    if (typeof array[index] === 'string') {
        template = `<div class="contact-card letter-border">
                        <div class="leter-border-letter-box">${(array[index].toUpperCase())}</div>
                        <div class="letter-border-line"></div>
                    </div>`
    } else {
        template = `<div class="contact-card contacts-member" id="${array[index].id}" onclick="clicked(this)">
                        <div class="contacts-member-circle-initial" style="background-color: rgba(${array[index].badgeColor[0]}, ${array[index].badgeColor[1]}, ${array[index].badgeColor[2]}, 1);"><span>${array[index].fornameFirstLetter.toUpperCase()}${array[index].surnameFirstLetter.toUpperCase()}</span></div>
                        <div class="contacts-member-name-and-email-parent">
                            <div class="contacts-member-name"><span>${array[index].forename} ${array[index].surname}</span></div>
                            <div class="contacts-member-email"><span>${array[index].email}</span></div>
                        </div>
                    </div>`
    }
    return template
}

const setExpandedContactcardsTemplate = (id, library) => {
    let template;
    template = `<div class="contact-main-expanded-card">
    <div class="contact-expanded-name-and-functions">
        <div class="contacts-member-circle-initial-expanded"style="background-color: rgba(${library[id].badgeColor[0]}, ${library[id].badgeColor[1]}, ${library[id].badgeColor[2]}, 1);">${library[id].fornameFirstLetter.toUpperCase()}${library[id].surnameFirstLetter.toUpperCase()}</div>
        <div class="contacts-member-name-and-functions-expanded">
            <div class="contacts-member-name-expanded">${library[id].forename} ${library[id].surname}</div>
            <div class="contacts-member-functions" onclick="setEventBubbling(event)">
                <div class="function-edit" onclick="initEditContact('${id}')">
                    <img src="../assets/ui-icons/edit.svg" alt="edit.svg">
                    <span>Edit</span>
                </div>
                <div class="function-delete" onclick="deleteContact('${id}')">
                    <img src="../assets/ui-icons/delete.svg" alt="delete.svg">
                    <span>Delete</span>
                </div>
            </div>
        </div>
    </div>
    <div class="contact-info-txt"><span>Contact Information</span></div>
    <div class="contact-telephone-and-email-parent" onclick="setEventBubbling(event)">
        <div class="contact-email-txt"><span>Email</span></div>
        <div class="contact-email" id="contactEmail"><a href="mailto:${library[id].email}">${library[id].email}</a></div>
        <div class="contact-phone-txt"><span>Phone</span></div>
        <div class="contact-phone" id="contactPhone"><a href="tel:+${library[id].email}">+ ${library[id].phone}</a></div>
    </div>
</div>`
    return template
}