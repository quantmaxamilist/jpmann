// All copy on this site is verbatim from the live Wix site www.jpmann.com (fetched Oct 2026).
// Long-form page bodies live in pages.json (parsed from the old pages' HTML, unedited);
// this file holds the shared details and the short pieces the new layouts arrange.
import pagesJson from './pages.json';
// Publish dates from each old post's own BlogPosting markup.
import postDates from './post-dates.json';

export type Block = { t: string; x: string };
export type OldPage = { title: string; description: string; blocks: Block[]; images: string[] };
export const pages = pagesJson as Record<string, OldPage>;

export const contact = {
  phone: '+44 7765 536 365',
  phoneHref: 'tel:+447765536365',
  whatsappHref: 'https://wa.me/447765536365',
  email: 'janet@jpmann.com',
  address: 'Anglo Dal House 5, Spring Villa Park, Edgware, Middlesex, HA8 7EB',
  instagram: 'https://www.instagram.com/jpmann_uk/',
  instagramHandle: '@jpmann_uk',
  tagline: 'Structural & Geotechnical Consultants', // from the logo
  copyright: '© 2025 by JPMANN',
};

// Old-site emoji are dropped from headings (styling only); the words are unchanged.
export const stripEmoji = (s: string) =>
  s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').replace(/\s+/g, ' ').trim();

export const home = {
  title: 'Structural & Geotechnical Engineers UK | JPMANN',
  description: pages[''].description,
  // Old h1 read "Engineers inUK" (missing space) — corrected and flagged in the delivery note.
  h1a: 'Structural & Geotechnical Engineers in UK:',
  h1b: 'Foundation and Pile Design Specialists',
  h2: 'Building Strong Foundations for a Better Tomorrow',
  intro: pages[''].blocks[2].x,
  cta: 'Get a free quote for your project',
  aboutLabel: 'ABOUT US',
  aboutStatement: 'At JPMANN, we simplify your design processes to speed up your project',
  about1: pages[''].blocks[5].x,
  about2: pages[''].blocks[6].x.replace('commitment.We', 'commitment. We'),
  aboutCta: 'Learn More About Us',
  servicesH: 'Our structural and geotechnical engineering services',
  servicesSub: 'Providing expert building consulting services',
  projectsH: 'Featured foundation and structural projects',
  projectsSub: 'Every project has its own DNA',
  projectsNext: 'YOUR PROJECT NEXT?',
  projectsCta: 'View Projects',
  clientsH: 'WE WORK WITH SMALL AND LARGE CLIENTS',
  clientsSub: "We understand your needs whether it's home improvement or commercial development.",
  instagramH: 'Follow us on Instagram',
  contactH: 'CONTACT US',
  contactSub: 'Reach out with any questions or inquiries',
};

export type Service = {
  slug: string;     // new route: /services/<slug>
  old: string;      // old Wix path (301s to the new route)
  name: string;     // nav label on the old site
  summary?: string; // from the old /services page where it had one
};

// Order and labels follow the old site's Services dropdown.
export const services: Service[] = [
  { slug: 'architectural-services', old: 'architectural-services', name: 'Architectural Services' },
  { slug: 'planning-services', old: 'planning-services', name: 'Planning Services' },
  { slug: 'pile-design', old: 'pile-design-company', name: 'Pile Design' },
  {
    slug: 'project-management', old: 'project-management', name: 'Project Management & Supervision',
    summary: 'We handle every aspect of the project, from inception to completion, to ensure the build proceeds smoothly. This includes liaising with contractors, architects, and local authorities. Our skilled team is committed to ensuring your project remains on schedule and within budget.',
  },
  {
    slug: 'structural-engineering', old: 'structural-engineers-consultants', name: 'Structural Engineering',
    summary: 'JP Mann can assist with any project by providing a comprehensive range of structural engineering services. We offer structural design, analysis, inspections, calculations, drawings, and reports, as well as expert witness and party wall surveyor services.',
  },
  {
    slug: 'geotechnical-engineering', old: 'geotechnical-consultants', name: 'Geotechnical Engineering',
    summary: 'We are dedicated to assisting with a wide range of geotechnical engineering challenges, including foundation underpinning, ground improvement, the evaluation and design of retaining walls, and the design of dewatering systems, among others.',
  },
  {
    slug: 'geotechnical-foundation-design', old: 'geotechnical-foundation-design', name: 'Geotechnical & Foundation Design',
    summary: 'We specialise in the design of various piling solutions, including rotary bored, CFA, mini-piles, precast concrete, steel-cased driven, restricted access, sheet, king post walls, and contiguous and secant piled walls. We can also advise on the most suitable piling method for your specific site.',
  },
  {
    slug: 'ground-improvement', old: 'ground-improvement', name: 'Ground Improvement',
    summary: 'JP Mann can design bespoke ground improvement schemes for both small and large projects in-house. These include wick drains, PVDs, and band drains, as well as vibro stone columns and rigid inclusion columns.',
  },
  { slug: 'structural-designs', old: 'structural-designs', name: 'Structural Designs' },
  {
    slug: 'expert-witness', old: 'experts-witness', name: 'Experts Witness',
    summary: 'We provide expert advice to clients, contractors, and sub-contractors involved in disputes regarding piling and geotechnical engineering work. As qualified professionals, we are experienced in providing testimony on behalf of our clients',
  },
];

