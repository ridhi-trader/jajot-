// Emoji picker for the compose boxes. Emojis are plain Unicode text, so they post on every platform.
(() => {
  const SETS = {
    'Diwali': ['🪔','🎆','🎇','✨','🎉','🎊','🪙','💰','🙏','🕉️','🏠','🌟','🎁','🍬','🧨','🌸','🌼','🏵️','🌺','❤️','🧡','💛','🛍️','👗','🥻','🍫','🍪','🥮','🫙','🕯️','🎶','🏮','💫','⭐','🌙','🔔','🪷','🛕','🤝','🫂','👨‍👩‍👧‍👦','😊','🥳','💐'],
    'Festivals': ['🎄','🎅','🎁','🥂','🍾','🎊','🎈','🎂','🕌','🌙','⭐','🕍','🪁','🌈','🎨','💦','🌾','🐘','🐅','🚩','🇮🇳','🧿','🪔','🔱','🛕','🙏','🪷','🌸','🎭','🥁','🎵','🎶','🎤','🧧','🎆','🎇','🎃','🐰','🥚','🌷','☀️','🌻'],
    'Faces': ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','🙂','😉','😍','🥰','😘','😗','😋','😎','🤩','🥳','😇','🤗','🤔','🤝','😌','😴','😏','😬','🙃','😮','😲','😳','🥺','😢','😭','😤','😡','🤯','🤒','🥵','🥶','😱','🤫','🤭','😜','🤪'],
    'Hands': ['👍','👏','🙌','🙏','💪','🤝','👌','✌️','🤞','👋','👉','👈','👇','☝️','🤙','🫶','🤲','🫰','🤟','🖐️','✋','🖖','👊','✊','🤛','🤜','🙋','🙆','💁','🤷','🕺','💃','🚶','🏃','👨‍💼','👩‍💼','👨‍🍳','👩‍🍳','🧑‍🔧','🧑‍⚕️'],
    'Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💖','💗','💓','💞','💕','💝','💘','💟','❣️','💔','❤️‍🔥','💯','🔥','⭐','🌟','💥','✨','⚡','🌈','🎀','🌹','🌷','🌺','🌻','🌼','🪻','🌸'],
    'Business': ['📢','📣','✅','☑️','📌','📍','📞','☎️','📱','💻','✉️','📧','🌐','💼','📈','📊','🏆','🥇','🎯','⏰','⏳','🗓️','📅','🛒','🏷️','🆕','🔔','💳','💵','💸','🧾','📦','🚚','🏪','🏢','🏭','🔑','🔒','📝','📋','📎','🖊️','🤝','🙏','🔖','🆓','🔥','❗','‼️','⚠️'],
    'Offer': ['🛍️','🛒','🏷️','💥','🔥','🎁','🎉','🆕','🆓','💯','💰','💸','🤑','🪙','💳','🧾','📣','📢','⏰','⏳','⚡','✅','👉','👇','🔔','🎯','🏆','⭐','🌟','✨','‼️','❗','🚨','📍','📞','📱','🚚','🏃','🎟️','🎫','🧧','🏅'],
    'Food': ['🍬','🍫','🍭','🍪','🍩','🍰','🎂','🧁','🥮','🍯','🥜','🍿','🍕','🍔','🍟','🌭','🌮','🌯','🥗','🍜','🍝','🍛','🍲','🍚','🍙','🍘','🥘','🥟','🥞','🧇','🍞','🥐','🧀','🍎','🍌','🍇','🍉','🍊','🥭','🍍','🥥','☕','🍵','🥛','🥤','🧃','🍹','🍷','🥂','🍾'],
    'Nature': ['🌸','🌺','🌻','🌼','🌷','🌹','🪷','🏵️','💐','🌿','🍀','🌱','🌳','🌴','🌵','🍁','🍂','🍃','🌾','☀️','🌤️','⛅','🌈','🌙','⭐','🌟','✨','⚡','🔥','💧','🌊','❄️','🐘','🦚','🦋','🐝','🐞','🐶','🐱','🐄','🐅','🦁','🐒','🐦'],
    'Symbols': ['✅','❌','⭕','❗','❓','‼️','⚠️','🚫','➡️','⬅️','⬆️','⬇️','↗️','🔝','🔜','🔚','➕','➖','✖️','♻️','🔱','🕉️','☮️','♾️','🆗','🆒','🆕','🆓','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🔶','🔷','▶️','⏸️','🔁','💬','💭','🗯️','©️','®️','™️'],
  };

  const css = document.createElement('style');
  css.textContent = `
    .emo-bar { margin: 0 0 6px; }
    .emo-panel { border: 1px solid var(--line); border-radius: 8px; padding: 8px; margin-bottom: 8px; background: var(--card); }
    .emo-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
    .emo-tabs button { padding: 3px 10px; font-size: 13px; }
    .emo-tabs button.on { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
    .emo-grid { display: flex; flex-wrap: wrap; gap: 4px; max-height: 260px; overflow-y: auto; }
    .emo-grid button { border: 0; background: transparent; font-size: 32px; padding: 4px 6px; line-height: 1.1; min-width: 46px; }
    .emo-grid button:hover { background: var(--bg); }
    .fnt-help { font-size: 13px; color: var(--muted); margin-bottom: 6px; }
    .fnt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 6px; }
    .fnt-grid button { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 4px; }
    .fnt-grid button b { font-size: 17px; font-weight: 400; }
    .fnt-grid button small { font-size: 11px; opacity: .7; }
  `;
  document.head.appendChild(css);

  const main = document.getElementById('c-text');
  if (!main) return;
  let target = main;
  document.addEventListener('focusin', (e) => {
    const t = e.target;
    if (t === main || (t.tagName === 'TEXTAREA' && t.closest('#c-captions'))) target = t;
  });

  const bar = document.createElement('div');
  bar.className = 'emo-bar';
  bar.innerHTML = '<button type="button" id="emo-toggle">😀 Emoji</button> <button type="button" id="fnt-toggle">𝓐𝓪 Font</button>';
  const panel = document.createElement('div');
  panel.className = 'emo-panel hidden';
  panel.innerHTML = '<div class="emo-tabs"></div><div class="emo-grid"></div>';
  main.parentNode.insertBefore(bar, main);
  main.parentNode.insertBefore(panel, main);
  const fpanel = document.createElement('div');
  fpanel.className = 'emo-panel hidden';
  main.parentNode.insertBefore(fpanel, main);

  const tabs = panel.querySelector('.emo-tabs');
  const grid = panel.querySelector('.emo-grid');

  function insert(ch) {
    const ta = target || main;
    const s = ta.selectionStart == null ? ta.value.length : ta.selectionStart;
    const e = ta.selectionEnd == null ? s : ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + ch + ta.value.slice(e);
    const pos = s + ch.length;
    ta.focus();
    ta.setSelectionRange(pos, pos);
    ta.dispatchEvent(new Event('input', { bubbles: true })); // saves draft + updates counts
  }

  function showSet(name) {
    tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.set === name));
    grid.innerHTML = '';
    for (const ch of SETS[name]) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = ch;
      b.onmousedown = (ev) => ev.preventDefault(); // keep cursor in the text box
      b.onclick = () => insert(ch);
      grid.appendChild(b);
    }
  }
  for (const name of Object.keys(SETS)) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.set = name;
    b.textContent = name;
    b.onclick = () => showSet(name);
    tabs.appendChild(b);
  }
  showSet('Diwali');

  document.getElementById('emo-toggle').onclick = () => { fpanel.classList.add('hidden'); panel.classList.toggle('hidden'); };

  // ---- Font styles: plain Unicode letters, so the style posts on every platform ----
  const R = (up, lo, dg, ex) => ({ up, lo, dg, ex: ex || {} });
  const STYLES = [
    ['Bold', R(0x1D400, 0x1D41A, 0x1D7CE)],
    ['Italic', R(0x1D434, 0x1D44E, null, { h: 0x210E })],
    ['Bold Italic', R(0x1D468, 0x1D482)],
    ['Script', R(0x1D49C, 0x1D4B6, null, { B: 0x212C, E: 0x2130, F: 0x2131, H: 0x210B, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211B, e: 0x212F, g: 0x210A, o: 0x2134 })],
    ['Bold Script', R(0x1D4D0, 0x1D4EA)],
    ['Outline', R(0x1D538, 0x1D552, 0x1D7D8, { C: 0x2102, H: 0x210D, N: 0x2115, P: 0x2119, Q: 0x211A, R: 0x211D, Z: 0x2124 })],
    ['Sans', R(0x1D5A0, 0x1D5BA, 0x1D7E2)],
    ['Sans Bold', R(0x1D5D4, 0x1D5EE, 0x1D7EC)],
    ['Sans Italic', R(0x1D608, 0x1D622)],
    ['Typewriter', R(0x1D670, 0x1D68A, 0x1D7F6)],
  ];
  const REV = {}; // styled char -> plain char
  function mapChar(c, st) {
    const code = c.charCodeAt(0);
    if (st.ex[c]) return String.fromCodePoint(st.ex[c]);
    if (code >= 65 && code <= 90) return String.fromCodePoint(st.up + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(st.lo + code - 97);
    if (st.dg && code >= 48 && code <= 57) return String.fromCodePoint(st.dg + code - 48);
    return c;
  }
  for (const [, st] of STYLES) {
    for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
      const m = mapChar(c, st);
      if (m !== c) REV[m] = c;
    }
  }
  function plain(str) { return Array.from(str).map((ch) => REV[ch] || ch).join(''); }
  function style(str, st) {
    return Array.from(plain(str)).map((ch) => (st ? mapChar(ch, st) : ch)).join('');
  }
  function applyStyle(st) {
    const ta = target || main;
    let s = ta.selectionStart, e = ta.selectionEnd;
    if (s == null || s === e) { s = 0; e = ta.value.length; } // nothing selected: whole text
    const out = style(ta.value.slice(s, e), st);
    ta.value = ta.value.slice(0, s) + out + ta.value.slice(e);
    ta.focus();
    ta.setSelectionRange(s, s + out.length);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
  fpanel.innerHTML = '<div class="fnt-help">Text select karo (ya kuch select na karo to poora text). Phir style daba do.</div><div class="fnt-grid"></div>';
  const fgrid = fpanel.querySelector('.fnt-grid');
  [['Normal', null]].concat(STYLES).forEach(([name, st]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<b>' + (st ? style('Abc 123', st) : 'Abc 123') + '</b><small>' + name + '</small>';
    b.onmousedown = (ev) => ev.preventDefault();
    b.onclick = () => applyStyle(st);
    fgrid.appendChild(b);
  });
  document.getElementById('fnt-toggle').onclick = () => { panel.classList.add('hidden'); fpanel.classList.toggle('hidden'); };
})();
