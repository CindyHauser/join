/**
 * Resets the custom dropdown option selection state.
 *
 * @param {HTMLElement[]} options - The option elements of the custom dropdown.
 * @returns {void}
 */
function resetOptions(options) {
    options.forEach(option => {
        option.setAttribute('aria-selected', 'false');
        option.classList.remove('active');
    });
}

/**
 * Applies the selected custom dropdown option to the trigger button and label.
 *
 * @param {HTMLElement} option - The selected option element.
 * @param {HTMLElement} trigger - The dropdown trigger button.
 * @param {HTMLElement} label - The label element showing the selected value.
 * @returns {void}
 */
function applySelectedOption(option, trigger, label) {
    option.setAttribute('aria-selected', 'true');
    option.classList.add('active');
    label.textContent = option.textContent;
    trigger.dataset.value = option.dataset.value;
}

/**
 * Clears the selected value of the custom dropdown and resets the label.
 *
 * @param {HTMLElement} trigger - The dropdown trigger button.
 * @param {HTMLElement} label - The label element showing the selected value.
 * @returns {void}
 */
function clearSelection(trigger, label) {
    label.textContent = 'Select task Category';
    trigger.dataset.value = '';
}

/**
 * Returns the relevant DOM elements for the custom category dropdown.
 *
 * @param {string} selectId - The ID of the trigger element.
 * @returns {{trigger: HTMLElement|null, list: HTMLElement|null, label: HTMLElement|null}}
 */
function getDropdownElements(selectId) {
    const isEdit = selectId === 'categoryEdit';
    const trigger = document.getElementById(selectId);
    const list = document.getElementById(`dropdownList${isEdit ? 'Edit' : ''}`);
    const label = document.getElementById(`dropdownLabel${isEdit ? 'Edit' : ''}`);
    return { trigger, list, label };
}

/**
 * Selects the matching option in the custom category dropdown by value.
 *
 * @param {string} selectId - The ID of the dropdown trigger element.
 * @param {string} value - The value to select.
 * @returns {void}
 */
function selectCategoryByValue(selectId, value) {
    const { trigger, list, label } = getDropdownElements(selectId);
    if (!trigger || !list || !label) return;
    const options = Array.from(list.querySelectorAll('.dropdown-option'));
    resetOptions(options);
    const selectedOption = options.find(option => option.dataset.value === value);
    selectedOption
        ? applySelectedOption(selectedOption, trigger, label)
        : clearSelection(trigger, label);
}