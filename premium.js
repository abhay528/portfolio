/* Optional enhancements only. Every page works without this file. */
(() => {
  'use strict';
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
  document.querySelectorAll('details.mobile-nav').forEach(menu => {
    const summary = menu.querySelector('summary');
    const close = (returnFocus = false) => {
      if (!menu.open) return;
      menu.open = false;
      if (returnFocus && summary) summary.focus();
    };
    menu.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('a')) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) { close(true); }
    });
    document.addEventListener('click', event => {
      if (event.target instanceof Node && !menu.contains(event.target)) close();
    });
    const desktop = window.matchMedia('(min-width: 761px)');
    if (desktop.addEventListener) desktop.addEventListener('change', event => { if (event.matches) close(); });
  });
  const copy = document.getElementById('copy-email');
  const status = document.getElementById('copy-status');
  if (copy && status && navigator.clipboard && window.isSecureContext) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('jadonabhay574@gmail.com');
        status.textContent = 'Email address copied.';
      } catch {
        status.textContent = 'Copy unavailable. Select the visible email address instead.';
      }
    });
  }
})();
