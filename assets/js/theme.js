/**
 * AgroFly - Theme Switcher Module (Dark / Light Mode)
 * Persists user preference to localStorage and updates UI indicators
 * Calling e.stopPropagation() ensures open dropdowns and navigation drawers do not close on toggle
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'agro_theme';

  const getSavedTheme = () => {
    return localStorage.getItem(STORAGE_KEY) || 'light';
  };

  const updateIcons = (theme) => {
    const iconClass = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    document.querySelectorAll('.js-theme i').forEach(icon => {
      icon.className = iconClass;
    });
  };

  const setTheme = (theme) => {
    const validTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.bsTheme = validTheme;
    localStorage.setItem(STORAGE_KEY, validTheme);
    updateIcons(validTheme);
  };

  const toggleTheme = () => {
    const current = document.documentElement.dataset.bsTheme || getSavedTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Initialize on load
  const initialTheme = getSavedTheme();
  document.documentElement.dataset.bsTheme = initialTheme;
  updateIcons(initialTheme);

  // Global click delegator for theme toggle buttons with stopPropagation to keep dropdowns/nav open
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-theme');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      toggleTheme();
    }
  }, true);

  // Export to global scope
  window.AgroTheme = {
    set: setTheme,
    toggle: toggleTheme,
    get: () => document.documentElement.dataset.bsTheme
  };
})();
