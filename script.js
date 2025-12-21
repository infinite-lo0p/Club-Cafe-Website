document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    
    // If the user has a preference, use it
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateButtonIcon(currentTheme);
    } else {
        // Otherwise use system preference
        const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        updateButtonIcon(systemTheme);
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonIcon(newTheme);
    });

    function updateButtonIcon(theme) {
        // You can change icons here if you prefer SVGs or different text
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '☀️'; // Sun icon for light mode
            themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        } else {
            themeToggleBtn.innerHTML = '🌙'; // Moon icon for dark mode
            themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        }
    }
});
