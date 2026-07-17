const profileInitialElement = document.getElementById('profileInitial');
const currentUserInitials = localStorage.getItem("currentUserInitials");
profileInitialElement.textContent = currentUserInitials || "G";

const initContactPage = async () => {
        // set up the library
        await setLibraryForFirebaseInit();
        // setup contact Array
        getContactsArray();
        // rendering list
        renderContactList();
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
        localStorage.removeItem("currentUserInitials");
        localStorage.removeItem("currentUserName");
        sessionStorage.setItem("skipAnimation", "true");
        window.location.href = '../index.html';
}

// help-js
const triggerHistoryBack = () => {
        let historyBackSite = sessionStorage.getItem('lastVisitedSite')
        if (historyBackSite === 'help.html'){
            historyBackSite = 'summary.html'    
        }
        window.location.href = historyBackSite
}

const safeAddressToSessionStorage = (htmlAdress)=>{
        sessionStorage.setItem('lastVisitedSite',htmlAdress)
}