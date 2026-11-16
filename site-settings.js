// Admin-controlled look of the app (theme, font, floating emoji, texts).
// Public read: GET /api/site-settings   Admin write: PUT /api/admin/site-settings
const THEMES = ['candy', 'ocean', 'forest', 'sunset', 'sweet', 'night', 'rose', 'mint', 'lavender', 'gold', 'neon', 'coffee'];
const FONTS = ['quicksand', 'poppins', 'nunito', 'fredoka', 'baloo2', 'comfortaa', 'caveat', 'playfair', 'inter'];

const pick = (v, list, d) => (list.includes(v) ? v : d);
const str = (v, n) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n) : '');

function cleanEmoji(v) {
  if (typeof v !== 'string') return '';
  const out = [];
  const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  for (const { segment } of seg.segment(v.slice(0, 300))) {
    if (/^[\s\p{L}\p{N}]/u.test(segment)) continue; // emoji only, no letters / digits / spaces
    out.push(segment);
    if (out.length >= 24) break;
  }
  return out.join('');
}

function clean(i) {
  i = i && typeof i === 'object' ? i : {};
  return {
    theme: pick(i.theme, THEMES, ''),
    lock: i.lock ? 1 : 0,
    font: pick(i.font, FONTS, 'quicksand'),
    emoji: cleanEmoji(i.emoji),
    anim: i.anim === 0 || i.anim === false || i.anim === '0' ? 0 : 1,
    density: pick(i.density, ['few', 'normal', 'many'], 'normal'),
    speed: pick(i.speed, ['slow', 'normal', 'fast'], 'normal'),
    size: pick(i.size, ['small', 'normal', 'big'], 'normal'),
    appName: str(i.appName, 40),
    tagline: str(i.tagline, 80),
    announce: str(i.announce, 200),
  };
}

function routes(app, { auth, db }) {
  db.exec('CREATE TABLE IF NOT EXISTS site_settings (k TEXT PRIMARY KEY, v TEXT NOT NULL)');

  function read() {
    try {
      const r = db.prepare("SELECT v FROM site_settings WHERE k='look'").get();
      return clean(r ? JSON.parse(r.v) : {});
    } catch {
      return clean({});
    }
  }

  app.get('/api/site-settings', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(read());
  });

  app.put('/api/admin/site-settings', auth, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const s = clean(req.body);
    db.prepare("INSERT INTO site_settings (k, v) VALUES ('look', ?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run(
      JSON.stringify(s)
    );
    res.json(s);
  });

  app.delete('/api/admin/site-settings', auth, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    db.prepare("DELETE FROM site_settings WHERE k='look'").run();
    res.json(clean({}));
  });
}

module.exports = { routes, clean };
