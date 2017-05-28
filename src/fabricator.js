initializeMenuToggles();

function initializeMenuToggles() {

    document
        .querySelectorAll('[data-f-menu-toggle]')
        .forEach((menuToggle) => menuToggle.addEventListener('click', (event) => {

            event.stopPropagation();
            const menu = document.getElementById(menuToggle.getAttribute('data-f-menu-toggle').slice(1));
            addClass(menuToggle, 'f-open');
            addClass(menu, 'f-open');
            document.addEventListener('click', closeMenu);

            function closeMenu() {
                removeClass(menuToggle, 'f-open');
                removeClass(menu, 'f-open');
                document.removeEventListener('click', closeMenu);
            }
        }));
}

function addClass(element, name) {
    element.className = element.className + ' ' + name;
}

function removeClass(element, name) {
    element.className = element.className.replace(' ' + name, '').replace(name, '');
}
