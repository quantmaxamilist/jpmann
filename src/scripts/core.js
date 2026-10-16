// JP Mann core: smooth scroll, header, menu, reveals, page transitions, cursor.
import Lenis from 'lenis';
import { gsap } from 'gsap';

const html = document.documentElement;
const mq = (q) => matchMedia(q).matches;
const reduced = mq('(prefers-reduced-motion: reduce)');
const fine = mq('(hover: hover) and (pointer: fine)');

// ---- Lenis, driven by the gsap ticker ---------------------------------------
export const lenis = reduced ? null : new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
if (lenis) {
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
if (import.meta.env.DEV) window.__jpm = { lenis, gsap };

const scrollToEl = (el) => {
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.1 });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
};
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href*="#"]');
  if (!a || e.metaKey || e.ctrlKey) return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!el) return;
  e.preventDefault();
  closeMenu();
  scrollToEl(el);
});

// ---- Header: hide on scroll down, show on up --------------------------------
const hdr = document.querySelector('[data-header]');
let lastY = scrollY;
const onScroll = (y) => {
  if (!hdr) return;
  const menuOpen = !document.querySelector('[data-menu]')?.hidden;
  if (!menuOpen && !reduced) hdr.classList.toggle('is-hidden', y > lastY + 2 && y > 500 && !hdr.contains(document.activeElement));
  if (y < lastY - 2 || y < 500) hdr.classList.remove('is-hidden');
  lastY = y;
};
if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

// ---- Mobile menu --------------------------------------------------------------
const menu = document.querySelector('[data-menu]');
const menuBtn = document.querySelector('[data-menu-btn]');
function closeMenu() {
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  menuBtn?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  lenis?.start();
}
if (menu && menuBtn) {
  menuBtn.addEventListener('click', () => {
    if (!menu.hidden) return closeMenu();
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    hdr?.classList.remove('is-hidden');
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 1040) closeMenu(); });
  addEventListener('pageshow', (e) => { if (e.persisted) closeMenu(); });
}

// ---- Reveals: IntersectionObserver plus a sweep so fast scrolls never leave content hidden
const pending = new Set(document.querySelectorAll('[data-reveal]'));
// Anything already on screen at start is shown at once with no fade, so reveals never delay first paint.
pending.forEach((el) => {
  if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('is-in'); el.dataset.instant = ''; pending.delete(el); }
});
html.classList.add('reveal-on');
const show = (el) => { el.classList.add('is-in'); pending.delete(el); io?.unobserve(el); };
const io = reduced ? null : new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && show(e.target)), { rootMargin: '0px 0px -8% 0px' });
if (reduced) pending.forEach(show);
else pending.forEach((el) => io.observe(el));
const sweep = () => {
  if (!pending.size) return;
  const h = innerHeight * 0.92;
  pending.forEach((el) => { if (el.getBoundingClientRect().top < h) show(el); });
};
if (lenis) lenis.on('scroll', sweep); else addEventListener('scroll', sweep, { passive: true });

// ---- Page transitions: ≤0.3s out, navigate as soon as covered -----------------
const pt = document.getElementById('pt');
const arriving = html.classList.contains('pt-arrive');
if (arriving && pt) {
  if (reduced) gsap.to(pt, { opacity: 0, duration: 0.12, onComplete: () => html.classList.remove('pt-arrive') });
  else gsap.fromTo(pt, { yPercent: 0 }, { yPercent: -100, duration: 0.4, ease: 'power3.inOut', onComplete: () => { html.classList.remove('pt-arrive'); gsap.set(pt, { clearProps: 'all' }); } });
}
try { sessionStorage.removeItem('jpm:pt'); } catch {}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || !pt || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || /\.(pdf|jpg|png)$/i.test(url.pathname)) return;
  if (url.pathname === location.pathname && url.search === location.search) return;
  e.preventDefault();
  const go = () => { try { sessionStorage.setItem('jpm:pt', '1'); } catch {} location.href = url.href; };
  pt.style.visibility = 'visible';
  if (reduced) return gsap.fromTo(pt, { opacity: 0, yPercent: 0 }, { opacity: 1, duration: 0.12, onComplete: go });
  gsap.fromTo(pt, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power3.inOut', onComplete: go });
});
addEventListener('pageshow', (e) => {
  if (e.persisted && pt) { gsap.killTweensOf(pt); gsap.set(pt, { clearProps: 'all' }); pt.style.visibility = ''; html.classList.remove('pt-arrive'); }
});

// ---- Cursor: 24px ring + 6px dot, 40px over links; mouse only ------------------
const cursor = document.getElementById('cursor');
if (cursor && fine && !reduced) {
  html.classList.add('has-cursor');
  const dot = cursor.firstElementChild;
  const ring = cursor.lastElementChild;
  const dx = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'none' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'none' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    cursor.classList.add('is-on');
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    const t = e.target;
    cursor.classList.toggle('is-link', !!t.closest?.('a, button, label, [role="button"], summary'));
    cursor.classList.toggle('is-hide', !!t.closest?.('input:not([type="checkbox"]), textarea, select'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
}