/** First sentence of the old page's first paragraph — used where the old /services page had no summary. */
export function serviceSummary(s: Service): string {
  if (s.summary) return s.summary;
  const p = pages[s.old].blocks.find((b) => b.t === 'p' && b.x.length > 60);
  if (!p) return '';
  const m = p.x.match(/^.+?[.!?](\s|$)/);
  return (m ? m[0] : p.x).trim();
}
export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)!;

// Photos per service: the client's own images, as used on the matching old page where possible.
export const serviceImage: Record<string, string> = {
  'architectural-services': '/img/site-cranes.jpg',
  'planning-services': '/img/london-terrace.jpg',
  'pile-design': '/img/projects/bengaluru.jpg',
  'project-management': '/img/projects/swindon-digesters.jpg',
  'structural-engineering': '/img/projects/loughton-steel.jpg',
  'geotechnical-engineering': '/img/site-groundworks.jpg',
  'geotechnical-foundation-design': '/img/site-pile-layout.jpg',
  'ground-improvement': '/img/site-piling-aerial.jpg',
  'structural-designs': '/img/projects/football-club.jpg',
  'expert-witness': '/img/projects/waremead.jpg',
};

// Homepage "Featured" projects — names and photos from the old homepage.
export const featured = [
  { name: "KING'S CROSS ST PANCRAS UNDERGROUND STATION, LONDON", img: '/img/projects/kings-cross.jpg', w: 682, h: 910 },
  { name: 'TAV STATION, FLORENCE, ITALY', img: '/img/projects/tav-florence.jpg', w: 750, h: 505 },
  { name: 'WHITECITY DEVELOPMENT, LONDON', img: '/img/projects/white-city.jpg', w: 1024, h: 683 },
];

// Project write-ups from /projects-8, split at each heading. Photos are in the old page's order.
const projectImgs = [
  ['football-club', 750, 772], ['industrial-unit', 804, 799], ['essex', 755, 799], ['thamesmead', 796, 797],
  ['waremead', 755, 806], ['loughton-steel', 803, 801], ['bengaluru', 591, 440], ['swindon-digesters', 1742, 1298],
  ['princes-half-yard', 1600, 1200],
] as const;
export type Project = { slug: string; title: string; body: string[]; img: string; w: number; h: number };
export const projects: Project[] = (() => {
  const out: Project[] = [];
  for (const b of pages['projects-8'].blocks.slice(1)) {
    if (b.t === 'h2') {
      const [slug, w, h] = projectImgs[out.length];
      out.push({ slug, title: stripEmoji(b.x), body: [], img: `/img/projects/${slug}.jpg`, w, h });
    } else if (out.length) {
      out[out.length - 1].body.push(...b.x.split(/\n+/).map((l) => l.trim()).filter(Boolean));
    }
  }
  return out;
})();

