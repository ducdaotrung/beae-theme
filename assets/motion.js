(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationsEnabled = document.documentElement.dataset.blockAnimations !== 'false';

  if (!animationsEnabled || reducedMotion) return;

  document.querySelectorAll('[data-motion-block]').forEach((block) => {
    block.classList.add('motion-block--animated');
  });
})();
