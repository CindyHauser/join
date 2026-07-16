function setupElements(dialog) {
    const trigger = replaceWithClone(dialog.querySelector(TRIGGER_SELECTOR));
    const list = replaceWithClone(dialog.querySelector(LIST_SELECTOR));
    const label = dialog.querySelector(LABEL_SELECTOR);
    const arrow = dialog.querySelector(ARROW_SELECTOR);
    const options = Array.from(list.querySelectorAll('.dropdown-option'));
    return { trigger, list, label, arrow, options };
}

function replaceWithClone(element) {
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone;
}

function openList(els, state) {
    els.list.hidden = false;
    els.trigger.setAttribute('aria-expanded', 'true');
    els.arrow.src = ARROW_UP_ICON;
    state.activeIndex = els.options.findIndex(o => o.getAttribute('aria-selected') === 'true');
    if (state.activeIndex === -1) state.activeIndex = 0;
    setActive(els, state, state.activeIndex);
    els.list.focus();
}

function closeList(els) {
    els.list.hidden = true;
    els.trigger.setAttribute('aria-expanded', 'false');
    els.arrow.src = ARROW_DOWN_ICON;
}

function toggleList(els, state) {
    els.list.hidden ? openList(els, state) : closeList(els);
}

function setActive(els, state, index) {
    els.options.forEach(o => o.classList.remove('active'));
    els.options[index].classList.add('active');
    state.activeIndex = index;
}

function selectOption(els, option) {
    els.options.forEach(o => o.setAttribute('aria-selected', 'false'));
    option.setAttribute('aria-selected', 'true');
    els.label.textContent = option.textContent;
    els.trigger.dataset.value = option.dataset.value;
    els.trigger.dispatchEvent(new Event('customchange', { bubbles: true }));
    closeList(els);
    els.trigger.focus();
}

function handleTriggerKeydown(e, els, state) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openList(els, state);
    }
}

function handleListKeydown(e, els, state) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        handleListArrowKey(e, els, state);
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(els, els.options[state.activeIndex]);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
        handleListExitKey(e, els);
    }
}

function handleListArrowKey(e, els, state) {
    e.preventDefault();
    const len = els.options.length;
    const delta = e.key === 'ArrowDown' ? 1 : -1;
    setActive(els, state, (state.activeIndex + delta + len) % len);
    els.options.forEach(o => o.setAttribute('aria-selected', 'false'));
    els.options[state.activeIndex].setAttribute('aria-selected', 'true');
}

function handleListExitKey(e, els) {
    closeList(els);
    if (e.key === 'Escape') els.trigger.focus();
}

function attachOptionListeners(els, state) {
    els.options.forEach((option, index) => {
        option.addEventListener('click', () => selectOption(els, option));
        option.addEventListener('mouseenter', () => setActive(els, state, index));
    });
}

function attachListeners(els, state) {
    els.trigger.addEventListener('click', () => toggleList(els, state));
    attachOptionListeners(els, state);
    els.trigger.addEventListener('keydown', (e) => handleTriggerKeydown(e, els, state));
    els.list.addEventListener('keydown', (e) => handleListKeydown(e, els, state));
}

document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown').forEach(d => closeDropdownIfOutside(d, e.target));
});
 
function closeDropdownIfOutside(dropdown, target) {
    if (dropdown.contains(target)) return;
    const list = dropdown.querySelector('.dropdown-list');
    if (!list || list.hidden) return;
 
    list.hidden = true;
    const trigger = dropdown.querySelector(TRIGGER_SELECTOR);
    const arrow = dropdown.querySelector(ARROW_SELECTOR);
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (arrow) arrow.src = ARROW_DOWN_ICON;
}