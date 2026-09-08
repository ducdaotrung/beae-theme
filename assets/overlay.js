(() => {
  const openOverlays = new Map();

  const getFocusable = (dialog) => [...dialog.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )];

  const closeOverlay = (dialog) => {
    if (!dialog.open) return;
    dialog.close();
  };

  document.querySelectorAll('dialog[data-overlay]').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog && dialog.dataset.backdropClose !== 'false') closeOverlay(dialog);
    });

    dialog.addEventListener('cancel', () => closeOverlay(dialog));

    dialog.addEventListener('close', () => {
      document.documentElement.removeAttribute('scroll-lock');
      const trigger = openOverlays.get(dialog);
      openOverlays.delete(dialog);
      trigger?.focus({ preventScroll: true });
    });

    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusable = getFocusable(dialog);
      if (focusable.length < 2) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-overlay-open]');
    if (!trigger) return;
    const dialog = document.querySelector(trigger.dataset.overlayOpen);
    if (!(dialog instanceof HTMLDialogElement)) return;
    event.preventDefault();
    openOverlays.set(dialog, trigger);
    dialog.showModal();
    document.documentElement.setAttribute('scroll-lock', '');
    getFocusable(dialog)[0]?.focus();
  });

  document.addEventListener('click', (event) => {
    const close = event.target.closest('[data-overlay-close]');
    if (close) close.closest('dialog[data-overlay]') && closeOverlay(close.closest('dialog[data-overlay]'));
  });
})();
