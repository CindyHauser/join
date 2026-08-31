/**
 * Synchronously adds the "pending-greeting" class to the <html> element,
 * before the first paint, so that the greeting section's fullscreen
 * overlay animation is visible from the very first frame instead of
 * being applied later via a DOMContentLoaded handler (avoids FOUC).
 *
 * Runs only if both conditions are met:
 * - The sessionStorage flag "cameFromIndex" is set
 *   (set by index.html right before redirecting here).
 * - The viewport matches the mobile breakpoint (<= 768px).
 *
 * @returns {void}
 */
function pendingGreetingInit(){
    if (sessionStorage.getItem('cameFromIndex') && window.matchMedia('(max-width: 1220px)').matches) {
        document.documentElement.classList.add('pending-greeting');
    }
}
/**
 * Execute immediately during HTML parsing (in the <head>) 
 */ 
pendingGreetingInit()