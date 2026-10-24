(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function showToast(message = 'Done') {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1900);
  }

  async function copySource(id) {
    const code = document.getElementById(id);
    if (!code) return showToast('Source not found');
    const value = code.textContent || '';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const helper = document.createElement('textarea');
        helper.value = value;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand('copy');
        helper.remove();
        if (!copied) throw new Error('Clipboard fallback unavailable');
      }
      showToast('Java source copied');
    } catch {
      showToast('Copy blocked by browser — select source manually');
    }
  }
  window.copySource = copySource;
  window.DSAJournal = { showToast };

  // Dropdowns share one controller, including outside-click and Escape behavior.
  const dropdowns = [
    { button: $('#topicToggle'), menu: $('#topicMenu') },
    { button: $('#patternToggle'), menu: $('#patternMenu') }
  ].filter(item => item.button && item.menu);
  function closeAll(except = null) {
    dropdowns.forEach(item => {
      if (item === except) return;
      item.button.setAttribute('aria-expanded', 'false');
      item.menu.classList.remove('open');
    });
  }
  dropdowns.forEach(item => {
    item.button.addEventListener('click', event => {
      event.stopPropagation();
      const shouldOpen = item.button.getAttribute('aria-expanded') !== 'true';
      closeAll(item);
      item.button.setAttribute('aria-expanded', String(shouldOpen));
      item.menu.classList.toggle('open', shouldOpen);
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.dropdown')) closeAll();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAll();
  });

  // Mark the current destination in the relevant dropdown.
  const currentFile = location.pathname.split('/').pop() || 'home.html';
  $$('a[href]').forEach(link => {
    if (link.getAttribute('href') === currentFile) link.setAttribute('aria-current', 'page');
  });

  // Reveal only the page sections that enter the viewport; reduced-motion users see them immediately.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Home dashboard search / filters and locally saved checkpoints.
  const search = $('#journalSearch');
  const cards = $$('.journal-card[data-title]');
  let activeFilter = 'all';
  function filterCards() {
    if (!cards.length) return;
    const query = (search?.value || '').trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const matchesQuery = (card.dataset.title + ' ' + card.textContent).toLowerCase().includes(query);
      const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
      const visible = matchesQuery && matchesFilter;
      card.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });
    const empty = $('#journalEmptyState');
    if (empty) empty.style.display = shown ? 'none' : 'block';
  }
  search?.addEventListener('input', filterCards);
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filterCards();
  }));

  const checkpointInputs = $$('[data-checkpoint]');
  const progressFill = $('#progressFill');
  const progressCount = $('#progressCount');
  function refreshProgress() {
    if (!checkpointInputs.length) return;
    const done = checkpointInputs.filter(input => input.checked).length;
    if (progressFill) progressFill.style.width = `${done / checkpointInputs.length * 100}%`;
    if (progressCount) progressCount.textContent = `${done} / ${checkpointInputs.length}`;
    checkpointInputs.forEach(input => {
      const label = input.closest('.checkpoint');
      if (label) label.style.borderColor = input.checked ? '#c8ff5a55' : '';
    });
  }
  checkpointInputs.forEach(input => {
    const storageKey = `dsa-journal-checkpoint-${input.dataset.checkpoint}`;
    try { input.checked = localStorage.getItem(storageKey) === '1'; } catch { /* local storage may be disabled */ }
    input.addEventListener('change', () => {
      try { localStorage.setItem(storageKey, input.checked ? '1' : '0'); } catch { /* progress still updates for this visit */ }
      refreshProgress();
    });
  });
  refreshProgress();

  // One reusable dry-run stepper per problem page.
  window.createJournalStepper = function createJournalStepper(slug, initialSteps = []) {
    let steps = initialSteps;
    let index = 0;
    const detail = $(`#${slug}TraceDetail`);
    const chip = $(`#${slug}TraceChip`);
    const counter = $(`#${slug}StepCount`);
    const prev = $(`#${slug}Prev`);
    const next = $(`#${slug}Next`);
    const reset = $(`#${slug}Reset`);
    function render() {
      if (!detail || !steps.length) return;
      index = Math.max(0, Math.min(index, steps.length - 1));
      const step = steps[index];
      if (chip) chip.textContent = step.label;
      detail.textContent = step.detail;
      if (counter) counter.textContent = `STEP ${index + 1} / ${steps.length}`;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === steps.length - 1;
    }
    prev?.addEventListener('click', () => { index--; render(); });
    next?.addEventListener('click', () => { index++; render(); });
    reset?.addEventListener('click', () => { index = 0; render(); });
    render();
    return newSteps => { steps = newSteps; index = 0; render(); };
  };
})();
