/**
 * Deep Jalgariya — 3D Portfolio Engine
 * Three.js Space + Nebula Background, Magnetic Cursor,
 * Scroll Animations, Parallax, Counters & More
 */

'use strict';

/* ════════════════════════════════════════════════════
   1. LOADER
════════════════════════════════════════════════════ */
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
const loaderText = document.getElementById('loader-text');

const loadSteps = [
  { pct: 20,  txt: 'Initializing WebGL...' },
  { pct: 45,  txt: 'Building star field...' },
  { pct: 70,  txt: 'Loading nebula...' },
  { pct: 90,  txt: 'Warming up particles...' },
  { pct: 100, txt: 'Ready to launch 🚀' },
];

let stepIdx = 0;
function nextStep() {
  if (stepIdx >= loadSteps.length) return;
  const s = loadSteps[stepIdx++];
  loaderBar.style.width = s.pct + '%';
  loaderText.textContent = s.txt;
  if (stepIdx < loadSteps.length) setTimeout(nextStep, 280 + Math.random() * 200);
  else setTimeout(() => loader.classList.add('hidden'), 500);
}
setTimeout(nextStep, 200);


/* ════════════════════════════════════════════════════
   2. THREE.JS — DEEP SPACE BACKGROUND
════════════════════════════════════════════════════ */
(function initThreeScene() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x030308, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 400;

  /* ── STARFIELD ── */
  const starCount = 3500;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);

  const starPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xa78bfa),
    new THREE.Color(0x60a5fa),
    new THREE.Color(0xf9a8d4),
    new THREE.Color(0x6ee7b7),
  ];

  for (let i = 0; i < starCount; i++) {
    const r = 800 + Math.random() * 1000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
    const col = starPalette[Math.floor(Math.random() * starPalette.length)];
    starColors[i * 3]     = col.r;
    starColors[i * 3 + 1] = col.g;
    starColors[i * 3 + 2] = col.b;
    starSizes[i] = 0.5 + Math.random() * 2.5;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

  const starMat = new THREE.ShaderMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      void main() {
        vColor = color;
        vec3 pos = position;
        float twinkle = sin(uTime * 2.0 + position.x * 0.01 + position.y * 0.01) * 0.5 + 0.5;
        vAlpha = 0.4 + twinkle * 0.6;
        gl_PointSize = size * (1.0 + twinkle * 0.3);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    uniforms: { uTime: { value: 0 } },
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ── NEBULA CLOUDS ── */
  function makeNebula(color, count, spread, opacity) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color, size: 8, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geo, mat);
  }

  const nebula1 = makeNebula(0x8b5cf6, 800, 900, 0.06);
  nebula1.position.set(200, 100, -300);
  scene.add(nebula1);

  const nebula2 = makeNebula(0xec4899, 600, 700, 0.05);
  nebula2.position.set(-300, -100, -400);
  scene.add(nebula2);

  const nebula3 = makeNebula(0x06b6d4, 500, 600, 0.04);
  nebula3.position.set(0, 200, -500);
  scene.add(nebula3);

  /* ── FOREGROUND PARTICLES ── */
  const fgCount = 200;
  const fgGeo = new THREE.BufferGeometry();
  const fgPos = new Float32Array(fgCount * 3);
  const fgSpeeds = new Float32Array(fgCount);
  for (let i = 0; i < fgCount; i++) {
    fgPos[i * 3]     = (Math.random() - 0.5) * 600;
    fgPos[i * 3 + 1] = (Math.random() - 0.5) * 400;
    fgPos[i * 3 + 2] = (Math.random() - 0.5) * 200;
    fgSpeeds[i] = 0.1 + Math.random() * 0.3;
  }
  fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPos, 3));
  const fgMat = new THREE.PointsMaterial({
    color: 0xa78bfa, size: 2, transparent: true, opacity: 0.4,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const fgParticles = new THREE.Points(fgGeo, fgMat);
  scene.add(fgParticles);

  /* ── SHOOTING STAR ── */
  let shootingStar = null;
  let shootingStarTimer = 0;
  function createShootingStar() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(2 * 3);
    const x = (Math.random() - 0.5) * 800;
    const y = 150 + Math.random() * 100;
    pos[0] = x; pos[1] = y; pos[2] = 0;
    pos[3] = x - 80; pos[4] = y - 30; pos[5] = 0;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    shootingStar = { mesh: line, vx: -3, vy: -1, life: 0, maxLife: 60 };
  }

  /* ── MOUSE PARALLAX ── */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  document.addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── SCROLL PARALLAX ── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  /* ── ANIMATION LOOP ── */
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    starMat.uniforms.uTime.value = t;

    // Mouse parallax
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    camera.position.x = mouse.x * 30;
    camera.position.y = -mouse.y * 20;
    camera.position.z = 400 - scrollY * 0.08;
    camera.lookAt(0, 0, 0);

    // Rotate star field slowly
    stars.rotation.y = t * 0.01;
    stars.rotation.x = t * 0.005;

    // Drift nebulas
    nebula1.rotation.z = t * 0.008;
    nebula2.rotation.z = -t * 0.006;
    nebula3.rotation.y = t * 0.007;

    // Float fg particles
    const fgPosArr = fgGeo.attributes.position.array;
    for (let i = 0; i < fgCount; i++) {
      fgPosArr[i * 3 + 1] += fgSpeeds[i] * 0.1;
      if (fgPosArr[i * 3 + 1] > 200) fgPosArr[i * 3 + 1] = -200;
    }
    fgGeo.attributes.position.needsUpdate = true;

    // Shooting star
    shootingStarTimer++;
    if (shootingStarTimer > 300 && !shootingStar) {
      createShootingStar();
      shootingStarTimer = 0;
    }
    if (shootingStar) {
      shootingStar.mesh.position.x += shootingStar.vx;
      shootingStar.mesh.position.y += shootingStar.vy;
      shootingStar.life++;
      shootingStar.mesh.material.opacity = 1 - shootingStar.life / shootingStar.maxLife;
      if (shootingStar.life >= shootingStar.maxLife) {
        scene.remove(shootingStar.mesh);
        shootingStar = null;
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  /* ── RESIZE ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();


/* ════════════════════════════════════════════════════
   3. CUSTOM MAGNETIC CURSOR
════════════════════════════════════════════════════ */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Skip cursor on touch devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let cx = 0, cy = 0;   // current dot position
  let rx = 0, ry = 0;   // current ring position
  let tx = 0, ty = 0;   // target

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

  // Hover effects
  const interactables = 'a, button, .bento-card, .cert-card, .contact-link-card, .project-link-btn, .nav-brand';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactables)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactables)) ring.classList.remove('hovered');
  });
  document.addEventListener('mousedown', () => ring.classList.add('clicked'));
  document.addEventListener('mouseup', () => ring.classList.remove('clicked'));

  function animateCursor() {
    cx += (tx - cx) * 0.9;
    cy += (ty - cy) * 0.9;
    rx += (tx - rx) * 0.15;
    ry += (ty - ry) * 0.15;

    dot.style.left = cx + 'px';
    dot.style.top  = cy + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();


/* ════════════════════════════════════════════════════
   4. NAVIGATION
════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  // Scroll style
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile toggle
  let menuOpen = false;
  hamburger && hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      hamburger && hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Active nav on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const id = entry.target.id;
        const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();





/* ════════════════════════════════════════════════════
   6. REVEAL ON SCROLL (Intersection Observer)
════════════════════════════════════════════════════ */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));
})();