export const about = {
  title: pages.about.title,
  description: pages.about.description,
  kicker: 'WHO WE ARE',
  h1: 'We are a team of Structural and Geotechnical Design Specialists',
  body: pages.about.blocks.slice(2, 5).map((b) => b.x),
  // No portrait exists on the old site. Drop a file in public/img/ and set its path here to show it.
  founderPhoto: '',
  founderRole: 'Senior Consultant & Founder',
  founderBio: pages.about.blocks[6].x,
  keyProjectsH: 'Key projects include:',
  keyProjects: [
    'Westfield, White City (£674m overall development value; £30m foundation works)',
    'King’s Cross Underground Station Redevelopment (£25m)',
    'Arsenal Stadium Redevelopment',
    'UCL Cancer Centre Basement',
  ],
  education: ['Bachelor of Civil Engineering, University of Science, Malaysia', 'Master’s degree in Soil Mechanics, Imperial College London'],
  membership: ['Full Member, Institution of Civil Engineers (ICE)'],
  missionLabel: 'OUR MISSION',
  missionH: 'Our mission is to provide comprehensive structural and geotechnical engineering services to our clients',
  mission: pages.about.blocks[19].x,
  clientsH: 'CLIENTS',
  clientTypes: ['Private individuals', 'Building contractors', 'Property developers', 'Engineers', 'Loss adjusters', 'Architects'],
  solutionsH: 'SOLUTIONS FOR',
  solutions: ['new builds', 'home extensions', 'ground beams', 'underpinning', 'foundation', 'site investigation'],
};

export const clients = {
  title: pages.clients.title,
  description: pages.clients.description,
  h1: 'WE WORK WITH SMALL AND LARGE CLIENTS',
  h2: "Engineers who understand your needs whether it's home improvement or commercial development",
  named: ['HIGH SPEED RAIL 2', 'ROXBOROUGH GROUND IMPROVEMENT', 'NOBLE STRUCTURES'],
  // Logos shown on the old homepage and Clients page, with their old alt text.
  logos: [
    { src: '/img/logos/hs2.png', alt: 'High Speed Rail 2 (HS2)', dark: false },
    { src: '/img/logos/roxborough.png', alt: 'Logo of Roxborough Ground Improvement', dark: false },
    { src: '/img/logos/noble-structures.png', alt: 'Logo of Noble Structures', dark: true },
    { src: '/img/logos/franki.png', alt: 'Logo of Franki Foundations', dark: false },
    { src: '/img/logos/sheppard.png', alt: 'Logo of Sheppard Piling', dark: false },
    { src: '/img/logos/patterson.png', alt: 'Logo of Patterson Construction.', dark: false },
  ],
};

// Contact form fields as on the old site's form.
export const form = {
  fields: { name: 'Name/Company Name', address: 'Property Address', date: 'Date Needed', service: 'Service Required', email: 'Email', details: 'Any other details....' },
  submit: 'Submit',
  thanks: 'Thanks for submitting!',
  required: '* required',
};

export const nav = [
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/clients', label: 'Clients' },
  { href: '/blog', label: 'Blog' },
];

// Long-tail landing pages from the old site, kept at their exact URLs.
const nonLanding = new Set(['', 'about', 'clients', 'blog', 'services', 'projects-8', 'sales-brochure', ...services.map((s) => s.old)]);
export const landingSlugs = Object.keys(pages).filter((k) => !k.startsWith('post/') && !nonLanding.has(k));

export const posts = Object.entries(pages)
  .filter(([k]) => k.startsWith('post/'))
  .map(([k, v]) => {
    const d = (postDates as Record<string, { published: string; modified: string }>)[k.slice(5)];
    return { slug: k.slice(5), ...v, h1: v.blocks.find((b) => b.t === 'h1')?.x ?? v.title, published: d?.published, modified: d?.modified ?? d?.published };
  })
  .sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''));
export const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

/** Old h1 with whitespace tidied ("Structural Engineering :\n\nThe Backbone…" → one line). */
export const tidyH1 = (s: string) => s.replace(/\s*\n+\s*/g, ' ').replace(/\s+:/g, ':').trim();

