/* ================================================
   PROJECT CANVAS PREVIEWS — Deep Jalgariya Portfolio
   Draws 3 detailed UI mockups using Canvas 2D API
================================================ */

(function drawProjectPreviews() {

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function lbl(ctx, text, x, y, color, size, bold) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = (bold ? '700' : '500') + ' ' + size + 'px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function pill(ctx, x, y, w, h, bg, text, tc) {
    ctx.save();
    rr(ctx, x, y, w, h, h / 2);
    ctx.fillStyle = bg; ctx.fill();
    ctx.fillStyle = tc;
    ctx.font = '600 ' + Math.round(h * 0.52) + 'px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
    ctx.restore();
  }

  function bars(ctx, x, y, w, h, vals, color) {
    var bw = (w / vals.length) - 3;
    vals.forEach(function(v, i) {
      var bh = h * v;
      var grd = ctx.createLinearGradient(0, y + h - bh, 0, y + h);
      grd.addColorStop(0, color);
      grd.addColorStop(1, color + '22');
      rr(ctx, x + i * (bw + 3), y + h - bh, bw, bh, 2);
      ctx.fillStyle = grd; ctx.fill();
    });
  }

  function line(ctx, x, y, w, h, pts, color) {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.shadowColor = color; ctx.shadowBlur = 8;
    ctx.beginPath();
    pts.forEach(function(p, i) {
      var px = x + (i / (pts.length - 1)) * w;
      var py = y + h - p * h;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath();
    var grd = ctx.createLinearGradient(0, y, 0, y + h);
    grd.addColorStop(0, color + '44'); grd.addColorStop(1, color + '00');
    ctx.fillStyle = grd; ctx.shadowBlur = 0; ctx.fill();
    ctx.restore();
  }

  /* ======================================
     CANVAS 1 — PHARMAROOTZ (Purple Theme)
  ====================================== */
  function drawPharmarootz() {
    var c = document.getElementById('canvas-pharmarootz');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;

    // Background
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0d0a1a'); bg.addColorStop(1, '#090710');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Purple glow
    var gl = ctx.createRadialGradient(W, 0, 0, W, 0, 260);
    gl.addColorStop(0, 'rgba(139,92,246,0.2)'); gl.addColorStop(1, 'transparent');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);

    // Sidebar
    rr(ctx, 10, 10, 120, H - 20, 10);
    ctx.fillStyle = 'rgba(139,92,246,0.12)'; ctx.fill();
    ctx.strokeStyle = 'rgba(139,92,246,0.35)'; ctx.lineWidth = 1; ctx.stroke();

    lbl(ctx, '💊', 22, 44, '#a78bfa', 20, true);
    lbl(ctx, 'Pharmarootz', 18, 66, '#a78bfa', 8, false);

    var nav = ['Overview', 'Model metrics', 'Database idx', 'API Tuning', 'Latency logs'];
    nav.forEach(function(item, i) {
      var ny = 92 + i * 38;
      if (i === 0) {
        rr(ctx, 16, ny - 12, 107, 28, 6);
        ctx.fillStyle = 'rgba(139,92,246,0.4)'; ctx.fill();
      }
      lbl(ctx, item, 24, ny + 2, i === 0 ? '#c4b5fd' : 'rgba(255,255,255,0.3)', 10, i === 0);
    });

    // Topbar
    rr(ctx, 140, 10, W - 152, 38, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill();
    ctx.strokeStyle = 'rgba(139,92,246,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, 'Pharmarootz Dashboard', 154, 30, '#e2d9f3', 11, true);
    pill(ctx, W - 158, 17, 70, 22, 'rgba(16,185,129,0.25)', '● Online', '#6ee7b7');
    pill(ctx, W - 80, 17, 64, 22, 'rgba(139,92,246,0.3)', 'REST API', '#c4b5fd');

    // Stat cards
    [['🧠', '98.6%', 'Model Acc', '#8b5cf6'],
     ['⚡', '847', 'Queries/s', '#06b6d4'],
     ['📉', '35%', 'Latency Cut', '#10b981']].forEach(function(s, i) {
      var sx = 140 + i * 142, sy = 58;
      rr(ctx, sx, sy, 132, 54, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
      ctx.strokeStyle = s[3] + '44'; ctx.lineWidth = 1; ctx.stroke();
      lbl(ctx, s[0], sx + 10, sy + 27, s[3], 17, false);
      lbl(ctx, s[1], sx + 36, sy + 22, '#fff', 13, true);
      lbl(ctx, s[2], sx + 36, sy + 40, 'rgba(255,255,255,0.4)', 9, false);
    });

    // Line chart
    rr(ctx, 140, 122, 242, 110, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill();
    ctx.strokeStyle = 'rgba(139,92,246,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, 'Query Performance', 152, 138, '#a78bfa', 10, true);
    line(ctx, 146, 148, 228, 72, [0.3,0.5,0.4,0.7,0.55,0.8,0.65,0.9,0.75,0.95], '#8b5cf6');

    // Bar chart
    rr(ctx, 392, 122, 156, 110, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill();
    ctx.strokeStyle = 'rgba(6,182,212,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, 'Drug Categories', 402, 138, '#67e8f9', 10, true);
    bars(ctx, 398, 148, 142, 72, [0.4,0.7,0.55,0.9,0.6,0.8,0.5], '#06b6d4');

    // Table
    var tY = 242;
    rr(ctx, 140, tY, 408, 102, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill();
    ctx.strokeStyle = 'rgba(139,92,246,0.15)'; ctx.lineWidth = 1; ctx.stroke();
    rr(ctx, 140, tY, 408, 24, 8);
    ctx.fillStyle = 'rgba(139,92,246,0.18)'; ctx.fill();
    ['Medicine', 'Category', 'Stock', 'Substitute', 'Status'].forEach(function(h, i) {
      lbl(ctx, h, 152 + i * 78, tY + 13, '#a78bfa', 9, true);
    });
    [['Amoxicillin', 'Antibiotic', '248', 'Ampicillin', 'available'],
     ['Metformin',   'Diabetic',   '512', 'Glipizide',  'available'],
     ['Omeprazole',  'Antacid',    '89',  'Pantopraz',  'low stock']
    ].forEach(function(row, ri) {
      var ry = tY + 40 + ri * 26;
      row.forEach(function(cell, ci) {
        if (ci === 4) {
          var col = cell === 'available' ? '#10b981' : '#f59e0b';
          pill(ctx, 152 + ci * 78, ry - 8, 56, 14, col + '33', cell, col);
        } else {
          lbl(ctx, cell, 152 + ci * 78, ry, ci === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)', 9, ci === 0);
        }
      });
    });

    // Bottom stack
    rr(ctx, 140, H - 28, W - 152, 18, 6);
    ctx.fillStyle = 'rgba(139,92,246,0.08)'; ctx.fill();
    lbl(ctx, 'Django REST  ·  SQLite  ·  Python 3.11  ·  Scikit-Learn  ·  ML model v1.4', 152, H - 16, 'rgba(167,139,250,0.7)', 8, false);
  }

  /* ======================================
     CANVAS 2 — BLOG APP (Pink Theme)
  ====================================== */
  function drawBlogApp() {
    var c = document.getElementById('canvas-blog');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;

    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#160a14'); bg.addColorStop(1, '#0e0a12');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    var gl = ctx.createRadialGradient(W * 0.7, 0, 0, W * 0.7, 0, 280);
    gl.addColorStop(0, 'rgba(236,72,153,0.16)'); gl.addColorStop(1, 'transparent');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);

    // Navbar
    rr(ctx, 0, 0, W, 44, 0);
    ctx.fillStyle = 'rgba(236,72,153,0.08)'; ctx.fill();
    ctx.strokeStyle = 'rgba(236,72,153,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 44); ctx.lineTo(W, 44); ctx.stroke();
    lbl(ctx, '✍️  BlogFlow', 16, 24, '#f9a8d4', 13, true);
    ['Home', 'Write', 'Explore', 'Profile'].forEach(function(item, i) {
      lbl(ctx, item, 172 + i * 68, 24, i === 0 ? '#f472b6' : 'rgba(255,255,255,0.4)', 11, i === 0);
    });
    pill(ctx, W - 118, 10, 102, 24, 'rgba(236,72,153,0.2)', '🔐 JWT Secured', '#f9a8d4');

    // Featured post card
    rr(ctx, 12, 54, 250, 162, 10);
    var fpg = ctx.createLinearGradient(12, 54, 12, 216);
    fpg.addColorStop(0, 'rgba(236,72,153,0.3)'); fpg.addColorStop(1, 'rgba(139,92,246,0.1)');
    ctx.fillStyle = fpg; ctx.fill();
    ctx.strokeStyle = 'rgba(236,72,153,0.45)'; ctx.lineWidth = 1; ctx.stroke();

    pill(ctx, 22, 64, 62, 16, 'rgba(236,72,153,0.3)', 'Featured', '#f9a8d4');
    lbl(ctx, 'Building Scalable', 22, 100, 'rgba(255,255,255,0.92)', 13, true);
    lbl(ctx, 'Backend Systems', 22, 120, 'rgba(255,255,255,0.92)', 13, true);
    lbl(ctx, 'Deep Jalgariya  ·  Jun 2025', 22, 142, 'rgba(255,255,255,0.45)', 9, false);
    ['Python', 'Django', 'REST'].forEach(function(tag, ti) {
      pill(ctx, 22 + ti * 64, 152, 56, 14, 'rgba(139,92,246,0.3)', tag, '#c4b5fd');
    });
    lbl(ctx, '❤️ 142   💬 23   🔖 Save', 22, 202, 'rgba(255,255,255,0.5)', 9, false);

    // Post list
    [['Optimizing Node.js APIs',  'Backend',  '189'],
     ['JWT Auth Best Practices',  'Security', '204'],
     ['MongoDB Schema Design',    'Database', '156']
    ].forEach(function(post, pi) {
      var px = 272, py = 54 + pi * 58;
      rr(ctx, px, py, W - 284, 50, 8);
      ctx.fillStyle = pi === 0 ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.03)'; ctx.fill();
      ctx.strokeStyle = pi === 0 ? 'rgba(236,72,153,0.35)' : 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.stroke();
      lbl(ctx, post[0], px + 10, py + 20, 'rgba(255,255,255,0.85)', 10, true);
      lbl(ctx, '❤️ ' + post[2] + '  ·  Read more →', px + 10, py + 38, 'rgba(255,255,255,0.4)', 8, false);
      pill(ctx, W - 120, py + 10, 50, 14, 'rgba(236,72,153,0.25)', post[1], '#f9a8d4');
    });

    // Rich text editor
    var eY = 232;
    rr(ctx, 12, eY, W - 24, 78, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill();
    ctx.strokeStyle = 'rgba(236,72,153,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    rr(ctx, 12, eY, W - 24, 22, 10);
    ctx.fillStyle = 'rgba(236,72,153,0.1)'; ctx.fill();

    ['B', 'I', 'U', 'H1', 'H2', '≡', '""', '{}'].forEach(function(btn, bi) {
      rr(ctx, 22 + bi * 32, eY + 4, 26, 14, 4);
      ctx.fillStyle = bi === 0 ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.08)'; ctx.fill();
      ctx.fillStyle = bi === 0 ? '#f9a8d4' : 'rgba(255,255,255,0.5)';
      ctx.font = (bi === 0 ? '700' : '400') + ' 8px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(btn, 22 + bi * 32 + 13, eY + 11);
    });
    lbl(ctx, 'Start writing your story here...', 22, eY + 52, 'rgba(255,255,255,0.2)', 11, false);
    ctx.fillStyle = '#f472b6'; ctx.fillRect(190, eY + 40, 2, 14);

    // Skeleton loading rows
    [1, 0.65, 0.82].forEach(function(w, si) {
      rr(ctx, 12, 320 + si * 0, (W - 24) * w, 10, 5);
      var sg = ctx.createLinearGradient(12, 0, 12 + (W - 24) * w, 0);
      sg.addColorStop(0, 'rgba(236,72,153,0.08)');
      sg.addColorStop(0.5, 'rgba(236,72,153,0.2)');
      sg.addColorStop(1, 'rgba(236,72,153,0.08)');
      ctx.fillStyle = sg; ctx.fill();
    });
    rr(ctx, 12, 320, W - 24, 10, 5);
    var sg2 = ctx.createLinearGradient(12, 0, W - 24, 0);
    sg2.addColorStop(0, 'rgba(236,72,153,0.08)');
    sg2.addColorStop(0.5, 'rgba(236,72,153,0.2)');
    sg2.addColorStop(1, 'rgba(236,72,153,0.08)');
    ctx.fillStyle = sg2; ctx.fill();
    rr(ctx, 12, 338, (W - 24) * 0.6, 10, 5);
    ctx.fillStyle = sg2; ctx.fill();

    // Bottom stack
    rr(ctx, 12, H - 28, W - 24, 18, 6);
    ctx.fillStyle = 'rgba(236,72,153,0.07)'; ctx.fill();
    lbl(ctx, 'React.js  ·  Node.js  ·  MongoDB  ·  JWT Auth  ·  Express.js', 22, H - 16, 'rgba(249,168,212,0.7)', 8, false);
  }

  /* ======================================
     CANVAS 3 — GAME ZONE (Cyan Theme)
  ====================================== */
  function drawGameZone() {
    var c = document.getElementById('canvas-gamezone');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;

    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#030f14'); bg.addColorStop(1, '#060a10');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(6,182,212,0.06)'; ctx.lineWidth = 1;
    for (var xi = 0; xi < W; xi += 50) { ctx.beginPath(); ctx.moveTo(xi, 0); ctx.lineTo(xi, H); ctx.stroke(); }
    for (var yi = 0; yi < H; yi += 50) { ctx.beginPath(); ctx.moveTo(0, yi); ctx.lineTo(W, yi); ctx.stroke(); }

    var gl = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 300);
    gl.addColorStop(0, 'rgba(6,182,212,0.1)'); gl.addColorStop(1, 'transparent');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);

    // Header
    rr(ctx, 0, 0, W, 42, 0);
    ctx.fillStyle = 'rgba(6,182,212,0.08)'; ctx.fill();
    ctx.strokeStyle = 'rgba(6,182,212,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 42); ctx.lineTo(W, 42); ctx.stroke();
    lbl(ctx, '🎮  GAME ZONE SYSTEM', 16, 23, '#67e8f9', 13, true);
    pill(ctx, W - 160, 10, 72, 22, 'rgba(16,185,129,0.2)', '● SECURE', '#6ee7b7');
    pill(ctx, W - 82, 10, 68, 22, 'rgba(6,182,212,0.25)', 'ADMIN', '#67e8f9');

    // Leaderboard
    rr(ctx, 12, 52, 234, 214, 10);
    ctx.fillStyle = 'rgba(6,182,212,0.07)'; ctx.fill();
    ctx.strokeStyle = 'rgba(6,182,212,0.3)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, '🏆  LEADERBOARD', 24, 72, '#67e8f9', 10, true);

    [['🥇', 'PlayerOne', '98,420', '#fbbf24'],
     ['🥈', 'NightOwl',  '87,310', '#94a3b8'],
     ['🥉', 'CodeWolf',  '76,850', '#c97c3a']
    ].forEach(function(m, mi) {
      var my = 90 + mi * 38;
      rr(ctx, 20, my, 218, 30, 6);
      ctx.fillStyle = mi === 0 ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.03)'; ctx.fill();
      if (mi === 0) { ctx.strokeStyle = 'rgba(251,191,36,0.4)'; ctx.lineWidth = 1; ctx.stroke(); }
      lbl(ctx, m[0], 26, my + 16, m[3], 14, false);
      lbl(ctx, m[1], 52, my + 16, mi === 0 ? '#fde68a' : 'rgba(255,255,255,0.7)', 10, mi === 0);
      ctx.fillStyle = m[3];
      ctx.font = '700 10px "Space Grotesk", sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(m[2], 230, my + 16);
    });

    ['4.  DuskRider  65,200', '5.  PixelMage  54,100', '6.  ByteKing   47,800'].forEach(function(p, pi) {
      lbl(ctx, p, 24, 210 + pi * 18, 'rgba(255,255,255,0.35)', 9, false);
    });
    line(ctx, 18, 266, 220, 30, [0.3,0.5,0.45,0.7,0.6,0.85,0.75,1.0], '#06b6d4');

    // Admin Panel
    rr(ctx, 258, 52, 156, 132, 10);
    ctx.fillStyle = 'rgba(6,182,212,0.07)'; ctx.fill();
    ctx.strokeStyle = 'rgba(6,182,212,0.35)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, '🔒  Admin Panel', 270, 72, '#67e8f9', 10, true);

    ['Username', 'Password'].forEach(function(lbtext, li) {
      var fy = 88 + li * 38;
      rr(ctx, 266, fy, 140, 26, 5);
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fill();
      ctx.strokeStyle = li === 1 ? 'rgba(6,182,212,0.6)' : 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.stroke();
      lbl(ctx, li === 0 ? 'admin_user' : '••••••••••', 274, fy + 14, 'rgba(255,255,255,0.3)', 9, false);
    });

    rr(ctx, 266, 162, 140, 22, 5);
    var ab = ctx.createLinearGradient(266, 0, 406, 0);
    ab.addColorStop(0, 'rgba(6,182,212,0.35)'); ab.addColorStop(1, 'rgba(16,185,129,0.35)');
    ctx.fillStyle = ab; ctx.fill();
    lbl(ctx, '🔐  AES-256 Encrypted', 276, 174, '#a5f3fc', 8, false);

    // DB Status
    rr(ctx, 424, 52, 124, 132, 10);
    ctx.fillStyle = 'rgba(6,182,212,0.06)'; ctx.fill();
    ctx.strokeStyle = 'rgba(16,185,129,0.3)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, '🗄️  MySQL Status', 434, 70, '#6ee7b7', 10, true);

    [['Connection', 'Active',  '#10b981'],
     ['Tables',     '12',     '#67e8f9'],
     ['Records',    '48,291', '#67e8f9'],
     ['Pool Size',  '10',     '#67e8f9']
    ].forEach(function(d, di) {
      lbl(ctx, d[0], 434, 92 + di * 22, 'rgba(255,255,255,0.4)', 8, false);
      ctx.fillStyle = d[2]; ctx.font = '700 8px "Space Grotesk", sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(d[1], 540, 92 + di * 22);
    });

    rr(ctx, 434, 182, 104, 6, 3); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
    rr(ctx, 434, 182, 80, 6, 3);
    var dbbar = ctx.createLinearGradient(434, 0, 514, 0);
    dbbar.addColorStop(0, '#06b6d4'); dbbar.addColorStop(1, '#10b981');
    ctx.fillStyle = dbbar; ctx.fill();

    // File Monitor
    rr(ctx, 12, 274, 536, 74, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fill();
    ctx.strokeStyle = 'rgba(6,182,212,0.15)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, '📁  File System Monitor', 24, 290, '#67e8f9', 9, true);

    [['scores.dat',    '2.4MB', 'LOCKED', '#10b981'],
     ['backup_05.dat', '8.1MB', 'SYNCED', '#06b6d4'],
     ['session.tmp',   '0.2MB', 'ACTIVE', '#f59e0b'],
     ['admin.log',     '1.8MB', 'WRITE',  '#8b5cf6']
    ].forEach(function(f, fi) {
      var fx = 20 + fi * 136;
      lbl(ctx, f[0], fx, 308, 'rgba(255,255,255,0.75)', 8, true);
      lbl(ctx, f[1], fx, 322, 'rgba(255,255,255,0.4)', 8, false);
      pill(ctx, fx, 328, 52, 14, f[3] + '33', f[2], f[3]);
    });

    // Terminal
    rr(ctx, 12, 356, W - 24, H - 370, 8);
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
    ctx.strokeStyle = 'rgba(6,182,212,0.2)'; ctx.lineWidth = 1; ctx.stroke();

    [['$ java -jar game-security.jar --verify-scores', '#67e8f9'],
     ['> Loading scores.dat (AES Encrypted)...',      '#6ee7b7'],
     ['> Validating cryptographically signed checksum...', '#6ee7b7'],
     ['> Checksum: a3f8c9d2... SIGNATURE VALID ✓',    '#6ee7b7']
    ].forEach(function(ln, li) {
      lbl(ctx, ln[0], 22, 372 + li * 14, ln[1], 8, false);
    });
    ctx.fillStyle = '#06b6d4'; ctx.fillRect(22, 426, 6, 10);

    // Bottom stack
    rr(ctx, 12, H - 28, W - 24, 18, 6);
    ctx.fillStyle = 'rgba(6,182,212,0.06)'; ctx.fill();
    lbl(ctx, 'Java OOP  ·  MySQL  ·  File Streams  ·  AES-256  ·  JDBC', 22, H - 16, 'rgba(103,232,249,0.7)', 8, false);
  }

  // Run the original three
  drawPharmarootz();
  drawBlogApp();
  drawGameZone();

  /* ======================================
     CANVAS 4 — FRAUD GUARD (Red/Purple AI)
  ====================================== */
  function drawFraudGuard() {
    var c = document.getElementById('canvas-fraud-guard');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;

    // Background
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0f0616'); bg.addColorStop(1, '#120208');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(239,68,68,0.06)'; ctx.lineWidth = 1;
    for (var gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (var gy = 0; gy < H; gy += 30) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    // Header bar
    rr(ctx, 10, 10, W - 20, 28, 6);
    ctx.fillStyle = 'rgba(239,68,68,0.1)'; ctx.fill();
    lbl(ctx, '🛡️  FraudGuard AI — Real-time Detection', 20, 24, '#f87171', 10, true);
    pill(ctx, W - 110, 14, 95, 20, 'rgba(239,68,68,0.25)', '● LIVE MONITORING', '#fca5a5');

    // Left: Neural Network nodes
    var nodes = [{x:80,y:80},{x:80,y:120},{x:80,y:160},{x:160,y:70},{x:160,y:110},{x:160,y:150},{x:240,y:90},{x:240,y:130}];
    nodes.forEach(function(n, i) {
      // Connections
      if (i < 3) {
        [nodes[3], nodes[4], nodes[5]].forEach(function(t) {
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = 'rgba(139,92,246,0.3)'; ctx.lineWidth = 1; ctx.stroke();
        });
      }
      if (i >= 3 && i < 6) {
        [nodes[6], nodes[7]].forEach(function(t) {
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = 'rgba(239,68,68,0.4)'; ctx.lineWidth = 1; ctx.stroke();
        });
      }
    });
    nodes.forEach(function(n, i) {
      var clr = i >= 6 ? '#ef4444' : (i >= 3 ? '#8b5cf6' : '#a78bfa');
      ctx.beginPath(); ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = clr; ctx.shadowColor = clr; ctx.shadowBlur = 10; ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Right: Transaction feed
    var txns = [
      {id:'TXN-8821', amt:'$12,400', risk:'HIGH', c:'#ef4444'},
      {id:'TXN-8822', amt:'$340',    risk:'LOW',  c:'#22c55e'},
      {id:'TXN-8823', amt:'$8,900',  risk:'HIGH', c:'#ef4444'},
      {id:'TXN-8824', amt:'$720',    risk:'MED',  c:'#f59e0b'},
    ];
    txns.forEach(function(t, i) {
      var ty = 50 + i * 36;
      rr(ctx, 275, ty, 270, 28, 6);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
      lbl(ctx, t.id, 285, ty + 14, '#e2e8f0', 9, false);
      lbl(ctx, t.amt, 370, ty + 14, '#f8fafc', 9, true);
      rr(ctx, 460, ty + 6, 72, 16, 8);
      ctx.fillStyle = t.c + '33'; ctx.fill();
      ctx.fillStyle = t.c; ctx.font = '700 9px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(t.risk + ' RISK', 496, ty + 14);
    });

    // Bottom stat pills
    var stats = [['Transactions', '12,847', '#8b5cf6'], ['Threats Blocked', '234', '#ef4444'], ['Accuracy', '97.3%', '#22c55e']];
    stats.forEach(function(s, i) {
      rr(ctx, 10 + i * 190, H - 32, 180, 22, 6);
      ctx.fillStyle = s[2] + '18'; ctx.fill();
      lbl(ctx, s[0] + ': ' + s[1], 20 + i * 190, H - 20, s[2], 9, false);
    });
  }

  /* ======================================
     CANVAS 5 — PHARMACARE (Teal/Cyan)
  ====================================== */
  function drawPharmaCare() {
    var c = document.getElementById('canvas-pharmacare');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;

    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#060f14'); bg.addColorStop(1, '#030d12');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Header
    rr(ctx, 10, 10, W - 20, 28, 6);
    ctx.fillStyle = 'rgba(6,182,212,0.1)'; ctx.fill();
    lbl(ctx, '💊  PharmaCare — Medicine Management', 20, 24, '#67e8f9', 10, true);
    pill(ctx, W - 100, 14, 86, 20, 'rgba(16,185,129,0.25)', '✓ 1,240 Items', '#6ee7b7');

    // Medicine catalog grid
    var meds = ['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Omeprazole', 'Metformin', 'Atorvastatin'];
    var colors = ['#06b6d4','#8b5cf6','#10b981','#f59e0b','#ec4899','#06b6d4'];
    meds.forEach(function(m, i) {
      var col = i % 3, row = Math.floor(i / 3);
      var mx = 12 + col * 130, my = 50 + row * 60;
      rr(ctx, mx, my, 120, 50, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
      ctx.strokeStyle = colors[i] + '44'; ctx.lineWidth = 1; ctx.stroke();
      // pill icon
      ctx.beginPath(); ctx.ellipse(mx + 18, my + 25, 10, 6, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = colors[i]; ctx.shadowColor = colors[i]; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
      lbl(ctx, m, mx + 32, my + 22, '#f8fafc', 9, true);
      lbl(ctx, 'In Stock ✓', mx + 32, my + 35, '#6ee7b7', 8, false);
    });

    // Right: inventory bars
    var inv = [0.85, 0.45, 0.92, 0.3];
    var invNames = ['Antibiotics', 'Painkillers', 'Vitamins', 'Syrups'];
    lbl(ctx, 'Inventory Status', 415, 52, '#67e8f9', 10, true);
    inv.forEach(function(v, i) {
      var iy = 66 + i * 28;
      lbl(ctx, invNames[i], 415, iy + 6, 'rgba(248,250,252,0.7)', 8, false);
      rr(ctx, 415, iy + 14, 125, 8, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
      rr(ctx, 415, iy + 14, 125 * v, 8, 4);
      var bc = v < 0.4 ? '#ef4444' : (v < 0.7 ? '#f59e0b' : '#10b981');
      ctx.fillStyle = bc; ctx.shadowColor = bc; ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0;
    });

    // Bottom
    rr(ctx, 10, H - 30, W - 20, 20, 6);
    ctx.fillStyle = 'rgba(6,182,212,0.06)'; ctx.fill();
    lbl(ctx, 'HTML5  ·  CSS3  ·  JavaScript  ·  Responsive Design  ·  UI/UX', 20, H - 19, 'rgba(103,232,249,0.6)', 8, false);
  }

  /* ======================================
     CANVAS 6 — VEHICLE LICENSE (Green)
  ====================================== */
  function drawVehicle() {
    var c = document.getElementById('canvas-vehicle');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;

    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#050f08'); bg.addColorStop(1, '#040c0d');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    rr(ctx, 10, 10, W - 20, 28, 6);
    ctx.fillStyle = 'rgba(16,185,129,0.1)'; ctx.fill();
    lbl(ctx, '🚗  Vehicle License Portal', 20, 24, '#6ee7b7', 10, true);
    pill(ctx, W - 120, 14, 105, 20, 'rgba(16,185,129,0.25)', '● GOV PORTAL', '#34d399');

    // License card
    rr(ctx, 12, 48, 230, 105, 10);
    var lc = ctx.createLinearGradient(12, 48, 242, 153);
    lc.addColorStop(0, '#0d2e1a'); lc.addColorStop(1, '#0a2030');
    ctx.fillStyle = lc; ctx.fill();
    ctx.strokeStyle = 'rgba(16,185,129,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, '🇮🇳 VEHICLE REGISTRATION', 24, 65, '#6ee7b7', 8, true);
    lbl(ctx, 'GJ-01-AB-1234', 24, 85, '#f8fafc', 13, true);
    lbl(ctx, 'Owner: DEEP JALGARIYA', 24, 105, 'rgba(248,250,252,0.7)', 8, false);
    lbl(ctx, 'Class: LMV   Valid: 2030', 24, 120, 'rgba(248,250,252,0.6)', 8, false);
    lbl(ctx, '✓ VERIFIED', 24, 140, '#22c55e', 9, true);

    // Steps tracker
    var steps = ['Applied', 'Verified', 'Approved', 'Issued'];
    lbl(ctx, 'Application Status', 265, 52, '#6ee7b7', 10, true);
    steps.forEach(function(s, i) {
      var sy = 68 + i * 26;
      ctx.beginPath(); ctx.arc(278, sy, 7, 0, Math.PI * 2);
      ctx.fillStyle = i < 3 ? '#10b981' : '#374151'; ctx.shadowColor = '#10b981'; ctx.shadowBlur = i < 3 ? 8 : 0; ctx.fill(); ctx.shadowBlur = 0;
      if (i < 2) { ctx.beginPath(); ctx.moveTo(278, sy + 7); ctx.lineTo(278, sy + 19); ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.stroke(); }
      lbl(ctx, s, 295, sy, i < 3 ? '#f8fafc' : '#6b7280', 9, i < 3);
      if (i < 3) lbl(ctx, '✓', 445, sy, '#22c55e', 9, true);
    });

    // Document upload zone
    rr(ctx, 265, 170, 275, 24, 6);
    ctx.strokeStyle = 'rgba(16,185,129,0.4)'; ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    lbl(ctx, '📄 Upload Documents — Drag & Drop', 280, 182, 'rgba(110,231,183,0.6)', 9, false);

    rr(ctx, 10, H - 30, W - 20, 20, 6);
    ctx.fillStyle = 'rgba(16,185,129,0.06)'; ctx.fill();
    lbl(ctx, 'HTML5  ·  CSS3  ·  JavaScript  ·  Forms  ·  Gov Portal', 20, H - 19, 'rgba(110,231,183,0.6)', 8, false);
  }

  /* ======================================
     CANVAS 7 — BANK MANAGEMENT (Gold)
  ====================================== */
  function drawBank() {
    var c = document.getElementById('canvas-bank');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;

    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0c0a00'); bg.addColorStop(1, '#060d08');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    rr(ctx, 10, 10, W - 20, 28, 6);
    ctx.fillStyle = 'rgba(245,158,11,0.1)'; ctx.fill();
    lbl(ctx, '🏦  Bank Management System', 20, 24, '#fbbf24', 10, true);
    pill(ctx, W - 110, 14, 96, 20, 'rgba(16,185,129,0.25)', '✓ SECURE', '#6ee7b7');

    // Account card
    rr(ctx, 12, 48, 200, 90, 10);
    var ac = ctx.createLinearGradient(12, 48, 212, 138);
    ac.addColorStop(0, '#1a1000'); ac.addColorStop(1, '#0a1a0a');
    ctx.fillStyle = ac; ctx.fill();
    ctx.strokeStyle = 'rgba(245,158,11,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    lbl(ctx, 'SAVINGS ACCOUNT', 24, 64, '#fbbf24', 8, true);
    lbl(ctx, '₹ 2,45,830', 24, 88, '#f8fafc', 14, true);
    lbl(ctx, 'Deep Jalgariya  ·  ****4521', 24, 110, 'rgba(248,250,252,0.6)', 8, false);
    lbl(ctx, '+₹ 12,400 this month', 24, 128, '#22c55e', 8, false);

    // Chart
    var chartPts = [0.4, 0.5, 0.45, 0.65, 0.58, 0.75, 0.7, 0.88];
    line(ctx, 225, 50, 185, 90, chartPts, '#f59e0b');
    lbl(ctx, 'Monthly Growth', 225, 48, '#fbbf24', 9, true);

    // Transactions
    var txs = [['Transfer — Priya S.', '-₹ 2,500', '#ef4444'], ['Salary Credit', '+₹ 45,000', '#22c55e'], ['UPI — Amazon', '-₹ 1,299', '#ef4444']];
    lbl(ctx, 'Recent Transactions', 425, 52, '#fbbf24', 9, true);
    txs.forEach(function(t, i) {
      var ty = 66 + i * 36;
      rr(ctx, 425, ty, 120, 28, 6);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
      lbl(ctx, t[0], 433, ty + 10, 'rgba(248,250,252,0.8)', 8, false);
      lbl(ctx, t[1], 433, ty + 22, t[2], 8, true);
    });

    rr(ctx, 10, H - 30, W - 20, 20, 6);
    ctx.fillStyle = 'rgba(245,158,11,0.06)'; ctx.fill();
    lbl(ctx, 'HTML5  ·  CSS3  ·  JavaScript  ·  FinTech  ·  CRUD Operations', 20, H - 19, 'rgba(251,191,36,0.6)', 8, false);
  }

  /* ======================================
     CANVAS 8 — HANGMAN GAME (Purple/Cyan)
  ====================================== */
  function drawHangman() {
    var c = document.getElementById('canvas-hangman');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;

    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#08060f'); bg.addColorStop(1, '#060810');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Scanlines effect
    for (var sl = 0; sl < H; sl += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(0, sl, W, 2);
    }

    rr(ctx, 10, 10, W - 20, 28, 6);
    ctx.fillStyle = 'rgba(139,92,246,0.15)'; ctx.fill();
    lbl(ctx, '🎮  HangmanGame — Java Terminal', 20, 24, '#c4b5fd', 10, true);
    pill(ctx, W - 120, 14, 106, 20, 'rgba(6,182,212,0.2)', 'SCORE: 2400', '#67e8f9');

    // Gallows (ASCII art style with neon glow)
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 3;
    ctx.shadowColor = '#8b5cf6'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(30, 170); ctx.lineTo(100, 170); ctx.stroke(); // base
    ctx.beginPath(); ctx.moveTo(65, 170); ctx.lineTo(65, 55); ctx.stroke();   // pole
    ctx.beginPath(); ctx.moveTo(65, 55);  ctx.lineTo(110, 55); ctx.stroke();  // top
    ctx.beginPath(); ctx.moveTo(110, 55); ctx.lineTo(110, 75); ctx.stroke();  // rope
    ctx.shadowBlur = 0;
    // Head
    ctx.beginPath(); ctx.arc(110, 86, 11, 0, Math.PI * 2);
    ctx.strokeStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;
    // Body
    ctx.beginPath(); ctx.moveTo(110, 97); ctx.lineTo(110, 135); ctx.strokeStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;

    // Word display
    var word = ['_', 'A', '_', '_', 'A', '_'];
    word.forEach(function(l, i) {
      var wx = 165 + i * 36;
      ctx.fillStyle = l === '_' ? 'rgba(255,255,255,0.15)' : 'rgba(6,182,212,0.2)';
      rr(ctx, wx, 78, 30, 36, 4); ctx.fill();
      ctx.fillStyle = l === '_' ? '#475569' : '#67e8f9';
      ctx.font = '700 18px "Space Grotesk", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = l !== '_' ? '#06b6d4' : 'transparent'; ctx.shadowBlur = 10;
      ctx.fillText(l, wx + 15, 96); ctx.shadowBlur = 0;
      ctx.fillStyle = '#8b5cf6'; ctx.fillRect(wx, 116, 30, 2);
    });
    lbl(ctx, 'Difficulty: HARD   Lives: 3', 162, 140, 'rgba(196,181,253,0.7)', 9, false);

    // Letter keyboard
    var letters = 'ABCDEFGHIJKLM'.split('');
    var wrongLetters = ['C', 'D', 'F', 'G'];
    var rightLetters = ['A'];
    letters.forEach(function(l, i) {
      var kx = 165 + i * 28, ky = 155;
      var isW = wrongLetters.indexOf(l) > -1, isR = rightLetters.indexOf(l) > -1;
      rr(ctx, kx, ky, 22, 22, 4);
      ctx.fillStyle = isW ? 'rgba(239,68,68,0.3)' : (isR ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.06)'); ctx.fill();
      ctx.fillStyle = isW ? '#f87171' : (isR ? '#67e8f9' : 'rgba(248,250,252,0.5)');
      ctx.font = '600 9px "Space Grotesk", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(l, kx + 11, ky + 11);
    });

    rr(ctx, 10, H - 30, W - 20, 20, 6);
    ctx.fillStyle = 'rgba(139,92,246,0.06)'; ctx.fill();
    lbl(ctx, 'Java OOP  ·  CLI  ·  Game Logic  ·  Data Structures  ·  Algorithms', 20, H - 19, 'rgba(196,181,253,0.6)', 8, false);
  }

  // Draw extra canvases when View More is clicked
  window.drawExtraCanvases = function() {
    drawFraudGuard();
    drawPharmaCare();
    drawVehicle();
    drawBank();
    drawHangman();
  };

})();
