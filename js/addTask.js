function selectPriority(button) {
        document.querySelectorAll('.priority-btn')
            .forEach(btn => btn.classList.remove('selected'));

        button.classList.add('selected');
    }