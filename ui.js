/* App shell: navigation, mobile drawer, summary tiles, PWA install. Engine lives in app.js. */
(() => {
  const $ = id => document.getElementById(id);
  const SCREENS = ['setup-screen', 'tournament-screen', 'vault-screen', 'archive-view-screen'];
  const NAV_OF = { 'setup-screen': 'setup', 'tournament-screen': 'live', 'vault-screen': 'vault', 'archive-view-screen': 'vault' };
  const TITLES = {
    'setup-screen': ['New tournament', 'Choose a format, courts and players'],
    'tournament-screen': ['Live tournament', () => (typeof tournamentName !== 'undefined' ? tournamentName : '')],
    'vault-screen': ['Archive', 'Resume, review or delete saved tournaments'],
    'archive-view-screen': ['Tournament details', 'Standings and match log']
  };
  const sidebar = $('sidebar'), scrim = $('scrim'), menuBtn = $('menuBtn');
  const mobileMQ = window.matchMedia('(max-width: 759px)');
  let lastScreen = null;

  const current = () => SCREENS.find(id => !$(id).classList.contains('hidden')) || 'setup-screen';
  const hasLive = () => typeof participants !== 'undefined' && participants.length > 0;
  function showScreen(id) { SCREENS.forEach(s => $(s).classList.toggle('hidden', s !== id)); }

  function summary() {
    let list = [];
    try { list = getSavedTournaments(); } catch (e) {}
    const done = list.filter(t => t.isFinished).length;
    const live = hasLive() && !isTournamentFinished;
    const tiles = [['Saved', list.length], ['In progress', list.length - done], ['Completed', done],
                   ['Live round', live ? 'Round ' + currentRound : '–']];
    $('summary').innerHTML = tiles.map(([l, v]) => `<div class="sum-tile"><span>${l}</span><strong>${v}</strong></div>`).join('');
    $('navArchiveCount').textContent = list.length;
  }

  function sync() {
    const cur = current(), nav = NAV_OF[cur];
    document.querySelectorAll('.nav-item[data-nav]').forEach(b => {
      const on = b.dataset.nav === nav;
      b.classList.toggle('active', on);
      on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
      if (b.dataset.nav === 'live') b.classList.toggle('disabled', !hasLive());
    });
    $('liveDot').hidden = !(hasLive() && !isTournamentFinished);
    const [t, s] = TITLES[cur];
    $('pageTitle').textContent = t;
    $('pageSub').textContent = typeof s === 'function' ? s() : s;
    summary();
    if (cur !== lastScreen) { lastScreen = cur; window.scrollTo({ top: 0 }); if (sidebar.classList.contains('open')) setMenu(false); }
  }

  /* ----- navigation ----- */
  sidebar.addEventListener('click', e => {
    const b = e.target.closest('.nav-item[data-nav]');
    if (!b || b.classList.contains('disabled')) return;
    const n = b.dataset.nav;
    if (n === 'setup') showScreen('setup-screen');
    else if (n === 'live') showScreen('tournament-screen');
    else { showScreen('vault-screen'); openVaultScreen(); }
    sync();
    if (mobileMQ.matches) setMenu(false);
  });

  /* ----- mobile drawer ----- */
  const syncInert = () => sidebar.toggleAttribute('inert', mobileMQ.matches && !sidebar.classList.contains('open'));
  function setMenu(open) {
    sidebar.classList.toggle('open', open);
    scrim.hidden = !open;
    requestAnimationFrame(() => scrim.classList.toggle('show', open));
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    syncInert();
    if (mobileMQ.matches) (open ? sidebar.querySelector('.nav-item') : menuBtn).focus();
  }
  menuBtn.addEventListener('click', () => setMenu(true));
  $('sideClose').addEventListener('click', () => setMenu(false));
  scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sidebar.classList.contains('open')) setMenu(false); });
  mobileMQ.addEventListener('change', () => { if (!mobileMQ.matches) setMenu(false); syncInert(); });
  syncInert();

  /* ----- keep shell in sync with the engine (no engine changes needed) ----- */
  const mo = new MutationObserver(sync);
  SCREENS.forEach(id => mo.observe($(id), { attributes: true, attributeFilter: ['class'] }));
  [$('archive-count-badge'), $('round-title')].forEach(el => mo.observe(el, { childList: true, characterData: true, subtree: true }));

  /* ----- PWA install + service worker ----- */
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('installBtn').hidden = false; });
  $('installBtn').addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt(); await deferred.userChoice; deferred = null; $('installBtn').hidden = true;
  });
  window.addEventListener('appinstalled', () => { $('installBtn').hidden = true; });
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(err => console.log('Service Worker registration failed:', err)));
  }

  sync();
})();
