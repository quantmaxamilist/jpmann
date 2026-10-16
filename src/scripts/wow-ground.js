// Loader for the homepage ground-section wow. Three.js is fetched in idle time, shaders are
// compiled before the section arrives, and the assembly plays once ≥50% is on screen.
export function initWow(root) {
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = root.querySelector('[data-wow-canvas]');
  const stage = root.querySelector('[data-wow-stage]');
  const links = [...root.querySelectorAll('[data-part]')];
  const pins = [...root.querySelectorAll('[data-pin]')];
  const replay = root.querySelector('[data-wow-replay]');

  const hasGL = (() => {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
  })();
  if (reduced || !hasGL) { root.classList.add('is-static'); return; }

  let scene = null;
  let loading = null;
  const load = () => (loading ||= import('./wow-ground-scene.js').then((m) => {
    scene = m.createScene(canvas, stage, {
      onPins: (pos) => pos.forEach((p, i) => { if (pins[i]) pins[i].style.transform = `translate(${p.x}px, ${p.y}px)`; }),
      onDone: () => { root.classList.add('is-done'); replay.hidden = false; },
    });
    root.classList.add('is-live');
    return scene;
  }));

  // Fetch + compile while the visitor is still above it.
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 600));
  const near = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { near.disconnect(); idle(() => load()); }
  }, { rootMargin: '900px 0px' });
  near.observe(root);

  let played = false;
  const vis = new IntersectionObserver((es) => {
    const e = es[0];
    if (e.intersectionRatio >= 0.5 && !played) {
      played = true;
      load().then((s) => s.play());
    } else if (scene) {
      if (e.isIntersecting) scene.resume(); else scene.pause();
    }
  }, { threshold: [0, 0.5] });
  vis.observe(stage);

  replay?.addEventListener('click', () => {
    root.classList.remove('is-done');
    replay.hidden = true;
    scene?.play();
  });

  // List ↔ model highlight, both ways.
  const keys = links.map((a) => a.dataset.part);
  const setOn = (key) => {
    links.forEach((a) => a.classList.toggle('is-on', a.dataset.part === key));
    pins.forEach((p) => p.classList.toggle('is-on', p.dataset.pin === key));
    scene?.highlight(key);
  };
  links.forEach((a) => {
    a.addEventListener('pointerenter', () => setOn(a.dataset.part));
    a.addEventListener('focus', () => setOn(a.dataset.part));
    a.addEventListener('pointerleave', () => setOn(null));
    a.addEventListener('blur', () => setOn(null));
  });
  pins.forEach((p) => {
    p.addEventListener('pointerenter', () => setOn(p.dataset.pin));
    p.addEventListener('pointerleave', () => setOn(null));
    p.addEventListener('click', () => links[keys.indexOf(p.dataset.pin)]?.click());
  });
  stage.addEventListener('pointermove', (e) => {
    if (!scene || e.pointerType !== 'mouse') return;
    const key = scene.pick(e);
    stage.style.cursor = key ? 'pointer' : '';
    setOn(key);
  });
  stage.addEventListener('click', (e) => {
    const key = scene?.pick(e);
    if (key) links[keys.indexOf(key)]?.click();
  });

  addEventListener('pagehide', () => scene?.dispose(), { once: true });
}