/** Split an old page into hero (h1 + first paragraph) and the rest of its body. */
export function splitPage(p: OldPage) {
  const h1i = p.blocks.findIndex((b) => b.t === 'h1');
  const h1 = h1i >= 0 ? tidyH1(p.blocks[h1i].x) : p.title;
  const rest = p.blocks.filter((_, i) => i !== h1i);
  const li = rest.findIndex((b) => b.t === 'p');
  const lead = li === 0 || (li === 1 && rest[0].t !== 'h2') ? rest[li].x : undefined;
  const body = lead ? rest.filter((_, i) => i !== li) : rest;
  return { h1, lead, body };
}

// Photo for a long-tail landing page, chosen from the client's own photos by topic.
export function topicImage(slug: string): string {
  if (/pile|piling/.test(slug)) return '/img/projects/bengaluru.jpg';
  if (/ground-improvement/.test(slug)) return '/img/site-piling-aerial.jpg';
  if (/foundation/.test(slug)) return '/img/site-pile-layout.jpg';
  if (/geotech|soil|investigation|desk-study/.test(slug)) return '/img/site-groundworks.jpg';
  if (/retaining/.test(slug)) return '/img/projects/waremead.jpg';
  if (/expert/.test(slug)) return '/img/projects/swindon-digesters.jpg';
  if (/extension|new-build|residential|permitted/.test(slug)) return '/img/projects/thamesmead.jpg';
  if (/structural/.test(slug)) return '/img/projects/loughton-steel.jpg';
  if (/planning|architect|building|design-and-build|drawings|plans/.test(slug)) return '/img/london-terrace.jpg';
  return '/img/site-cranes.jpg';
}

// From JP Mann's own sales brochure (public/docs/jpmann-sales-brochure.pdf, pages 3–4 and 7), verbatim.
export const brochure = {
  structuralH: 'Structural Design Services',
  structural: [
    'Full basement design (base slabs, lining walls, capping beams, and temporary works)',
    'Underpinning solutions (piled underpinning and mass concrete underpinning)',
    'Superstructure design',
    'Temporary works design',
    'Structural steelwork',
    'Timber structures',
    'Retaining walls (piled walls, reinforced concrete walls, and masonry walls)',
    'Bar bending schedules',
    'Structural repairs',
    'Strip foundations and piled ground beams',
    'Raft slabs (piled raft slabs and ground-bearing slabs)',
    'Structural detailing',
    'Brick and block masonry retaining walls (Steppoc walls, cavity-filled gravity walls, and hollow block masonry walls)',
  ],
  geotechnicalH: 'Geotechnical Design Services',
  geotechnical: [
    'Soil investigation report',
    'Basement impact assessments',
    'Ground movement assessments',
    'Ground improvement solutions (stone columns, rigid inclusions, and PVDs)',
    'Piled retaining walls (contiguous piles, secant piles, king post piles, and sheet piles)',
    'Bearing piles',
    'Screw piles',
    'Driven piles (steel cased driven piles and precast driven piles)',
    'Micropiles',
    'Soil nailing and ground anchor design',
    'Pile working platform design',
  ],
  intro: 'At JPMANN, we have a dedicated and experienced team specialising in structural and foundation design for projects of all sizes. From small residential extensions to complex basement schemes and large-scale new builds, we provide practical, compliant, and cost-effective design solutions tailored to our clients’ needs',
  residential: [
    { h: 'House Extensions', p: 'We deliver structural design for residential extensions, ensuring safe load transfer and seamless integration with the existing structure.', href: '/house-extension-design' },
    { h: 'Soil Investigation', p: 'We deliver site-specific ground analysis to support safe, efficient, and reliable foundation solutions.', href: '/soil-investigation' },
    { h: 'Expert Witness', p: 'Detailed & well-supported expert reports that clearly communicate our findings and conclusions, providing comprehensive documentation for legal proceedings.', href: '/services/expert-witness' },
  ],
  contactName: 'Janet Martin',
};

/** The 800px variant of a photo when one exists (made for every photo wider than 900px). */
import fs from 'node:fs';
export const small = (src: string) => {
  const s = src.replace(/\.jpg$/, '-800.jpg');
  return fs.existsSync(`public${s}`) ? s : src;
};
/** srcset pairing the 800px variant with the original. */
export const srcsetFor = (src: string, w = 1800) => (small(src) !== src ? `${small(src)} 800w, ${src} ${w}w` : undefined);
