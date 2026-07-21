/**
 * Handles removing a subtask list item and updating following indices.
 *
 * @param {HTMLElement} icon - The delete icon that was clicked.
 * @returns {void}
 */
function handleDeleteClick(icon) {
    const li = icon.closest("li");
    decrementFollowingIndices(li);
    li.remove();
    removeSubtaskListIfEmpty();
}

/**
 * Enables editing mode for a subtask text element.
 *
 * @param {HTMLElement} icon - The edit icon that was clicked.
 * @returns {void}
 */
function handleEditClick(icon) {
    const li = icon.closest("li");
    const span = li.querySelector(".editSubtaskText");
    if (span.getAttribute("contenteditable") === "true") return;

    span.setAttribute("contenteditable", "true");
    span.focus();
    placeCaretAtEnd(span);
    attachSubtaskEnterHandler(span);
    attachSubtaskBlurHandler(span, li);
}

/**
 * Attaches an Enter key handler to a subtask text element.
 *
 * @param {HTMLElement} span - The editable subtask text element.
 * @returns {void}
 */
function attachSubtaskEnterHandler(span) {
    function onKey(e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        span.removeEventListener("keydown", onKey);
        span.blur();
    }
    span.addEventListener("keydown", onKey);
}

/**
 * Attaches a blur handler to finalize or remove an edited subtask.
 *
 * @param {HTMLElement} span - The editable subtask text element.
 * @param {HTMLElement} li - The parent list item element of the subtask.
 * @returns {void}
 */
function attachSubtaskBlurHandler(span, li) {
    span.addEventListener("blur", function onBlur() {
        const newValue = span.textContent.trim();
        if (!newValue) {
            decrementFollowingIndices(li);
            li.remove();
            removeSubtaskListIfEmpty();
        } else {
            span.removeAttribute("contenteditable");
        }
    }, { once: true });
}

/**
 * Removes the subtask list container if it no longer contains items.
 *
 * @returns {void}
 */
function removeSubtaskListIfEmpty() {
    const list = document.getElementById('editSubtaskDescription');
    if (list && list.children.length === 0) list.remove();
}

/**
 * Decrements the dataset indices of all following subtask list items.
 *
 * @param {HTMLElement} li - The removed subtask list item.
 * @returns {void}
 */
function decrementFollowingIndices(li) {
    let next = li.nextElementSibling;
    while (next) {
        next.dataset.value = Number(next.dataset.value) - 1;
        next = next.nextElementSibling;
    }
}