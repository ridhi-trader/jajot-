// Look of the app: themes, fonts, live emoji wallpaper, app texts.
// The admin sets the defaults from the 🎨 button; every visitor gets them automatically.
(function () {
  'use strict';

  var THEMES = {
    candy:    { name: 'Candy',    icon: '🍬', emoji: ['🌸', '✨', '💌', '📣', '⭐', '🦋', '☁️', '💖'] },
    ocean:    { name: 'Ocean',    icon: '🌊', emoji: ['🐚', '🐠', '🐳', '🌊', '💧', '⭐', '🫧', '🪸'] },
    forest:   { name: 'Forest',   icon: '🌿', emoji: ['🌿', '🍃', '🦋', '🐞', '🌼', '🍄', '🐝', '🌳'] },
    sunset:   { name: 'Sunset',   icon: '🌅', emoji: ['🌅', '🔥', '🧡', '🌴', '🦩', '☀️', '🍊', '✨'] },
    sweet:    { name: 'Sweet',    icon: '🧁', emoji: ['🧁', '🍓', '🍩', '🍭', '🎀', '🍰', '🍒', '🧸'] },
    night:    { name: 'Night',    icon: '🌙', emoji: ['🌙', '⭐', '✨', '🪐', '🦉', '💫', '🌌', '☁️'] },
    rose:     { name: 'Rose',     icon: '🌹', emoji: ['🌹', '💕', '💗', '🌷', '💌', '🎀', '🦢', '✨'] },
    mint:     { name: 'Mint',     icon: '🍀', emoji: ['🍀', '🌱', '🍃', '🥝', '🧊', '🐸', '💚', '🫧'] },
    lavender: { name: 'Dreamy',   icon: '🔮', emoji: ['🔮', '🦄', '💜', '🌌', '🫐', '🪻', '✨', '🦋'] },
    gold:     { name: 'Diwali',   icon: '🪔', emoji: ['🪔', '🎆', '✨', '🎇', '🧨', '🪙', '🌟', '🎁'] },
    neon:     { name: 'Neon',     icon: '⚡', emoji: ['🎮', '⚡', '💎', '🌐', '🛸', '🔮', '💫', '🎧'] },
    coffee:   { name: 'Coffee',   icon: '☕', emoji: ['☕', '🍪', '🥐', '🍂', '📚', '🧸', '🕯️', '🍫'] },
  };
  var ORDER = Object.keys(THEMES);

  // id: [CSS name, Google Fonts family spec]
  var FONTS = {
    quicksand: ['Quicksand', 'Quicksand:wght@500;600;700'],
    poppins:   ['Poppins', 'Poppins:wght@400;500;600;700'],
    nunito:    ['Nunito', 'Nunito:wght@500;600;700;800'],
    fredoka:   ['Fredoka', 'Fredoka:wght@400;500;600;700'],
    baloo2:    ['Baloo 2', 'Baloo+2:wght@500;600;700'],
    comfortaa: ['Comfortaa', 'Comfortaa:wght@500;600;700'],
    caveat:    ['Caveat', 'Caveat:wght@500;600;700'],
    playfair:  ['Playfair Display', 'Playfair+Display:wght@500;600;700'],
    inter:     ['Inter', 'Inter:wght@400;500;600;700'],
  };
  var FONT_LABEL = {
    quicksand: 'Quicksand (cute, default)', poppins: 'Poppins (clean)', nunito: 'Nunito (soft)',
    fredoka: 'Fredoka (round, bubbly)', baloo2: 'Baloo 2 (playful)', comfortaa: 'Comfortaa (rounded)',
    caveat: 'Caveat (handwriting)', playfair: 'Playfair Display (elegant)', inter: 'Inter (modern)',
  };

  var PACKS = [
    ['Business', '📈💼🚀💰📣🏆✅📊'],
    ['Love', '💖💕💗💘🌹💌💞🦋'],
    ['Festival', '🪔🎆🎇✨🎉🎊🧨🌟'],
    ['Animals', '🐶🐱🐼🦊🐰🐸🦋🐝'],
    ['Food', '🍕🍔🍟🍩🍓🍉🍦🧁'],
    ['Space', '🚀🪐🌙⭐🛸☄️🌌👽'],
  ];

  var DEF = {
    theme: '', lock: 0, font: 'quicksand', emoji: '', anim: 1,
    density: 'normal', speed: 'normal', size: 'normal',
    appName: '', tagline: '', announce: '',
  };
  var DEFAULT_NAME = 'Social Hub';
  var DEFAULT_TAGLINE = 'One post. All your accounts.';

  var root = document.documentElement;
  var layer = null, btn = null, picker = null, modal = null;
  var draft = null;     // unsaved admin edits (live preview)
  var isAdmin = false;
  var site = merge(DEF, readJSON('sh_site'));

  // ---------- helpers ----------
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function readJSON(k) { try { return JSON.parse(lsGet(k, '{}')) || {}; } catch (e) { return {}; } }
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in (b || {})) o[k] = b[k]; return o; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function osTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'candy';
  }
  function userPick() { var t = lsGet('sh_pick', ''); return THEMES[t] ? t : ''; }
  function themeFor(s) {
    if (s.lock && THEMES[s.theme]) return s.theme;
    return userPick() || (THEMES[s.theme] ? s.theme : osTheme());
  }
  function animOn(s) { return s.anim && lsGet('sh_anim', '1') !== '0'; }

  function graphemes(str) {
    if (!str) return [];
    var arr;
    if (window.Intl && Intl.Segmenter) {
      arr = Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(str), function (x) { return x.segment; });
    } else {
      arr = Array.from(str);
    }
    return arr.filter(function (g) { return !/^[\s\p{L}\p{N}]/u.test(g); }).slice(0, 24);
  }

  // ---------- rendering ----------
  function loadFont(id) {
    var lid = 'sh-font-' + id;
    if (document.getElementById(lid)) return;
    var l = document.createElement('link');
    l.id = lid;
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[id][1] + '&display=swap';
    document.head.appendChild(l);
  }

  function setTexts(s) {
    var name = s.appName || DEFAULT_NAME;
    var h = document.querySelector('header > strong');
    if (h && h.textContent !== name) h.textContent = name;
    var h1 = document.querySelector('#auth h1');
    if (h1 && h1.textContent !== name) h1.textContent = name;
    var p = document.querySelector('#auth .card p.muted');
    var tag = s.tagline || DEFAULT_TAGLINE;
    if (p && p.textContent !== tag) p.textContent = tag;
    document.title = name;

    var b = document.getElementById('sh-announce');
    if (s.announce) {
      if (!b) {
        b = document.createElement('div');
        b.id = 'sh-announce';
        document.body.insertBefore(b, document.body.firstChild);
      }
      if (b.textContent !== s.announce) b.textContent = s.announce;
    } else if (b) {
      b.remove();
    }
  }

  function buildLayer(s, theme) {
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'wallpaper';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }
    layer.innerHTML = '';
    layer.style.display = animOn(s) ? '' : 'none';
    var custom = graphemes(s.emoji);
    var set_ = custom.length ? custom : THEMES[theme].emoji;
    var small = window.innerWidth < 600;
    var count = { few: small ? 8 : 14, normal: small ? 14 : 26, many: small ? 22 : 42 }[s.density] || 14;
    var dur = { slow: 1.7, normal: 1, fast: 0.55 }[s.speed] || 1;
    var sz = { small: 0.7, normal: 1, big: 1.5 }[s.size] || 1;
    for (var i = 0; i < count; i++) {
      var sp = document.createElement('span');
      sp.textContent = set_[i % set_.length];
      sp.style.setProperty('--i', i);
      sp.style.left = rand(0, 98).toFixed(1) + '%';
      sp.style.fontSize = (rand(18, 38) * sz).toFixed(0) + 'px';
      sp.style.animationDuration = (rand(16, 34) * dur).toFixed(1) + 's, ' + rand(3, 6).toFixed(1) + 's';
      sp.style.animationDelay = '-' + rand(0, 34).toFixed(1) + 's, -' + rand(0, 6).toFixed(1) + 's';
      sp.style.opacity = rand(0.28, 0.6).toFixed(2);
      layer.appendChild(sp);
    }
  }

  function render(s, preview) {
    var t = preview && THEMES[s.theme] ? s.theme : themeFor(s);
    root.dataset.theme = t;
    var f = FONTS[s.font] ? s.font : 'quicksand';
    loadFont(f);
    root.style.setProperty('--sh-font', "'" + FONTS[f][0] + "'");
    var m = document.querySelector('meta[name=theme-color]');
    if (m) m.setAttribute('content', getComputedStyle(root).getPropertyValue('--accent').trim() || '#8b5cf6');
    setTexts(s);
    buildLayer(s, t);
    updateBtn();
    if (picker) markActive();
  }

  // ---------- load settings from server (auto refresh) ----------
  function load() {
    fetch('/api/site-settings', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        site = merge(DEF, j);
        lsSet('sh_site', JSON.stringify(site));
        if (!draft) render(site);
      })
      .catch(function () {});
  }

  function refreshAdmin() {
    return fetch('/api/me', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { isAdmin = !!(j && j.user && j.user.role === 'admin'); updateBtn(); return isAdmin; })
      .catch(function () { return isAdmin; });
  }

  // ---------- 🎨 button ----------
  function updateBtn() {
    if (!btn) return;
    btn.style.display = site.lock && !isAdmin ? 'none' : '';
    btn.title = isAdmin ? 'App ka look (admin)' : 'Change theme';
  }

  function buildButton() {
    btn = document.createElement('button');
    btn.id = 'theme-btn';
    btn.type = 'button';
    btn.textContent = '🎨';
    document.body.appendChild(btn);

    picker = document.createElement('div');
    picker.id = 'theme-panel';
    picker.className = 'hidden';
    var html = '<div class="th-title">Pick a theme</div><div class="th-grid">';
    ORDER.forEach(function (k) {
      html += '<button type="button" data-t="' + k + '"><span class="th-ic">' + THEMES[k].icon + '</span>' + THEMES[k].name + '</button>';
    });
    html += '</div><label class="th-anim"><input type="checkbox" id="th-anim"> Floating stickers (live wallpaper)</label>';
    picker.innerHTML = html;
    document.body.appendChild(picker);

    btn.onclick = function () {
      (isAdmin ? Promise.resolve(true) : refreshAdmin()).then(function (a) {
        if (a) { picker.classList.add('hidden'); openLook(); }
        else picker.classList.toggle('hidden');
      });
    };
    picker.querySelectorAll('[data-t]').forEach(function (b) {
      b.onclick = function () { lsSet('sh_pick', b.dataset.t); render(site); };
    });
    picker.querySelector('#th-anim').onchange = function (e) {
      lsSet('sh_anim', e.target.checked ? '1' : '0');
      layer.style.display = e.target.checked && site.anim ? '' : 'none';
    };
    document.addEventListener('click', function (e) {
      if (!picker.classList.contains('hidden') && !picker.contains(e.target) && e.target !== btn) picker.classList.add('hidden');
    });
    updateBtn();
  }

  function markActive() {
    picker.querySelectorAll('[data-t]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.t === root.dataset.theme);
    });
    var cb = picker.querySelector('#th-anim');
    if (cb) cb.checked = animOn(site);
  }

  // ---------- admin panel ----------
  function opts(list, cur) {
    return list.map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('');
  }

  function openLook() {
    closeLook();
    draft = merge(DEF, site);
    if (!THEMES[draft.theme]) { draft.theme = root.dataset.theme; draft.lock = 1; }

    modal = document.createElement('div');
    modal.id = 'look-modal';
    var th = ORDER.map(function (k) {
      return '<button type="button" data-lt="' + k + '"><span>' + THEMES[k].icon + '</span>' + THEMES[k].name + '</button>';
    }).join('');
    var packs = PACKS.map(function (p, i) { return '<button type="button" data-pk="' + i + '">' + p[1].slice(0, 2) + ' ' + p[0] + '</button>'; }).join('');
    modal.innerHTML =
      '<div class="lk-card">' +
        '<div class="lk-head"><b>🎨 App ka look</b><button type="button" id="lk-x">✖</button></div>' +
        '<div class="muted">Yahan jo badlegi wo sab ke app me khud lag jayega.</div>' +
        '<div class="lk-sec">🎨 Theme</div><div class="lk-grid">' + th + '</div>' +
        '<div class="lk-sec">🔤 Font</div>' +
        '<select id="lk-font">' + opts(Object.keys(FONTS).map(function (k) { return [k, FONT_LABEL[k]]; }), draft.font) + '</select>' +
        '<div class="lk-prev" id="lk-prev">Ye font aisa dikhega: Aa Bb Cc 123 ✨</div>' +
        '<div class="lk-sec">✨ Live emoji wallpaper</div>' +
        '<label class="inline"><input type="checkbox" id="lk-anim"> Emoji udte rahe</label>' +
        '<div class="lk-row">' +
          '<select id="lk-density">' + opts([['few', 'Kam emoji'], ['normal', 'Normal'], ['many', 'Bahut emoji']], draft.density) + '</select>' +
          '<select id="lk-speed">' + opts([['slow', 'Dheere'], ['normal', 'Normal speed'], ['fast', 'Tez']], draft.speed) + '</select>' +
          '<select id="lk-size">' + opts([['small', 'Chhote'], ['normal', 'Normal size'], ['big', 'Bade']], draft.size) + '</select>' +
        '</div>' +
        '<input id="lk-emoji" placeholder="Apne emoji likh (khali = theme ke emoji)" maxlength="120">' +
        '<div class="lk-packs">' + packs + '<button type="button" data-pk="-1">↺ Theme wale</button></div>' +
        '<div class="lk-sec">📝 App ka text</div>' +
        '<input id="lk-name" placeholder="App ka naam (default: Social Hub)" maxlength="40">' +
        '<input id="lk-tag" placeholder="Login page ki line (default: One post. All your accounts.)" maxlength="80">' +
        '<input id="lk-ann" placeholder="Upar ka banner message (khali = koi banner nahi)" maxlength="200">' +
        '<label class="inline"><input type="checkbox" id="lk-lock"> Sab ko yehi theme dikhao (clients badal na sakein)</label>' +
        '<div class="lk-actions"><button type="button" class="primary" id="lk-save">💾 Save</button><button type="button" id="lk-reset">Default</button></div>' +
        '<div id="lk-msg" class="muted"></div>' +
      '</div>';
    document.body.appendChild(modal);

    function $(id) { return modal.querySelector('#' + id); }
    $('lk-emoji').value = draft.emoji;
    $('lk-name').value = draft.appName;
    $('lk-tag').value = draft.tagline;
    $('lk-ann').value = draft.announce;
    $('lk-anim').checked = !!draft.anim;
    $('lk-lock').checked = !!draft.lock;

    function sync() {
      modal.querySelectorAll('[data-lt]').forEach(function (b) { b.classList.toggle('on', b.dataset.lt === draft.theme); });
      var f = FONTS[draft.font] ? draft.font : 'quicksand';
      loadFont(f);
      $('lk-prev').style.fontFamily = "'" + FONTS[f][0] + "', sans-serif";
    }
    function live() { render(draft, true); sync(); }

    modal.querySelectorAll('[data-lt]').forEach(function (b) {
      b.onclick = function () { draft.theme = b.dataset.lt; live(); };
    });
    modal.querySelectorAll('[data-pk]').forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.pk;
        draft.emoji = i >= 0 ? PACKS[i][1] : '';
        $('lk-emoji').value = draft.emoji;
        live();
      };
    });
    $('lk-font').onchange = function (e) { draft.font = e.target.value; live(); };
    $('lk-density').onchange = function (e) { draft.density = e.target.value; live(); };
    $('lk-speed').onchange = function (e) { draft.speed = e.target.value; live(); };
    $('lk-size').onchange = function (e) { draft.size = e.target.value; live(); };
    $('lk-anim').onchange = function (e) { draft.anim = e.target.checked ? 1 : 0; live(); };
    $('lk-lock').onchange = function (e) { draft.lock = e.target.checked ? 1 : 0; };
    var et;
    $('lk-emoji').oninput = function (e) { draft.emoji = e.target.value; clearTimeout(et); et = setTimeout(live, 350); };
    $('lk-name').oninput = function (e) { draft.appName = e.target.value; live(); };
    $('lk-tag').oninput = function (e) { draft.tagline = e.target.value; live(); };
    $('lk-ann').oninput = function (e) { draft.announce = e.target.value; live(); };

    $('lk-x').onclick = function () { closeLook(); render(site); };
    modal.addEventListener('click', function (e) { if (e.target === modal) { closeLook(); render(site); } });

    function msg(t) { $('lk-msg').textContent = t; }
    $('lk-save').onclick = function () {
      msg('Save ho raha hai...');
      fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Error'); return j; }); })
        .then(function (j) {
          site = merge(DEF, j);
          lsSet('sh_site', JSON.stringify(site));
          if (site.theme) lsSet('sh_pick', site.theme);
          msg('Saved ✅ Sab ke app me 1 minute me aa jayega.');
          draft = null;
          render(site);
          setTimeout(closeLook, 900);
        })
        .catch(function (e) { msg('Save nahi hua: ' + e.message); });
    };
    $('lk-reset').onclick = function () {
      if (!confirm('Sab default kar du?')) return;
      fetch('/api/admin/site-settings', { method: 'DELETE' })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          site = merge(DEF, j);
          lsSet('sh_site', JSON.stringify(site));
          try { localStorage.removeItem('sh_pick'); } catch (e) {}
          draft = null;
          closeLook();
          render(site);
        })
        .catch(function (e) { msg('Reset nahi hua: ' + e.message); });
    };

    live();
  }

  function closeLook() {
    if (modal) { modal.remove(); modal = null; }
    draft = null;
  }

  // ---------- start ----------
  function init() {
    render(site);
    buildButton();
    render(site);
    load();
    refreshAdmin();
    setInterval(function () { if (!document.hidden) load(); }, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) load(); });
    var appEl = document.getElementById('app');
    if (appEl && window.MutationObserver) {
      new MutationObserver(function () {
        if (!appEl.classList.contains('hidden')) { refreshAdmin(); setTexts(draft || site); }
      }).observe(appEl, { attributes: true, attributeFilter: ['class'] });
    }
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { buildLayer(draft || site, root.dataset.theme); }, 400); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
