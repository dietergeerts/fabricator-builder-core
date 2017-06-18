import './fabricator.scss';

initializeToggles('data-f-menu-toggle');
initializeToggles('data-f-code-toggle');

function initializeToggles(toggleSelector) {

    document
        .querySelectorAll(`[${toggleSelector}]`)
        .forEach((toggle) => toggle.addEventListener('click', (event) => {

            // The following is needed, because the previous will otherwise not be hidden!
            document.getElementsByTagName('body')[0].click();

            event.stopPropagation();
            const target = document.getElementById(toggle.getAttribute(toggleSelector).slice(1));

            addClass(toggle, 'f-open');
            addClass(target, 'f-open');
            document.addEventListener('click', hideTarget);

            function hideTarget() {
                removeClass(toggle, 'f-open');
                removeClass(target, 'f-open');
                document.removeEventListener('click', hideTarget);
            }
        }));
}

function addClass(element, name) {
    element.className = element.className + ' ' + name;
}

function removeClass(element, name) {
    element.className = element.className.replace(' ' + name, '').replace(name, '');
}
