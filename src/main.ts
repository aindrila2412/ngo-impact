import './styles.css';
import sectionsHtml from './generated/sections.html?raw';
import { content } from './generated/content';

const THEME_KEY = content.meta.themeStorageKey;

const main = document.querySelector<HTMLElement>('#main');
if (!main) throw new Error('Missing #main mount point');

main.innerHTML = sectionsHtml;

document.title = content.meta.title;
const desc = document.querySelector('meta[name="description"]');
if (desc) desc.setAttribute('content', content.meta.description);
const themeMeta = document.querySelector('meta[name="theme-color"]');
if (themeMeta) themeMeta.setAttribute('content', content.meta.themeColorLight);

const disclaimer = document.querySelector('#footer-disclaimer');
if (disclaimer) disclaimer.textContent = content.honesty.footer;

const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const header = document.querySelector<HTMLElement>('#site-header');
const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navMenu = document.querySelector<HTMLElement>('#nav-menu');
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.nav-menu a')];
const sections = [...document.querySelectorAll<HTMLElement>('main section[id]')];
const glow = document.querySelector<HTMLElement>('.cursor-glow');
const themeToggle = document.querySelector<HTMLButtonElement>('.theme-toggle');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (finePointer) document.body.classList.add('has-pointer');

/* ——— Theme (persisted) ——— */
function currentTheme(): 'light' | 'dark' {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', mode);
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* ignore quota / private mode */
  }
  if (themeMeta) {
    themeMeta.setAttribute(
      'content',
      mode === 'dark' ? content.meta.themeColorDark : content.meta.themeColorLight,
    );
  }
  themeToggle?.setAttribute(
    'aria-label',
    mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );
}

applyTheme(currentTheme());

themeToggle?.addEventListener('click', () => {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});

/* ——— Header scroll ——— */
function setHeaderState(): void {
  header?.classList.toggle('scrolled', window.scrollY > 14);
}
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

/* ——— Mobile nav ——— */
menuButton?.addEventListener('click', () => {
  const open = navMenu?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
  });
});

document.addEventListener('click', (event) => {
  const target = event.target as Node;
  if (!navMenu || !menuButton) return;
  if (!navMenu.contains(target) && !menuButton.contains(target)) {
    navMenu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
});

/* ——— Scroll reveal ——— */
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
}

/* ——— Active section spy ——— */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-28% 0px -60% 0px' },
);
sections.forEach((section) => sectionObserver.observe(section));

/* ——— Cursor glow ——— */
if (finePointer && glow && !prefersReducedMotion) {
  let raf = 0;
  let x = 0;
  let y = 0;
  window.addEventListener(
    'pointermove',
    (event) => {
      x = event.clientX;
      y = event.clientY;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        raf = 0;
      });
    },
    { passive: true },
  );
}

/* ——— Magnetic buttons ——— */
function initMagnetic(el: HTMLElement): void {
  if (!finePointer || prefersReducedMotion) return;
  const strength = el.classList.contains('btn-solid') ? 0.32 : 0.26;
  el.addEventListener('pointermove', (event) => {
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
}
document.querySelectorAll<HTMLElement>('.magnetic').forEach(initMagnetic);

/* ——— Tilt cards ——— */
document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
  if (!finePointer || prefersReducedMotion) return;
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});
