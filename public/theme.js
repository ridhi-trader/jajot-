// Look of the app: themes, fonts, live emoji wallpaper, app texts.
// The admin sets the defaults from the 🎨 button; every visitor gets them automatically.
(function () {
  'use strict';

  var THEMES = {
    candy:    { name: 'Candy',    icon: '🍬', c: ['#8b5cf6', '#ec4899', '#fdf2f8'], emoji: ['🌸', '✨', '💌', '📣', '⭐', '🦋', '☁️', '💖'] },
    ocean:    { name: 'Ocean',    icon: '🌊', c: ['#0ea5e9', '#14b8a6', '#e0f7ff'], emoji: ['🐚', '🐠', '🐳', '🌊', '💧', '⭐', '🫧', '🪸'] },
    forest:   { name: 'Forest',   icon: '🌿', c: ['#16a34a', '#ca8a04', '#ecfce5'], emoji: ['🌿', '🍃', '🦋', '🐞', '🌼', '🍄', '🐝', '🌳'] },
    sunset:   { name: 'Sunset',   icon: '🌅', c: ['#f97316', '#e11d48', '#fff1e6'], emoji: ['🌅', '🔥', '🧡', '🌴', '🦩', '☀️', '🍊', '✨'] },
    sweet:    { name: 'Sweet',    icon: '🧁', c: ['#ec4899', '#f59e0b', '#fff7d6'], emoji: ['🧁', '🍓', '🍩', '🍭', '🎀', '🍰', '🍒', '🧸'] },
    night:    { name: 'Night',    icon: '🌙', c: ['#a78bfa', '#38bdf8', '#1a1228'], emoji: ['🌙', '⭐', '✨', '🪐', '🦉', '💫', '🌌', '☁️'] },
    rose:     { name: 'Rose',     icon: '🌹', c: ['#f43f5e', '#a855f7', '#fff0f3'], emoji: ['🌹', '💕', '💗', '🌷', '💌', '🎀', '🦢', '✨'] },
    mint:     { name: 'Mint',     icon: '🍀', c: ['#10b981', '#06b6d4', '#e8fff6'], emoji: ['🍀', '🌱', '🍃', '🥝', '🧊', '🐸', '💚', '🫧'] },
    lavender: { name: 'Dreamy',   icon: '🔮', c: ['#6366f1', '#a855f7', '#f5f0ff'], emoji: ['🔮', '🦄', '💜', '🌌', '🫐', '🪻', '✨', '🦋'] },
    gold:     { name: 'Diwali',   icon: '🪔', c: ['#d97706', '#dc2626', '#fffbea'], emoji: ['🪔', '🎆', '✨', '🎇', '🧨', '🪙', '🌟', '🎁'] },
    neon:     { name: 'Neon',     icon: '⚡', c: ['#22d3ee', '#e879f9', '#0b0f1e'], emoji: ['🎮', '⚡', '💎', '🌐', '🛸', '🔮', '💫', '🎧'] },
    coffee:   { name: 'Coffee',   icon: '☕', c: ['#92400e', '#b45309', '#f7efe6'], emoji: ['☕', '🍪', '🥐', '🍂', '📚', '🧸', '🕯️', '🍫'] },
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

  // ---------- admin panel (tabs: Theme / Font / Emoji / Text) ----------
  var POPULAR = '😀😍🥰😎🤩🔥✨💖🎉🎁🌸🌈⭐🌙☀️🍕🍔🍩☕🐶🐱🦋🚀💰📈💼🏆✅📣💡🎯🪔🎆🌹🍀🌊🐼🦄';
  var EMOJI_DB = '😀 smile happy grin|😃 happy smile|😄 laugh happy|😁 grin teeth|😆 laugh haha|😅 sweat relief|🤣 rofl lol funny|😂 joy tears funny hansi|🙂 smile|😉 wink|😊 blush happy|😇 angel halo|🥰 love hearts pyaar|😍 love heart eyes pyaar|🤩 star struck wow|😘 kiss love|😋 yum tasty food|😜 crazy wink tongue|🤗 hug|🤔 think hmm|🤫 shh quiet|😎 cool sunglasses|🥳 party celebrate birthday|🤓 nerd|😏 smirk|😴 sleep|😢 cry sad|😭 sob cry rona|😡 angry mad|🤯 mind blown|😱 scream shock|🥺 please puppy eyes|🤑 money rich paisa|🤖 robot|👻 ghost|💀 skull|👽 alien|💩 poop|🙈 monkey see no evil|😺 cat happy billi|😻 cat love billi|🙌 hands celebrate|👏 clap|🙏 pray namaste thanks|👍 thumbs up like badhiya|👎 thumbs down|👌 ok perfect|✌️ victory peace|🤞 luck fingers crossed|🤟 love you|🤘 rock|👋 wave hello|💪 strong muscle|✍️ write|👀 eyes look|🧠 brain smart|❤️ heart love red pyaar dil|🧡 orange heart|💛 yellow heart|💚 green heart|💙 blue heart|💜 purple heart|🖤 black heart|🤍 white heart|🩷 pink heart|💔 broken heart|💖 sparkling heart pyaar|💗 growing heart|💓 beating heart|💞 two hearts|💕 hearts love pyaar|💘 cupid arrow heart|💝 gift heart|💌 love letter|💋 kiss lips|💯 hundred perfect|💥 boom blast|💫 dizzy star|💦 water drops|💨 dash wind|🔥 fire hot aag|✨ sparkles shine|⭐ star sitara|🌟 glowing star|🌈 rainbow indradhanush|💡 idea bulb|🎯 target goal|🏆 trophy win jeet|🥇 gold medal first|🎖️ medal|👑 crown king queen|💎 diamond gem|🎉 party popper celebrate|🎊 confetti|🎈 balloon|🎁 gift present tohfa|🎂 birthday cake janamdin|🎀 ribbon bow|🪔 diya diwali lamp deepak|🎆 fireworks diwali|🎇 sparkler diwali|🧨 firecracker patakha diwali|🪅 pinata|🎄 christmas tree|🎃 pumpkin halloween|🪁 kite patang|🕉️ om|🛕 mandir temple|🕌 mosque|⛪ church|🌸 cherry blossom flower phool|🌹 rose gulab flower phool|🌺 hibiscus flower phool|🌻 sunflower flower phool|🌼 blossom flower phool|🌷 tulip flower phool|💐 bouquet flowers phool|🪷 lotus kamal flower|🌱 seedling plant|🌿 herb leaf|🍀 clover luck|🍃 leaves wind|🍂 fallen leaf autumn|🍁 maple leaf|🌴 palm tree beach|🌳 tree|🌵 cactus|🍄 mushroom|🐚 shell|🌊 wave sea water|🌙 moon chand|🌕 full moon|☀️ sun suraj|🌤️ sun cloud|⛅ partly cloudy|☁️ cloud|🌧️ rain|⛈️ thunder storm|❄️ snowflake snow|☃️ snowman|⚡ lightning bolt power|🌪️ tornado|🌍 earth globe world|🪐 planet saturn|🌌 galaxy milky way|☄️ comet|🚀 rocket launch|🛸 ufo|🌅 sunrise sunset|🌄 sunrise mountain|🏔️ mountain|🏖️ beach|🏝️ island|🐶 dog puppy kutta|🐱 cat kitten billi|🐭 mouse|🐹 hamster|🐰 rabbit bunny|🦊 fox|🐻 bear|🐼 panda|🐨 koala|🐯 tiger sher|🦁 lion sher|🐮 cow gaay|🐷 pig|🐸 frog|🐵 monkey bandar|🐔 chicken|🐧 penguin|🐦 bird|🦆 duck|🦉 owl|🦅 eagle|🦋 butterfly titli|🐝 bee madhumakkhi|🐞 ladybug|🐛 bug caterpillar|🐌 snail|🐢 turtle|🐍 snake saanp|🦖 dinosaur trex|🐙 octopus|🐠 tropical fish|🐟 fish machhli|🐬 dolphin|🐳 whale|🦈 shark|🐘 elephant haathi|🦒 giraffe|🦓 zebra|🐴 horse ghoda|🦄 unicorn|🐪 camel|🦚 peacock mor|🦜 parrot tota|🦢 swan|🦩 flamingo|🐾 paw prints|🍎 apple seb fruit|🍊 orange santra fruit|🍋 lemon fruit|🍌 banana kela fruit|🍉 watermelon tarbooz fruit|🍇 grapes angoor fruit|🍓 strawberry fruit|🍒 cherries fruit|🍑 peach fruit|🥭 mango aam fruit|🍍 pineapple fruit|🥥 coconut|🥝 kiwi fruit|🍅 tomato|🥑 avocado|🥕 carrot|🌽 corn|🌶️ chilli mirch|🥔 potato aloo|🍞 bread|🧀 cheese|🍳 egg fry|🥞 pancakes|🍔 burger food|🍟 fries food|🍕 pizza food|🌭 hotdog|🥪 sandwich|🌮 taco|🌯 burrito|🍜 noodles ramen|🍝 pasta|🍛 curry rice|🍣 sushi|🍱 bento|🍿 popcorn|🍩 donut sweet|🍪 cookie biscuit|🍰 cake slice|🧁 cupcake|🍫 chocolate|🍬 candy toffee|🍭 lollipop|🍦 ice cream|🍯 honey shahad|☕ coffee tea chai|🍵 green tea chai|🧋 bubble tea|🥤 cold drink|🍺 beer|🍷 wine|🍹 cocktail|🥂 cheers champagne|🥛 milk doodh|🍽️ plate dinner|📱 phone mobile|💻 laptop computer|🖥️ desktop|⌨️ keyboard|📷 camera photo|🎥 video camera|📺 tv|🎧 headphones music|🎤 mic sing|🎵 music note|🎶 music notes|📢 loudspeaker announce|📣 megaphone announce|🔔 bell notification|📧 email mail|📩 envelope|📝 memo note write|📋 clipboard|📌 pin|📍 location pin|🔗 link|🔒 lock secure|🔑 key|🛒 cart shopping|🛍️ shopping bags|💰 money bag paisa|💵 dollar cash paisa|💸 money flying|💳 credit card|🪙 coin sikka|🏦 bank|📈 chart up growth profit|📉 chart down loss|📊 bar chart stats|💼 briefcase business|🧾 receipt bill|📦 package parcel|🚚 delivery truck|📅 calendar date|⏰ alarm clock time|⌛ hourglass|✅ check done|❌ cross wrong|⚠️ warning|❗ exclamation|❓ question|✔️ tick|➕ plus|🆕 new|🆓 free|🔝 top|🔴 red circle|🟢 green circle|🔵 blue circle|🟡 yellow circle|🟣 purple circle|⚪ white circle|⚫ black circle|🔶 orange diamond|🔷 blue diamond|▶️ play|⏩ fast forward|🔄 refresh|♻️ recycle|🏠 house home ghar|🏢 office building|🏪 shop store|🏫 school|🏥 hospital|🚗 car gaadi|🚕 taxi|🚌 bus|🚲 bicycle cycle|🏍️ bike motorcycle|✈️ plane flight|🚂 train|⛵ boat|🚢 ship|🧳 luggage travel|🗺️ map|🧭 compass|⚽ football soccer|🏏 cricket|🏀 basketball|🎾 tennis|🏸 badminton|🏑 hockey|🎮 game controller|🎲 dice|♟️ chess|🧩 puzzle|🎨 art palette paint|🖌️ brush|✏️ pencil|📚 books study|📖 book|🎓 graduation|🔬 science|🧪 test tube|💊 medicine|🩺 doctor stethoscope|🧘 yoga meditation|🏋️ gym weights|🛠️ tools|🔧 wrench|⚙️ gear settings|🧲 magnet|🔍 search magnifier|🔭 telescope|🕯️ candle|🪞 mirror|🛋️ sofa|🛏️ bed|🚿 shower|🧼 soap|👗 dress|👕 tshirt|👟 shoes sneakers|👜 handbag|🕶️ sunglasses|💄 lipstick|💍 ring';
  var EMO = EMOJI_DB.split('|').map(function (s) { var i = s.indexOf(' '); return [s.slice(0, i), s.slice(i + 1).toLowerCase()]; });
  (function () { var seen = {}; EMO = EMO.filter(function (e) { if (seen[e[0]]) return false; seen[e[0]] = 1; return true; }); })();
  function loadEmojiData(cb) { cb(); }

  function loadAllFonts() {
    if (document.getElementById('sh-font-all')) return;
    var fam = Object.keys(FONTS).map(function (k) { return 'family=' + FONTS[k][1]; }).join('&');
    var l = document.createElement('link');
    l.id = 'sh-font-all';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?' + fam + '&display=swap';
    document.head.appendChild(l);
  }

  function loadPanelCss() {
    if (document.getElementById('look-css')) return;
    var l = document.createElement('link');
    l.id = 'look-css';
    l.rel = 'stylesheet';
    l.href = '/look-panel.css?v=2';
    document.head.appendChild(l);
  }

  function seg(key, list, cur) {
    return '<div class="lp-seg">' + list.map(function (o) {
      return '<button type="button" data-sk="' + key + '" data-sv="' + o[0] + '"' + (o[0] === cur ? ' class="on"' : '') + '>' + o[1] + '</button>';
    }).join('') + '</div>';
  }

  function openLook() {
    closeLook();
    loadPanelCss();
    draft = merge(DEF, site);
    if (!THEMES[draft.theme]) { draft.theme = root.dataset.theme; }

    modal = document.createElement('div');
    modal.id = 'look-modal';

    var themeTiles = ORDER.map(function (k) {
      var c = THEMES[k].c;
      return '<button type="button" class="lp-tile" data-lt="' + k + '">' +
        '<span class="lp-sw" style="background:linear-gradient(135deg,' + c[2] + ' 0%,' + c[0] + ' 55%,' + c[1] + ' 100%)"></span>' +
        '<span class="lp-nm">' + THEMES[k].icon + ' ' + THEMES[k].name + '</span></button>';
    }).join('');

    var fontTiles = Object.keys(FONTS).map(function (k) {
      return '<button type="button" class="lp-font" data-lf="' + k + '" style="font-family:\'' + FONTS[k][0] + '\',sans-serif">' +
        '<b>' + FONTS[k][0] + '</b><span>Social Hub 123 ✨</span><i>✔</i></button>';
    }).join('');

    var packBtns = PACKS.map(function (p, i) {
      return '<button type="button" class="lp-pack" data-pk="' + i + '">' + graphemes(p[1]).slice(0, 3).join('') + ' ' + p[0] + '</button>';
    }).join('');

    modal.innerHTML =
      '<div class="lp-card">' +
        '<div class="lp-head"><b>🎨 App ka look</b><button type="button" id="lp-x" aria-label="Close">✖</button></div>' +
        '<div class="lp-tabs">' +
          '<button type="button" data-tab="theme" class="on">🎨<span>Theme</span></button>' +
          '<button type="button" data-tab="font">🔤<span>Font</span></button>' +
          '<button type="button" data-tab="emoji">✨<span>Emoji</span></button>' +
          '<button type="button" data-tab="text">📝<span>Text</span></button>' +
        '</div>' +
        '<div class="lp-body">' +
          '<div class="lp-pane" data-pane="theme">' +
            '<div class="lp-help">👆 Jo pasand aaye us pe daba. Upar app turant badal jayega.</div>' +
            '<div class="lp-grid">' + themeTiles + '</div>' +
          '</div>' +
          '<div class="lp-pane hidden" data-pane="font">' +
            '<div class="lp-help">👆 Jo font pasand aaye us pe daba. Har font apne style me likha hai.</div>' +
            '<div class="lp-fonts">' + fontTiles + '</div>' +
          '</div>' +
          '<div class="lp-pane hidden" data-pane="emoji">' +
            '<label class="lp-switch"><input type="checkbox" id="lp-anim"><span>✨ Emoji udte rahe (live wallpaper)</span></label>' +
            '<div class="lp-h">1️⃣ Kaun se emoji?</div>' +
            '<div class="lp-packs"><button type="button" class="lp-pack" data-pk="-1">🪄 Auto (theme wale)</button>' + packBtns + '</div>' +
            '<div class="lp-h">2️⃣ Tere chune hue emoji <small>(hatane ke liye daba)</small></div>' +
            '<div id="lp-sel" class="lp-sel"></div>' +
            '<div class="lp-h">3️⃣ Naya emoji dhundh <small>(English me: cat, love, flower, fire...)</small></div>' +
            '<input id="lp-q" type="search" placeholder="🔍 Emoji dhundo..." autocomplete="off">' +
            '<div id="lp-res" class="lp-res"></div>' +
            '<div class="lp-h">4️⃣ Kitne, kitna tez, kitne bade</div>' +
            '<div class="lp-lbl">Kitne emoji</div>' + seg('density', [['few', 'Kam'], ['normal', 'Normal'], ['many', 'Zyada']], draft.density) +
            '<div class="lp-lbl">Speed</div>' + seg('speed', [['slow', 'Dheere'], ['normal', 'Normal'], ['fast', 'Tez']], draft.speed) +
            '<div class="lp-lbl">Size</div>' + seg('size', [['small', 'Chhote'], ['normal', 'Normal'], ['big', 'Bade']], draft.size) +
          '</div>' +
          '<div class="lp-pane hidden" data-pane="text">' +
            '<div class="lp-help">Yahan jo likhegi wo app me khud badal jayega. Khali chhodo to purana text rahega.</div>' +
            '<div class="lp-lbl">App ka naam</div><input id="lp-name" placeholder="Social Hub" maxlength="40">' +
            '<div class="lp-lbl">Login page ki line</div><input id="lp-tag" placeholder="One post. All your accounts." maxlength="80">' +
            '<div class="lp-lbl">Upar ka banner (offer ya message)</div><input id="lp-ann" placeholder="Jaise: Diwali offer 🪔" maxlength="200">' +
          '</div>' +
        '</div>' +
        '<div class="lp-foot">' +
          '<label class="lp-switch"><input type="checkbox" id="lp-lock"><span>🔒 Lock: clients theme na badal sakein (band rakho = sab badal sakein)</span></label>' +
          '<div class="lp-actions"><button type="button" class="primary" id="lp-save">💾 Save karo</button><button type="button" id="lp-reset">Default</button></div>' +
          '<div id="lp-msg" class="muted"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    function $(id) { return modal.querySelector('#' + id); }
    $('lp-name').value = draft.appName;
    $('lp-tag').value = draft.tagline;
    $('lp-ann').value = draft.announce;
    $('lp-anim').checked = !!draft.anim;
    $('lp-lock').checked = !!draft.lock;

    function msg(t) { $('lp-msg').textContent = t; }

    function paintSel() {
      var arr = graphemes(draft.emoji);
      $('lp-sel').innerHTML = arr.length
        ? arr.map(function (g, i) { return '<button type="button" class="lp-e" data-rm="' + i + '" title="Hatao">' + g + '</button>'; }).join('') +
          '<button type="button" class="lp-clear" data-clear="1">🗑 Sab hatao</button>'
        : '<span class="muted">Abhi auto hai: ' + THEMES[root.dataset.theme].emoji.join(' ') + '</span>';
    }

    function paint() {
      modal.querySelectorAll('[data-lt]').forEach(function (b) { b.classList.toggle('on', b.dataset.lt === draft.theme); });
      modal.querySelectorAll('[data-lf]').forEach(function (b) { b.classList.toggle('on', b.dataset.lf === draft.font); });
      modal.querySelectorAll('[data-sk]').forEach(function (b) { b.classList.toggle('on', draft[b.dataset.sk] === b.dataset.sv); });
      paintSel();
    }
    function live() { render(draft, true); paint(); }

    function showResults(q) {
      var res = $('lp-res');
      q = (q || '').toLowerCase().trim();
      var list;
      if (!q) {
        list = graphemes(POPULAR);
      } else {
        var words = q.split(/\s+/);
        list = EMO.filter(function (e) {
          var k = ' ' + e[1];
          return words.every(function (w) { return k.indexOf(' ' + w) > -1; });
        }).slice(0, 60).map(function (e) { return e[0]; });
      }
      res.innerHTML = list.length
        ? list.map(function (g) { return '<button type="button" class="lp-e" data-add="' + g + '">' + g + '</button>'; }).join('')
        : '<span class="muted">Kuch nahi mila. English me dusra shabd try kar (jaise: heart, star, cake).</span>';
    }

    function showTab(name) {
      modal.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === name); });
      modal.querySelectorAll('[data-pane]').forEach(function (p) { p.classList.toggle('hidden', p.dataset.pane !== name); });
      if (name === 'font') loadAllFonts();
      if (name === 'emoji') loadEmojiData(function () { showResults($('lp-q').value); });
    }

    modal.addEventListener('click', function (e) {
      var b;
      if (e.target.closest('#lp-x')) { closeLook(); render(site); return; }
      if ((b = e.target.closest('[data-tab]'))) return showTab(b.dataset.tab);
      if ((b = e.target.closest('[data-lt]'))) { draft.theme = b.dataset.lt; return live(); }
      if ((b = e.target.closest('[data-lf]'))) { draft.font = b.dataset.lf; return live(); }
      if ((b = e.target.closest('[data-sk]'))) { draft[b.dataset.sk] = b.dataset.sv; return live(); }
      if ((b = e.target.closest('[data-pk]'))) {
        var i = +b.dataset.pk;
        draft.emoji = i >= 0 ? PACKS[i][1] : '';
        return live();
      }
      if ((b = e.target.closest('[data-add]'))) {
        var arr = graphemes(draft.emoji);
        if (arr.length >= 24) { msg('Max 24 emoji. Pehle kuch hatao.'); return; }
        arr.push(b.dataset.add);
        draft.emoji = arr.join('');
        msg('');
        return live();
      }
      if ((b = e.target.closest('[data-rm]'))) {
        var a2 = graphemes(draft.emoji);
        a2.splice(+b.dataset.rm, 1);
        draft.emoji = a2.join('');
        return live();
      }
      if (e.target.closest('[data-clear]')) { draft.emoji = ''; return live(); }
    });

    $('lp-anim').onchange = function (e) { draft.anim = e.target.checked ? 1 : 0; live(); };
    $('lp-lock').onchange = function (e) { draft.lock = e.target.checked ? 1 : 0; };
    $('lp-q').oninput = function (e) { if (EMO) showResults(e.target.value); };
    $('lp-name').oninput = function (e) { draft.appName = e.target.value; live(); };
    $('lp-tag').oninput = function (e) { draft.tagline = e.target.value; live(); };
    $('lp-ann').oninput = function (e) { draft.announce = e.target.value; live(); };

    $('lp-save').onclick = function () {
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
          setTimeout(closeLook, 1000);
        })
        .catch(function (e) { msg('Save nahi hua: ' + e.message); });
    };
    $('lp-reset').onclick = function () {
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
