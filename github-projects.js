/* ================================================
   GITHUB REPOSITORY AUTO-SYNC ENGINE — Deep Jalgariya
   Fetches public repos from GitHub REST API, caches,
   enriches existing cards, and dynamically renders new repos
   maintaining the EXACT same box structure and 200px Canvas visuals.
================================================ */

(function initGitHubProjects() {
  var GITHUB_USERNAME = 'Deep-Jalgariya';
  var CACHE_KEY = 'dj_portfolio_github_repos_v3';
  var CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes cache

  // Color mapping for languages & tech tags
  var TECH_COLORS = {
    'Python':     { primary: '#3b82f6', text: '#93c5fd', darkBg: '#08101e' },
    'JavaScript': { primary: '#f59e0b', text: '#fde047', darkBg: '#181205' },
    'Java':       { primary: '#ef4444', text: '#fca5a5', darkBg: '#1a0909' },
    'HTML':       { primary: '#f97316', text: '#fdba74', darkBg: '#190e06' },
    'CSS':        { primary: '#0ea5e9', text: '#7dd3fc', darkBg: '#05131a' },
    'TypeScript': { primary: '#2563eb', text: '#93c5fd', darkBg: '#081020' },
    'C++':        { primary: '#ec4899', text: '#f9a8d4', darkBg: '#180914' },
    'React':      { primary: '#06b6d4', text: '#67e8f9', darkBg: '#041317' },
    'Django':     { primary: '#10b981', text: '#6ee7b7', darkBg: '#041710' },
    'Node':       { primary: '#22c55e', text: '#86efac', darkBg: '#06180a' }
  };

  function getTechBadgeStyle(techName) {
    return TECH_COLORS[techName] || { primary: '#8b5cf6', text: '#c4b5fd', darkBg: '#0f0a1c' };
  }

  function formatRepoTitle(name) {
    if (!name) return '';
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, function(l) { return l.toUpperCase(); });
  }

  // Auto-generate rich tagline matching existing cards format
  function generateRepoTagline(repo) {
    var lang = repo.language || 'Software';
    var name = (repo.name || '').toLowerCase();

    if (name.indexOf('ai') !== -1 || name.indexOf('ml') !== -1 || name.indexOf('model') !== -1) {
      return 'AI & Machine Learning pipeline with predictive modeling';
    }
    if (name.indexOf('api') !== -1 || name.indexOf('backend') !== -1 || lang === 'Python') {
      return 'Scalable backend engine with database optimization';
    }
    if (name.indexOf('web') !== -1 || name.indexOf('portal') !== -1 || lang === 'HTML' || lang === 'JavaScript') {
      return 'Interactive web application with modern responsive UI';
    }
    if (lang === 'Java' || lang === 'C++') {
      return 'Java OOP application with clean software architecture';
    }
    return lang + ' open-source repository engineered by Deep Jalgariya';
  }

  // Auto-generate detailed paragraph description matching existing cards format
  function generateRepoDescription(repo) {
    if (repo.description && repo.description.trim().length > 10 && repo.description.toLowerCase() !== 'no description') {
      return repo.description;
    }

    var title = formatRepoTitle(repo.name);
    var lang = repo.language || 'software';
    var topicsStr = (repo.topics && repo.topics.length) ? repo.topics.join(', ') : 'software engineering, clean code';

    return 'Developed ' + title + ' — a robust ' + lang + ' project focused on ' + topicsStr + '. Designed with clean modular code architecture, high performance standards, and optimized developer workflow.';
  }

  // Fetch repositories from GitHub API with localStorage cache
  function getGitHubRepos(callback) {
    var cached = null;
    try {
      cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    } catch(e) {}

    var now = Date.now();
    if (cached && cached.timestamp && (now - cached.timestamp < CACHE_EXPIRY_MS) && Array.isArray(cached.data)) {
      callback(null, cached.data, true);
      return;
    }

    var url = 'https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=100';
    fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error('GitHub API response status: ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (!Array.isArray(data)) throw new Error('Invalid GitHub repos payload');
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now, data: data }));
        } catch(e) {}
        callback(null, data, false);
      })
      .catch(function(err) {
        if (cached && Array.isArray(cached.data)) {
          console.warn('GitHub API failed, using cached repos:', err);
          callback(null, cached.data, true);
        } else {
          callback(err, null, false);
        }
      });
  }

  // Update Hero section project count dynamically
  function updateHeroProjectCount(totalReposCount) {
    var statEls = document.querySelectorAll('.stat-value[data-count]');
    statEls.forEach(function(el) {
      var label = el.nextElementSibling ? el.nextElementSibling.nextElementSibling : null;
      if (label && label.textContent && label.textContent.toLowerCase().indexOf('project') !== -1) {
        if (totalReposCount > 0) {
          el.setAttribute('data-count', totalReposCount.toString());
          el.textContent = totalReposCount.toString();
        }
      }
    });
  }

  /* ════════════════════════════════════════════════════
     DYNAMIC 2D CANVAS PHOTO GENERATOR (Height: 200px)
  ════════════════════════════════════════════════════ */
  function drawDynamicRepoCanvas(canvas, repo) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width = 560;
    var H = canvas.height = 200; // Exact same height as existing cards!

    var lang = repo.language || 'Code';
    var theme = getTechBadgeStyle(lang);
    var primaryColor = theme.primary;
    var title = formatRepoTitle(repo.name);
    var stars = repo.stargazers_count || 0;
    var forks = repo.forks_count || 0;

    // Helper: Rounded rect
    function rr(x, y, w, h, r) {
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

    // Helper: Text
    function lbl(text, x, y, color, size, bold) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.font = (bold ? '700' : '500') + ' ' + size + 'px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
      ctx.restore();
    }

    // Helper: Pill
    function pill(x, y, w, h, bg, text, tc) {
      ctx.save();
      rr(x, y, w, h, h / 2);
      ctx.fillStyle = bg; ctx.fill();
      ctx.fillStyle = tc;
      ctx.font = '600 ' + Math.round(h * 0.52) + 'px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x + w / 2, y + h / 2);
      ctx.restore();
    }

    // Background Gradient
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#090712'); bg.addColorStop(1, theme.darkBg);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Scanline & Grid pattern
    ctx.strokeStyle = primaryColor + '0f'; ctx.lineWidth = 1;
    for (var x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

    // Header Bar
    rr(10, 10, W - 20, 28, 6);
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
    ctx.strokeStyle = primaryColor + '33'; ctx.lineWidth = 1; ctx.stroke();

    // Window Dots
    [['#ef4444', 24], ['#f59e0b', 38], ['#10b981', 52]].forEach(function(dot) {
      ctx.beginPath(); ctx.arc(dot[1], 24, 4, 0, Math.PI * 2);
      ctx.fillStyle = dot[0]; ctx.fill();
    });

    lbl(title, 68, 24, '#ffffff', 11, true);
    pill(W - 145, 14, 60, 20, primaryColor + '33', lang, theme.text);
    pill(W - 78, 14, 58, 20, 'rgba(255,255,255,0.08)', '⭐ ' + stars, '#fcd34d');

    // Left Box — Code snippet simulation
    rr(12, 46, 280, 118, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill();
    ctx.strokeStyle = primaryColor + '22'; ctx.lineWidth = 1; ctx.stroke();

    var codeLines = [
      ['class ', '#ec4899', repo.name.replace(/[-_]/g, '') + 'App', '#67e8f9'],
      ['  def ', '#f59e0b', 'initialize', '#6ee7b7', '():'],
      ['    self.status = ', '#a78bfa', '"ACTIVE"', '#10b981'],
      ['    self.stars  = ', '#a78bfa', stars.toString(), '#fcd34d'],
      ['  def ', '#f59e0b', 'execute', '#6ee7b7', '():'],
      ['    return ', '#ec4899', 'Deploy()', '#67e8f9']
    ];

    codeLines.forEach(function(lineTokens, li) {
      var ly = 62 + li * 17;
      lbl((li + 1).toString(), 22, ly, 'rgba(255,255,255,0.25)', 8, false);

      var currX = 40;
      for (var ti = 0; ti < lineTokens.length; ti += 2) {
        var txt = lineTokens[ti];
        var col = lineTokens[ti + 1] || '#ffffff';
        lbl(txt, currX, ly, col, 9, true);
        currX += ctx.measureText(txt).width;
      }
    });

    // Right Box — Metrics & Chart
    rr(304, 46, 244, 118, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill();
    ctx.strokeStyle = primaryColor + '22'; ctx.lineWidth = 1; ctx.stroke();

    lbl('⚡ REPOSITORY METRICS', 316, 60, primaryColor, 9, true);

    [['Stars', stars.toString(), '#fcd34d'],
     ['Forks', forks.toString(), '#60a5fa'],
     ['Language', lang, theme.text]
    ].forEach(function(st, si) {
      var sy = 78 + si * 18;
      lbl(st[0], 316, sy, 'rgba(255,255,255,0.5)', 8, false);
      ctx.fillStyle = st[2]; ctx.font = '700 8px "Space Grotesk", sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(st[1], 536, sy);
    });

    // Mini activity line
    ctx.strokeStyle = primaryColor; ctx.lineWidth = 2;
    ctx.beginPath();
    var pts = [0.3, 0.6, 0.45, 0.8, 0.55, 0.9, 0.7, 0.95];
    pts.forEach(function(p, i) {
      var px = 316 + (i / (pts.length - 1)) * 220;
      var py = 152 - p * 24;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Bottom Bar
    rr(10, H - 28, W - 20, 20, 6);
    ctx.fillStyle = primaryColor + '12'; ctx.fill();
    lbl(lang + '  ·  GitHub REST API  ·  Auto-Synced  ·  Engineered by Deep Jalgariya', 20, H - 18, theme.text, 8, false);
  }

  // Create dynamic project card maintaining EXACT SAME BOX STRUCTURE as index.html cards
  function buildDynamicProjectCard(repo, isExtra) {
    var card = document.createElement('div');
    card.className = 'project-item reveal dynamic-gh-project' + (isExtra ? ' project-extra hidden-project' : '');
    if (isExtra) card.style.display = 'none';

    var formattedTitle = formatRepoTitle(repo.name);
    var tagline = generateRepoTagline(repo);
    var description = generateRepoDescription(repo);
    var repoUrl = repo.html_url || ('https://github.com/' + GITHUB_USERNAME + '/' + repo.name);

    // Collect tags
    var tags = [];
    if (repo.language) tags.push(repo.language);
    if (Array.isArray(repo.topics)) {
      repo.topics.forEach(function(t) {
        if (t && tags.indexOf(t) === -1) tags.push(t);
      });
    }

    var tagsHtml = '';
    tags.slice(0, 4).forEach(function(t) {
      tagsHtml += '<span>' + t + '</span>';
    });

    var canvasId = 'canvas-gh-' + repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // EXACT HTML structure matching Project cards in index.html (like HangmanGame, Bank, Vehicle)
    card.innerHTML =
      '<div class="project-visual">' +
        '<canvas class="pv-canvas" id="' + canvasId + '" width="560" height="200"></canvas>' +
      '</div>' +
      '<div class="project-body">' +
        '<div class="project-top">' +
          '<div>' +
            '<h3 class="project-name">' + formattedTitle + '</h3>' +
            '<p class="project-tagline">' + tagline + '</p>' +
          '</div>' +
          '<a href="' + repoUrl + '" target="_blank" rel="noopener" class="project-link-btn" aria-label="View ' + formattedTitle + ' on GitHub">' +
            '<svg viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</a>' +
        '</div>' +
        '<p class="project-desc">' + description + '</p>' +
        '<div class="project-impact"></div>' +
        '<div class="project-tech">' + tagsHtml + '</div>' +
      '</div>';

    setTimeout(function() {
      var c = document.getElementById(canvasId);
      if (c) drawDynamicRepoCanvas(c, repo);
    }, 40);

    return card;
  }

  // Update existing DOM card with live GitHub statistics if repo matches
  function enrichExistingCard(card, repo) {
    var topDiv = card.querySelector('.project-top');
    if (!topDiv) return;

    var stars = repo.stargazers_count || 0;
    var forks = repo.forks_count || 0;

    var metaBar = card.querySelector('.gh-card-stats-inline');
    if (!metaBar && (stars > 0 || forks > 0)) {
      metaBar = document.createElement('div');
      metaBar.className = 'gh-card-stats-inline';
      metaBar.innerHTML =
        '<span title="GitHub Stars">⭐ ' + stars + '</span>' +
        '<span title="GitHub Forks">🔀 ' + forks + '</span>';
      topDiv.appendChild(metaBar);
    } else if (metaBar) {
      metaBar.innerHTML =
        '<span title="GitHub Stars">⭐ ' + stars + '</span>' +
        '<span title="GitHub Forks">🔀 ' + forks + '</span>';
    }
  }

  // Main sync function
  function syncProjectsWithGitHub() {
    var syncBadge = document.getElementById('gh-sync-badge');
    if (syncBadge) {
      syncBadge.innerHTML = '<span class="gh-sync-dot loading"></span> Syncing GitHub...';
    }

    getGitHubRepos(function(err, repos, isCached) {
      if (err || !repos) {
        console.warn('Could not sync GitHub projects:', err);
        if (syncBadge) {
          syncBadge.innerHTML = '<span class="gh-sync-dot offline"></span> Static Mode';
        }
        return;
      }

      var publicRepos = repos.filter(function(r) {
        return !r.fork;
      });

      if (publicRepos.length === 0) publicRepos = repos;

      updateHeroProjectCount(publicRepos.length);

      if (syncBadge) {
        syncBadge.innerHTML = '<span class="gh-sync-dot active"></span> Live Auto-Sync (' + publicRepos.length + ' Repos)';
      }

      var projectsGrid = document.getElementById('projects-grid');
      if (!projectsGrid) return;

      var existingCards = projectsGrid.querySelectorAll('.project-item');
      var matchedRepoNames = {};

      existingCards.forEach(function(card) {
        var githubBtn = card.querySelector('a[href*="github.com"]');
        if (githubBtn) {
          var href = githubBtn.getAttribute('href');
          publicRepos.forEach(function(repo) {
            if (href.toLowerCase().indexOf(repo.name.toLowerCase()) !== -1) {
              matchedRepoNames[repo.name.toLowerCase()] = true;
              enrichExistingCard(card, repo);
            }
          });
        }
      });

      // Find new GitHub repos that are NOT hardcoded in HTML yet
      var newRepos = publicRepos.filter(function(r) {
        var isPortfolioSelf = r.name.toLowerCase() === 'portfolio' || r.name.toLowerCase() === 'deep-jalgariya';
        return !matchedRepoNames[r.name.toLowerCase()] && !isPortfolioSelf;
      });

      if (newRepos.length === 0) return;

      // Append new repos to the projects grid with EXACT same box structure
      newRepos.forEach(function(repo, index) {
        var isExtra = (existingCards.length + index) >= 3;
        var newCard = buildDynamicProjectCard(repo, isExtra);
        projectsGrid.appendChild(newCard);

        if (window.revealObserver) {
          window.revealObserver.observe(newCard);
        } else {
          setTimeout(function() { newCard.classList.add('visible'); }, 100);
        }
      });

      window.ghSyncedRepos = publicRepos;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncProjectsWithGitHub);
  } else {
    syncProjectsWithGitHub();
  }

})();
