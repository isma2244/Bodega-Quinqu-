
(() => {
  const body = document.body;
  const entry = document.getElementById('entry');
  const enterBtn = document.getElementById('enterBtn');
  const music = document.getElementById('bgMusic');
  const player = document.getElementById('musicPlayer');
  const toggle = document.getElementById('musicToggle');
  const icon = document.getElementById('musicIcon');
  const status = document.getElementById('musicStatus');
  const progress = document.getElementById('musicProgress');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  body.classList.add('entry-open');
  music.volume = 0.22;
  music.loop = false;

  const updatePlayer = () => {
    if (!music.duration) return;
    const pct = Math.min(100, Math.max(0, (music.currentTime / music.duration) * 100));
    progress.style.width = `${pct}%`;
  };

  const setPlayState = (playing) => {
    icon.textContent = playing ? 'Ⅱ' : '▶';
    status.textContent = playing ? 'soando' : (music.ended ? 'rematada' : 'en pausa');
    toggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  };

  enterBtn.addEventListener('click', async () => {
    entry.classList.add('is-hidden');
    body.classList.remove('entry-open');
    player.classList.add('visible');
    try {
      music.currentTime = 0;
      await music.play();
      setPlayState(true);
    } catch {
      setPlayState(false);
      status.textContent = 'toca para escoitar';
    }
    setTimeout(() => entry.remove(), 900);
  });

  toggle.addEventListener('click', async () => {
    if (music.paused) {
      if (music.ended) music.currentTime = 0;
      try {
        await music.play();
        setPlayState(true);
      } catch {
        status.textContent = 'non se puido iniciar';
      }
    } else {
      music.pause();
      setPlayState(false);
    }
  });

  music.addEventListener('timeupdate', updatePlayer);
  music.addEventListener('play', () => setPlayState(true));
  music.addEventListener('pause', () => setPlayState(false));
  music.addEventListener('ended', () => {
    setPlayState(false);
    progress.style.width = '100%';
  });

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.full;
      lightboxImg.alt = item.dataset.caption || '';
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();
