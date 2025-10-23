(function () {
    const root = document.documentElement;
    const toggle = () => document.getElementById('themeToggle');
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(name) {
        const t = toggle();
        if (!t) return;
        if (name === 'dark') {
            root.setAttribute('data-theme', 'dark');
            t.textContent = 'Light';
            t.setAttribute('aria-pressed', 'true');
            t.setAttribute('aria-label', 'Wechsel zu hellem Modus');
        } else {
            root.removeAttribute('data-theme');
            t.textContent = 'Dark';
            t.setAttribute('aria-pressed', 'false');
            t.setAttribute('aria-label', 'Wechsel zu dunklem Modus');
        }
    }

    // Initialize
    if (stored === 'dark' || (!stored && prefersDark)) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // Attach handler when DOM ready
    document.addEventListener('click', function (e) {
        const t = toggle();
        if (!t) return;
        if (e.target === t) {
            const isDark = root.getAttribute('data-theme') === 'dark';
            const next = isDark ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
        }
    }, false);
})();
