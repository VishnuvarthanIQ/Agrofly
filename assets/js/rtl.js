/**
 * AgroFly - RTL / LTR Direction Switcher Module
 * Dynamically switches document text direction and loads Bootstrap RTL stylesheet
 * Calling e.stopPropagation() ensures open dropdowns and navigation drawers do not close on toggle
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'agro_dir';

  const getSavedDir = () => {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  };

  const setDir = (dir) => {
    const validDir = dir === 'rtl' ? 'rtl' : 'ltr';
    document.documentElement.dir = validDir;
    localStorage.setItem(STORAGE_KEY, validDir);

    const bsLink = document.getElementById('bsCss');
    if (bsLink) {
      if (validDir === 'rtl') {
        bsLink.href = bsLink.href.replace('bootstrap.min.css', 'bootstrap.rtl.min.css');
      } else {
        bsLink.href = bsLink.href.replace('bootstrap.rtl.min.css', 'bootstrap.min.css');
      }
    }
  };

  const toggleDir = () => {
    const current = document.documentElement.dir || getSavedDir();
    setDir(current === 'rtl' ? 'ltr' : 'rtl');
  };

  // Initialize
  const initialDir = getSavedDir();
  setDir(initialDir);

  // Global click delegator for RTL toggle buttons with stopPropagation to keep dropdowns/nav open
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-rtl');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      toggleDir();
    }
  }, true);

  // Export to global scope
  window.AgroRTL = {
    set: setDir,
    toggle: toggleDir,
    get: () => document.documentElement.dir
  };
})();
