// The ground section: a cut-away block of strata with the engineered parts JP Mann designs.
// One clean assembly (~2.6s, all parts on a short stagger), then it holds still; render on demand.
import * as THREE from 'three';
import { gsap } from 'gsap';

const C = {
  layers: ['#9db2bf', '#5d8aa4', '#3a6d8a', '#1d4864'],
  edge: '#ffffff',
  concrete: '#e3eaee',
  pile: '#f3f7f9',
  wall: '#a8d4e1',
  stone: '#c9bea6',
  probe: '#3fb0d2',
  frame: '#1b7895',
  glow: '#3fb0d2',
};
// strata tops/bottoms (m); the rock layer runs under the cut-away so piles visibly socket into it
const STRATA = [[0, -1.0], [-1.0, -3.6], [-3.6, -5.4], [-5.4, -7.0]];
const X0 = -6, X1 = 6, Z0 = -3.5, Z1 = 3.5;

export function createScene(canvas, stage, { onPins, onDone }) {
  const mobile = matchMedia('(max-width: 760px)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 4 / 3, 1, 200);
  const target = new THREE.Vector3(0.3, -2.6, 0.4);

  scene.add(new THREE.HemisphereLight('#d6eef7', '#00131f', 1.4));
  const key = new THREE.DirectionalLight('#ffffff', 2.4);
  key.position.set(-6, 12, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#3fb0d2', 1.6);
  rim.position.set(10, 4, -8);
  scene.add(rim);

  const groups = {};        // animated groups by role
  const partMeshes = [];    // meshes that can be picked → userData.part
  const partMats = {};      // part → materials (for highlight)
  const fadeMats = [];      // materials that fade in
  const box = (x0, x1, y0, y1, z0, z1, mat, edgeMat) => {
    const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
    const m = new THREE.Mesh(g, mat);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    if (edgeMat) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), edgeMat));
    return m;
  };
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.02, flatShading: true, ...extra });
  const addPart = (part, mesh) => {
    mesh.userData.part = part;
    partMeshes.push(mesh);
    (partMats[part] ||= new Set()).add(mesh.material);
  };
  const cyl = (r, y0, y1, mat, seg = 18) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, y0 - y1, seg), mat);
    m.position.y = (y0 + y1) / 2;
    return m;
  };

  // ---- strata (two boxes per layer: back half + front-left quarter; front-right is cut away)
  groups.layers = STRATA.map(([top, bot], i) => {
    const g = new THREE.Group();
    const mat = std(C.layers[i], { transparent: true, opacity: 0 });
    const edge = new THREE.LineBasicMaterial({ color: C.edge, transparent: true, opacity: 0 });
    edge.userData.max = 0.28;
    fadeMats.push(mat, edge);
    g.add(box(X0, X1, bot, top, Z0, 0, mat, edge));
    g.add(box(X0, 0, bot, top, 0, Z1, mat, edge));
    if (i === STRATA.length - 1) g.add(box(0, X1, bot, top, 0, Z1, mat, edge)); // rock runs under the cut
    g.children.forEach((m) => addPart('ground', m));
    scene.add(g);
    return g;
  });

  // ---- retaining wall: secant piles along the cut face x = 0
  {
    const g = new THREE.Group();
    const mat = std(C.wall);
    for (let z = 0.25; z <= Z1 - 0.15; z += 0.34) {
      const m = cyl(0.21, 0.18, -4.3, mat, 14);
      m.position.x = 0;
      m.position.z = z;
      addPart('wall', m);
      g.add(m);
    }
    scene.add(g);
    groups.wall = g;
  }

  // ---- ground improvement: stone columns showing on the front face
  {
    const g = new THREE.Group();
    const mat = std(C.stone, { roughness: 1 });
    [-3.2, -2.4, -1.6, -0.8].forEach((x) => {
      const m = cyl(0.22, 0.02, -2.7, mat, 7);
      m.position.set(x, m.position.y, Z1);
      addPart('columns', m);
      g.add(m);
    });
    scene.add(g);
    groups.columns = g;
  }

  // ---- site investigation: borehole on the front face
  {
    const g = new THREE.Group();
    const mat = std(C.probe, { emissive: C.probe, emissiveIntensity: 0.25 });
    const m = cyl(0.11, 0.9, -6.7, mat, 12);
    m.position.set(-4.8, m.position.y, Z1);
    addPart('borehole', m);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 20), mat);
    cap.position.set(-4.8, 0.9, Z1);
    addPart('borehole', cap);
    g.add(m, cap);
    scene.add(g);
    groups.borehole = g;
  }

  // ---- piles under the cap, socketed into rock
  const PILES = [];
  {
    const mat = std(C.pile, { roughness: 0.6 });
    for (const z of [1.25, 2.65]) for (const x of [1.5, 3.0, 4.5]) {
      const m = cyl(0.2, 0, -5.9, mat, 20);
      m.position.set(x, m.position.y, z);
      addPart('piles', m);
      scene.add(m);
      PILES.push(m);
    }
    groups.piles = PILES;
  }

  // ---- pile cap / raft
  {
    const edge = new THREE.LineBasicMaterial({ color: '#001e30', transparent: true, opacity: 0.25 });
    const m = box(0.7, 5.3, 0, 0.36, 0.55, 3.35, std(C.concrete, { roughness: 0.7 }), edge);
    addPart('cap', m);
    scene.add(m);
    groups.cap = m;
  }

  // ---- the structure: the JP Mann "A" extruded
  {
    const s = 3.7 / 493; // width 3.7m
    const sh = new THREE.Shape();
    const P = [[247, 0], [493, 407], [360, 407], [247, 215], [135, 407], [0, 407]];
    P.forEach(([x, y], i) => (i ? sh.lineTo : sh.moveTo).call(sh, (x - 246.5) * s, (407 - y) * s));
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 1.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1 });
    geo.translate(0, 0, -0.55);
    const m = new THREE.Mesh(geo, std(C.frame, { roughness: 0.45, metalness: 0.15, emissive: C.frame, emissiveIntensity: 0.12 }));
    m.position.set(3.0, 0.36, 1.95);
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({ color: '#8fd3e8', transparent: true, opacity: 0.6 })));
    addPart('frame', m);
    scene.add(m);
    groups.frame = m;
  }

  // pin anchors, in list order: frame, cap, piles, columns, wall, borehole
  const anchors = [
    new THREE.Vector3(3.0, 2.2, 2.5),
    new THREE.Vector3(5.1, 0.36, 3.35),
    new THREE.Vector3(1.5, -3.2, 2.85),
    new THREE.Vector3(-2.0, -1.2, Z1 + 0.22),
    new THREE.Vector3(0.21, -2.6, 3.1),
    new THREE.Vector3(-4.8, -4.6, Z1 + 0.12),
  ];

  // ---- camera rig
  const rig = { az: 0.72, el: 0.36, r: 29, pAz: 0, pEl: 0 };
  const placeCamera = () => {
    const az = rig.az + rig.pAz, el = rig.el + rig.pEl;
    camera.position.set(target.x + rig.r * Math.sin(az) * Math.cos(el), target.y + rig.r * Math.sin(el), target.z + rig.r * Math.cos(az) * Math.cos(el));
    camera.lookAt(target);
  };

  let W = 1, H = 1;
  const v = new THREE.Vector3();
  const render = () => {
    placeCamera();
    renderer.render(scene, camera);
    onPins(anchors.map((a) => { v.copy(a).project(camera); return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H }; }));
  };
  let dirty = true;
  let running = true;
  const tick = () => { if (dirty && running) { dirty = false; render(); } };
  gsap.ticker.add(tick);
  const invalidate = () => { dirty = true; };

  const resize = () => {
    W = stage.clientWidth; H = stage.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // Fit: pull back on narrow stages so the whole block stays in frame.
    rig.r = W / H < 1.2 ? 34 : 29;
    camera.updateProjectionMatrix();
    invalidate();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  // Compile shaders now (we're created in idle time, before the section is on screen).
  try { renderer.compile(scene, camera); } catch { /* older three */ }

  // ---- assembly timeline
  let tl = null;
  const setStart = () => {
    groups.layers.forEach((g, i) => { g.position.y = -2.2 - i * 0.5; });
    fadeMats.forEach((m) => { m.transparent = true; m.opacity = 0; });
    groups.wall.position.y = -3; groups.columns.position.y = -3; groups.borehole.position.y = -3;
    [groups.wall, groups.columns, groups.borehole].forEach((g) => g.scale.set(1, 0.001, 1));
    PILES.forEach((p) => { p.userData.y ??= p.position.y; p.position.y = p.userData.y + 8; });
    groups.cap.userData.y ??= groups.cap.position.y; groups.cap.position.y = groups.cap.userData.y + 4;
    groups.frame.position.y = 0.36 + 6; groups.frame.scale.setScalar(0.85);
    rig.az = 1.05; rig.el = 0.46;
  };
  const play = () => {
    tl?.kill();
    setStart();
    running = true;
    const mats = fadeMats.map((m) => ({ m, to: m.userData.max ?? 1 }));
    tl = gsap.timeline({ onUpdate: invalidate, onComplete: () => {
      fadeMats.forEach((m) => { if (m.isMeshStandardMaterial) { m.transparent = false; m.opacity = 1; m.needsUpdate = true; } });
      invalidate();
      onDone();
    } });
    tl.to(rig, { az: 0.72, el: 0.36, duration: 2.6, ease: 'power2.inOut' }, 0);
    groups.layers.forEach((g, i) => tl.to(g.position, { y: 0, duration: 0.9, ease: 'power3.out' }, i * 0.07));
    mats.forEach(({ m, to }) => tl.to(m, { opacity: to, duration: 0.6, ease: 'none' }, 0));
    [groups.wall, groups.columns, groups.borehole].forEach((g, i) => {
      tl.to(g.position, { y: 0, duration: 0.8, ease: 'power3.out' }, 0.35 + i * 0.05);
      tl.to(g.scale, { y: 1, duration: 0.8, ease: 'power3.out' }, 0.35 + i * 0.05);
    });
    PILES.forEach((p, i) => tl.to(p.position, { y: p.userData.y, duration: 0.75, ease: 'power3.in' }, 0.6 + i * 0.04));
    tl.to(groups.cap.position, { y: groups.cap.userData.y, duration: 0.55, ease: 'power3.in' }, 1.15);
    tl.to(groups.frame.position, { y: 0.36, duration: 0.7, ease: 'back.out(1.1)' }, 1.45);
    tl.to(groups.frame.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'power3.out' }, 1.45);
  };

  // ---- subtle pointer parallax once assembled
  const pAz = gsap.quickTo(rig, 'pAz', { duration: 0.8, ease: 'power3.out', onUpdate: invalidate });
  const pEl = gsap.quickTo(rig, 'pEl', { duration: 0.8, ease: 'power3.out', onUpdate: invalidate });
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || tl?.isActive()) return;
    const r = stage.getBoundingClientRect();
    pAz(((e.clientX - r.left) / r.width - 0.5) * 0.12);
    pEl(((e.clientY - r.top) / r.height - 0.5) * -0.06);
  };
  stage.addEventListener('pointermove', onMove);

  // ---- picking + highlight
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pick = (e) => {
    if (tl?.isActive()) return null;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(partMeshes, false)[0];
    const p = hit?.object.userData.part;
    return p && p !== 'ground' ? p : null;
  };
  const glow = new THREE.Color(C.glow);
  let lit = null;
  const highlight = (part) => {
    if (part === lit) return;
    for (const [k, set] of Object.entries(partMats)) {
      if (k === 'ground') continue;
      set.forEach((m) => {
        m.userData.e ??= { c: m.emissive.clone(), i: m.emissiveIntensity };
        if (k === part) { m.emissive.copy(glow); m.emissiveIntensity = 0.55; }
        else { m.emissive.copy(m.userData.e.c); m.emissiveIntensity = m.userData.e.i; }
      });
    }
    lit = part;
    invalidate();
  };

  setStart();
  invalidate();

  return {
    play,
    pause: () => { running = false; tl?.pause(); },
    resume: () => { running = true; if (tl && tl.progress() < 1) tl.resume(); invalidate(); },
    highlight,
    pick,
    dispose: () => {
      tl?.kill();
      gsap.ticker.remove(tick);
      ro.disconnect();
      stage.removeEventListener('pointermove', onMove);
      scene.traverse((o) => { o.geometry?.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m?.dispose()); });
      renderer.dispose();
    },
  };
}
