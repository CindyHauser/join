const initContactPage = async ()=>{
        // set up the library
        await setLibraryForFirebaseInit();
        // setup contact Array
        getContactsArray();
        // rendering list
        renderContactList();
}