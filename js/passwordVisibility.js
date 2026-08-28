/**
 * Sets up the lock/eye icon behavior for a password field.
 * Switches from the lock icon to the "eye invisible" icon once the user starts typing,
 * back to the lock icon once the field is emptied again, and toggles the field's
 * visibility (and the eye icon) on click.
 *
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} icon - The icon element next to the field. Must have
 *   data-lock, data-invisible and data-visible attributes set to the respective icon paths.
 * @returns {void}
 */
function setupPasswordVisibilityToggle(input, icon) {
    const state = { isVisible: false };
    input.addEventListener('input', () => handlePasswordInput(input, icon, state));
    icon.addEventListener('mousedown', (event) => event.preventDefault());
    icon.addEventListener('click', () => handleIconClick(input, icon, state));
}

/**
 * Reacts to typing in the password field: resets to the locked state when the
 * field is empty, or activates the clickable eye icon once it isn't.
 *
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} icon - The icon element next to the field.
 * @param {{isVisible: boolean}} state - Mutable state tracking current visibility.
 * @returns {void}
 */
function handlePasswordInput(input, icon, state) {
    if (input.value.length === 0) {
        resetToLocked(input, icon, state);
    } else if (!icon.classList.contains('clickable')) {
        activateEyeIcon(icon, state);
    }
}

/**
 * Resets the password field to the locked, non-visible state:
 * sets the input back to type "password" and shows the lock icon.
 *
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} icon - The icon element next to the field.
 * @param {{isVisible: boolean}} state - Mutable state tracking current visibility.
 * @returns {void}
 */
function resetToLocked(input, icon, state) {
    state.isVisible = false;
    input.type = 'password';
    icon.src = icon.dataset.lock;
    icon.classList.remove('clickable');
}

/**
 * Switches the icon to its clickable eye state, showing either the
 * "invisible" or "visible" variant depending on the current state.
 *
 * @param {HTMLImageElement} icon - The icon element next to the field.
 * @param {{isVisible: boolean}} state - Mutable state tracking current visibility.
 * @returns {void}
 */
function activateEyeIcon(icon, state) {
    icon.src = state.isVisible ? icon.dataset.visible : icon.dataset.invisible;
    icon.classList.add('clickable');
}

/**
 * Handles a click on the eye icon: toggles the password field's visibility
 * and updates the icon accordingly. Does nothing if the field is empty.
 *
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} icon - The icon element next to the field.
 * @param {{isVisible: boolean}} state - Mutable state tracking current visibility.
 * @returns {void}
 */
function handleIconClick(input, icon, state) {
    if (input.value.length === 0) return;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    state.isVisible = !state.isVisible;
    input.type = state.isVisible ? 'text' : 'password';
    icon.src = state.isVisible ? icon.dataset.visible : icon.dataset.invisible;
    requestAnimationFrame(() => input.setSelectionRange(selectionStart, selectionEnd));
}