/* ════════════════════════════════════════════════════
   7. ROLES TICKER (Hero)
════════════════════════════════════════════════════ */
// Ticker is initialized inline in HTML (next to .roles-ticker element)
// to guarantee DOM is ready before the script runs.


/* ════════════════════════════════════════════════════
   8. COUNTER ANIMATION (Stats)
════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const value = target * eased;
        el.textContent = isDecimal ? value.toFixed(2) : Math.round(value);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = isDecimal ? target.toFixed(2) : target;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();


/* ════════════════════════════════════════════════════
   9. 3D TILT EFFECT (About Card)
════════════════════════════════════════════════════ */
(function initTilt() {
  const card = document.getElementById('about-card-3d');
  if (!card) return;
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(12px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
  });
})();


/* ════════════════════════════════════════════════════
   10. HERO 3D ORB — Mouse Parallax
════════════════════════════════════════════════════ */
(function initOrbParallax() {
  const orb = document.getElementById('orb-3d');
  const hero3d = document.getElementById('hero-3d-object');
  if (!hero3d) return;
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX / window.innerWidth - 0.5) * 30;
    const dy = (e.clientY / window.innerHeight - 0.5) * 20;
    hero3d.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
    if (orb) orb.style.transform = `translate(${dx * 0.6}px, ${dy * 0.4}px)`;
  });
})();


