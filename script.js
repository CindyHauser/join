const profileInitialElement = document.getElementById('profileInitial');
const currentUserInitials = sessionStorage.getItem("currentUserInitials");
if (profileInitialElement) {
        profileInitialElement.textContent = currentUserInitials || "G";
}


const initContactPage = async () => {
        // set up the library
        await setLibraryForFirebaseInit();
        // setup contact Array
        getContactsArray();
        // rendering list
        renderContactList();
        console.log()
}

const initBoardPage = async () => {
        await setContactLibraryForFirebaseInit()
        await setTaskLibraryForFirebaseInit();
        getGeneralTaskArray(taskListJsonLibrary, setTaskDataStructure, getPreludeGeneralTaskArray)
        getAllArray()
        renderAllCards(toDoTaskArray, inProgressTaskArray, awaitFeedbackTaskArray, doneTaskArray)
}

const initAddTaskPage = async () => {
        await setLibraryForFirebaseInit()
        setContactInputList()
        renderContactInputList()
}

function showProfileMenu() {
        // Implementation for showing profile menu
        const profileInitial = document.getElementById("profileInitial");
        const profileMenu = document.getElementById("profileMenu");

        profileMenu.classList.toggle("active");

        document.addEventListener("click", (event) => {
                if (!profileInitial.contains(event.target) &&
                        !profileMenu.contains(event.target)) {
                        profileMenu.classList.remove("active");
                }
        });
}

function logOut() {
        sessionStorage.removeItem("currentUserInitials");
        sessionStorage.removeItem("currentUserName");
        sessionStorage.removeItem("lastVisitedSite")
        sessionStorage.setItem("skipAnimation", "true");
        window.location.href = '../index.html';
}

// help-js


const triggerHistoryBack = () => {
        let count = sessionStorage.getItem('historyCounter') 
        if (count < 0) {
                count == 0
        }
        let historyBackSite = sessionStorage.getItem(`lastVisitedSite${count-1}`) || 'summary.html'
        window.location.href = historyBackSite
        count--
        sessionStorage.removeItem(`lastVisitedSite${count}`)
        sessionStorage.setItem('historyCounter', count)
}

const triggerLogInPage = () => {
        window.location.href = '../index.html';
}

const safeAddressToSessionStorage = (htmlAdress) => {
        let count = sessionStorage.getItem('historyCounter')
        if (count < 0) {
                count == 0
        }
        sessionStorage.setItem(`lastVisitedSite${count}`, htmlAdress)
        count++
        sessionStorage.setItem('historyCounter', count)
}

const openHelpPage = (helpPage) => {
        safeAddressToSessionStorage(window.location.href)
        window.location.href = helpPage
}

// general-hyperlink-fn 

const openPage = (pageAdress) => {
        safeAddressToSessionStorage(window.location.href)
        window.location.href = pageAdress
}

