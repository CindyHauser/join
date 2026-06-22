const profileInitialElement = document.getElementById('profileInitial');
const currentUserInitials = localStorage.getItem("currentUserInitials");
profileInitialElement.textContent = currentUserInitials || "G";

const initContactPage = async ()=>{
        // set up the library
        await setLibraryForFirebaseInit();
        // setup contact Array
        getContactsArray();
        // rendering list
        renderContactList();
}