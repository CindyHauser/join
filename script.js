/**
 * The DOM element that displays the user profile's initials.
 * @type {HTMLElement | null}
 */
const profileInitialElement = document.getElementById('profileInitial');

/**
 * The current user's initials retrieved from session storage.
 * @type {string | null}
 */
const currentUserInitials = sessionStorage.getItem("currentUserInitials");
if (profileInitialElement) {
        profileInitialElement.textContent = currentUserInitials || "G";
}

/**
 * Initializes the contact page.
 * Starts the Firebase setup, fetches the contact data, and subsequently 
 * renders the contact list in the DOM.
 * 
 * @async
 * @returns {Promise<void>} Resolves when the initialization is complete.
 */
const initContactPage = async () => {
        await setLibraryForFirebaseInit();
        getContactsArray();
        renderContactList();
}

/**
 * Initializes the board page (e.g., a Kanban board).
 * Asynchronously loads the Firebase libraries for contacts and tasks.
 * Then fetches the general task data, populates the specific arrays, 
 * and renders the task cards in their respective status columns 
 * (To Do, In Progress, Await Feedback, Done).
 * 
 * @async
 * @returns {Promise<void>} Resolves once all data is loaded and the board is rendered.
 */
const initBoardPage = async () => {
        await setContactLibraryForFirebaseInit()
        await setTaskLibraryForFirebaseInit();
        getGeneralTaskArray(taskListJsonLibrary, setTaskDataStructure, getPreludeGeneralTaskArray)
        getAllArray()
        renderAllCards(toDoTaskArray, inProgressTaskArray, awaitFeedbackTaskArray, doneTaskArray)
}

/**
 * Initializes the Add Task page.
 * Asynchronously sets up the Firebase library, prepares the contact data 
 * for the assignment input, and renders the contact list into the DOM.
 * 
 * @async
 * @returns {Promise<void>} Resolves when the page initialization is complete.
 */
const initAddTaskPage = async () => {
        await setLibraryForFirebaseInit()
        setContactInputList()
        renderContactInputList()
        initDropdown(root);
        initValidation(addTaskForm);
        initDatePicker();
}

/**
 * Toggles the visibility of the profile menu.
 * Attaches a click event listener to the document to automatically close the menu 
 * (removes the "active" class) if the user clicks outside of the profile initial or the menu itself.
 * 
 * @returns {void}
 */
function showProfileMenu() {
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

/**
 * Logs out the current user.
 * Clears user-specific data (initials, name, and last visited site) from the session storage,
 * sets a flag to skip the entry animation on the next visit, and redirects the user to the index page.
 * 
 * @returns {void}
 */
function logOut() {
        sessionStorage.removeItem("currentUserInitials");
        sessionStorage.removeItem("currentUserName");
        sessionStorage.removeItem("lastVisitedSite")
        sessionStorage.setItem("skipAnimation", "true");
        window.location.href = '../index.html';
}

/**
 * Triggers a backwards navigation based on session storage history.
 * Retrieves the history counter to find the previously visited site, defaulting to 'summary.html'.
 * Redirects the user to that page, decrements the counter, removes the old history entry, 
 * and updates the counter in the session storage.
 * 
 * @returns {void}
 */
const triggerHistoryBack = () => {
        let count = sessionStorage.getItem('historyCounter')
        if (count < 0) {
                count == 0
        }
        let historyBackSite = sessionStorage.getItem(`lastVisitedSite${count - 1}`) || 'summary.html'
        window.location.href = historyBackSite
        count--
        sessionStorage.removeItem(`lastVisitedSite${count}`)
        sessionStorage.setItem('historyCounter', count)
}

/**
 * Redirects the user to the login page (index.html).
 * Updates the current window location to navigate back to the root index file.
 * 
 * @returns {void}
 */
const triggerLogInPage = () => {
        window.location.href = '../index.html';
}

/**
 * Saves the provided HTML address to the session storage history.
 * Uses a history counter to create a unique key for the visited site,
 * stores the address, and then increments and updates the counter in session storage.
 * 
 * @param {string} htmlAdress - The URL or file path of the page to be saved in history.
 * @returns {void}
 */
const safeAddressToSessionStorage = (htmlAdress) => {
        let count = sessionStorage.getItem('historyCounter') || 0
        if (count < 0) {
                count == 0
        }
        sessionStorage.setItem(`lastVisitedSite${count}`, htmlAdress)
        count++
        sessionStorage.setItem('historyCounter', count)
}

/**
 * Opens a specified help page after saving the current page to the session history.
 * Calls `safeAddressToSessionStorage` with the current window location before redirecting.
 * 
 * @param {string} helpPage - The URL or file path of the help page to navigate to.
 * @returns {void}
 */
const openHelpPage = (helpPage) => {
        safeAddressToSessionStorage(window.location.href)
        window.location.href = helpPage
}

/**
 * Opens a specified page after saving the current page's URL to the session history.
 * Calls `safeAddressToSessionStorage` with the current window location before redirecting.
 * 
 * @param {string} pageAdress - The URL or file path of the page to navigate to.
 * @returns {void}
 */
const openPage = (pageAdress) => {
        safeAddressToSessionStorage(window.location.href)
        window.location.href = pageAdress
}