/* ════════════════════════════════════════════════════
   11. PROJECTS — HOVER EFFECTS
════════════════════════════════════════════════════ */
(function initProjectHovers() {
  const items = document.querySelectorAll('.project-item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(other => {
        if (other !== item) other.style.opacity = '0.4';
      });
    });
    item.addEventListener('mouseleave', () => {
      items.forEach(other => { other.style.opacity = '1'; });
    });
  });
})();


/* ════════════════════════════════════════════════════
   12. BENTO CARDS — Glow Follow Mouse
════════════════════════════════════════════════════ */
(function initBentoGlow() {
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.querySelector('.bento-glow').style.background =
        `radial-gradient(circle at ${x}% ${y}%, rgba(139,92,246,0.12), transparent 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.bento-glow').style.background =
        'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.05), transparent 60%)';
    });
  });
})();


/* ════════════════════════════════════════════════════
   13. SMOOTH SCROLL
════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ════════════════════════════════════════════════════
   14. MARQUEE PAUSE ON HOVER (already CSS, also JS)
════════════════════════════════════════════════════ */
// Handled via CSS .marquee-track:hover { animation-play-state: paused; }


/* ════════════════════════════════════════════════════
   15. PAGE TRANSITION — Hide cursor on touch
════════════════════════════════════════════════════ */
window.addEventListener('touchstart', () => {
  document.body.classList.add('cursor-hidden');
}, { passive: true });


/* ════════════════════════════════════════════════════
   16. SECTION PARALLAX ON SCROLL
════════════════════════════════════════════════════ */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroSection = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const y = window.scrollY;
    
    let fadeThreshold = 700;
    if (window.innerWidth <= 768 && heroSection) {
      // On mobile, fade out completely at 75% of the hero section height
      fadeThreshold = heroSection.offsetHeight * 0.75;
    }
    
    heroContent.style.transform = `translateY(${y * 0.15}px)`;
    heroContent.style.opacity = Math.max(0, 1 - y / fadeThreshold);
  }, { passive: true });
})();


/* ════════════════════════════════════════════════════
   17. CONTACT FORM — mailto submission
════════════════════════════════════════════════════ */
function submitContactForm(e) {
  e.preventDefault();

  var btn     = document.getElementById('cf-submit');
  var btnText = document.getElementById('cf-submit-text');
  var success = document.getElementById('cf-success');
  var error   = document.getElementById('cf-error');
  var form    = document.getElementById('contact-form');

  success.classList.remove('show');
  error.classList.remove('show');

  // Guard: key not set yet
  var key = document.getElementById('w3f-key');
  if (!key || !key.value || key.value === 'YOUR_KEY_HERE') {
    error.innerHTML = '⚠️ Web3Forms key missing — <a href="https://web3forms.com" target="_blank" style="color:#a78bfa;text-decoration:underline">get free key here</a> → paste in index.html';
    error.classList.add('show');
    return;
  }

  btn.disabled = true;
  btnText.textContent = 'Sending...';
  btn.classList.add('sending');

  var data = new FormData(form);

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: data
  })
  .then(function(res) { return res.json(); })
  .then(function(result) {
    btn.disabled = false;
    btnText.textContent = 'Send Message';
    btn.classList.remove('sending');

    if (result.success) {
      success.classList.add('show');
      form.reset();
      setTimeout(function() { success.classList.remove('show'); }, 6000);
    } else {
      error.innerHTML = '❌ ' + (result.message || 'Something went wrong. Try again.');
      error.classList.add('show');
      setTimeout(function() { error.classList.remove('show'); }, 6000);
    }
  })
  .catch(function() {
    btn.disabled = false;
    btnText.textContent = 'Send Message';
    btn.classList.remove('sending');
    error.innerHTML = '❌ No internet connection. Please try again.';
    error.classList.add('show');
    setTimeout(function() { error.classList.remove('show'); }, 6000);
  });
}

// Portfolio ready
console.log('Deep Jalgariya Portfolio — Loaded');

/* ════════════════════════════════════════════════════
   PROJECTS — VIEW MORE TOGGLE
════════════════════════════════════════════════════ */
var projectsExpanded = false;
var extraCanvasDrawn  = false;

function toggleProjects() {
  var extras = document.querySelectorAll('.hidden-project');
  var btn = document.getElementById('btn-view-more');
  var btnText = document.getElementById('view-more-text');

  if (!projectsExpanded) {
    // Show all extra cards with stagger
    extras.forEach(function(card, i) {
      setTimeout(function() {
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        setTimeout(function() { card.classList.add('visible'); }, 30);
      }, i * 80);
    });

    // Draw extra canvases once
    if (!extraCanvasDrawn) {
      setTimeout(function() {
        if (typeof window.drawExtraCanvases === 'function') {
          window.drawExtraCanvases();
        }
      }, 100);
      extraCanvasDrawn = true;
    }

    btnText.textContent = 'Show Less';
    btn.classList.add('expanded');
    btn.setAttribute('aria-expanded', 'true');
    projectsExpanded = true;

  } else {
    // Hide extra cards
    extras.forEach(function(card) {
      card.classList.remove('visible');
      card.style.display = 'none';
    });
    btnText.textContent = 'View All Projects';
    btn.classList.remove('expanded');
    btn.setAttribute('aria-expanded', 'false');
    projectsExpanded = false;

    // Scroll back to projects section smoothly
    var projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/* ════════════════════════════════════════════════════
   18. RESPONSIVE RESUME LINK TARGETS
════════════════════════════════════════════════════ */
(function initResponsiveResumeLinks() {
  function updateResumeTargets() {
    var isMobile = window.innerWidth <= 768;
    var links = document.querySelectorAll('a[href="CV_DeepJalgariya_LJIET.pdf"]');
    links.forEach(function(link) {
      if (isMobile) {
        link.removeAttribute('target');
      } else {
        link.setAttribute('target', '_blank');
      }
    });
  }
  updateResumeTargets();
  window.addEventListener('resize', updateResumeTargets);
})();

/* ════════════════════════════════════════════════════
   19. RESUME PREVIEW MODAL
════════════════════════════════════════════════════ */
var resumeModal = document.getElementById('resume-modal');

function openResumeModal() {
  if (!resumeModal) return;
  resumeModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent scroll
}

function closeResumeModal() {
  if (!resumeModal) return;
  resumeModal.classList.remove('active');
  document.body.style.overflow = ''; // restore scroll
}

// Bind Escape key to close modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeResumeModal();
});

// Bind click events to open modal
(function bindResumeModal() {
  var links = document.querySelectorAll('a[href="CV_DeepJalgariya_LJIET.pdf"]');
  links.forEach(function(link) {
    if (link.classList.contains('r-download-btn') || link.classList.contains('r-open-btn')) {
      return;
    }
    link.addEventListener('click', function(e) {
      e.preventDefault();
      openResumeModal();
    });
  });
})();
