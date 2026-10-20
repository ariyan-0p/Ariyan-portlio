const base = import.meta.env.BASE_URL;
const shot = (name) => `${base}work/${name}.jpg`;
const thumb = (name) => `${base}work/s/${name}.jpg`; // 720px: a quarter of the memory once decoded

export const PROFILE = {
  name: 'Ariyan Samal',
  email: 'ariyansamal1201@gmail.com',
  phone: '+91 99376 43350',
  tel: 'tel:+919937643350',
  whatsapp: 'https://wa.me/919937643350?text=Hi%20Ariyan,%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect!',
  linkedin: 'https://www.linkedin.com/in/ariyan-samal-767614281/',
  resume: 'https://drive.google.com/file/d/12Oae5oa3i8eGR-eXcykriOSmTtQwS9qb/view?usp=sharing',
  photo: `${base}ariyan.jpg`,
  location: 'Hyderabad, India',
  coords: '17.3850° N, 78.4867° E',
};

// Order = order on the page. `featured` projects get a marker in the index.
export const PROJECTS = [
  {
    id: '01', slug: 'candle', title: 'Candle Cove', category: 'Handcrafted Candle Store', type: 'E-Commerce',
    year: '2026', url: 'candllecove.com', link: 'https://candllecove.com/', shot: shot('candle'), thumb: thumb('candle'),
    tech: ['Next.js', 'React', 'GSAP'],
    desc: 'A warm, story-led storefront for hand-poured candles — festive drops, collections and a smooth cart, lit with a glowing diya hero.',
    accent: '#ff8a3d',
  },
  {
    id: '02', slug: 'gripl', title: 'GRIPL India', category: 'Construction Marketplace', type: 'E-Commerce',
    year: '2026', url: 'griplindia.com', link: 'https://griplindia.com/', shot: shot('gripl'), thumb: thumb('gripl'),
    tech: ['React', 'Node.js', 'Tailwind'],
    desc: "Bhopal's build marketplace — materials, machinery, manpower and property sourced, priced and dispatched from one quote-driven storefront.",
    accent: '#ff6a1f', featured: true,
  },
  {
    id: '03', slug: 'anjna', title: 'Anjna Global', category: 'Travel DMC', type: 'Web',
    year: '2026', url: 'anjnaglobal.com', link: 'https://anjnaglobal.com/', shot: shot('anjna'), thumb: thumb('anjna'),
    tech: ['React', 'Node.js', 'Tailwind'],
    desc: 'A destination management platform for the travel trade — net rates, packages and quote workflows across five signature regions.',
    accent: '#e5484d',
  },
  {
    id: '04', slug: 'creoit', title: 'Creoit', category: 'Creative Agency', type: 'Web',
    year: '2026', url: 'creoit.in', link: 'https://creoit.in/', shot: shot('creoit'), thumb: thumb('creoit'),
    tech: ['React', 'Three.js', 'Motion'],
    desc: 'A 360° creative marketing agency site — branding, performance ads and growth, with an interactive draggable globe.',
    accent: '#7c5cff', featured: true,
  },
  {
    id: '05', slug: 'beyond', title: 'Beyond Honeymoons', category: 'Luxury Travel', type: 'Web',
    year: '2026', url: 'beyondhoneymoons.com', link: 'https://beyondhoneymoons.com/', shot: shot('beyond'), thumb: thumb('beyond'),
    tech: ['React', 'Framer Motion', 'Tailwind'],
    desc: 'Bespoke, hand-built honeymoon and milestone trips — a scroll-driven storefront with a draggable memory wall.',
    accent: '#16a394',
  },
  {
    id: '06', slug: 'carvaan', title: 'Carvaan Holidays', category: 'Travel & Tourism', type: 'Web',
    year: '2026', url: 'carvaanholidays.com', link: 'https://carvaanholidays.com/', shot: shot('carvaan'), thumb: thumb('carvaan'),
    tech: ['React', 'Node.js', 'Tailwind'],
    desc: 'A travel discovery platform — curated journeys and seamless booking for the modern explorer.',
    accent: '#f5a524',
  },
  {
    id: '07', slug: 'puravida', title: 'Puravida with Harsha', category: 'Wellness & Lifestyle', type: 'Web',
    year: '2026', url: 'puravidawithharsha.com', link: 'https://puravidawithharsha.com/', shot: shot('puravida'), thumb: thumb('puravida'),
    tech: ['React', 'Node.js', 'MongoDB'],
    desc: "A wellness platform built around a creator's voice — content, coaching and community in one calm space.",
    accent: '#46a758',
  },
  {
    id: '08', slug: 'eyzo', title: 'Eyzo', category: 'Digital Product', type: 'Web',
    year: '2026', url: 'eyzo.in', link: 'https://eyzo.in/', shot: shot('eyzo'), thumb: thumb('eyzo'),
    tech: ['Next.js', 'Node.js', 'Tailwind'],
    desc: 'A modern digital product experience — crafted for speed, clarity and a strong first impression.',
    accent: '#0ea5e9',
  },
  {
    id: '09', slug: 'keystone', title: 'Keystone Projects', category: 'Architectural Portfolio', type: 'Web',
    year: '2025', url: 'keystoneprojects.in', link: 'https://keystoneprojects.in/', shot: shot('keystone'), thumb: thumb('keystone'),
    tech: ['React', 'Tailwind', 'Motion'],
    desc: 'A bold digital presence for an architectural firm — spatial storytelling through the web.',
    accent: '#f59e0b', featured: true,
  },
  {
    id: '10', slug: 'bounten', title: 'Bounten App', category: 'LMS Platform', type: 'Mobile',
    year: '2025', url: 'play.google.com', link: 'https://play.google.com/store/apps/details?id=com.bounten.profitpartner', shot: shot('bounten'), thumb: thumb('bounten'),
    tech: ['Flutter', 'Node.js', 'Firebase'],
    desc: 'A learning management system built for scale — mobile-first, fast and frictionless.',
    accent: '#3b82f6',
  },
  {
    id: '11', slug: 'renobill', title: 'Reno Bill', category: 'Billing SaaS', type: 'SaaS',
    year: '2025', url: 'renobill.com', link: 'https://renobill.com/', shot: shot('renobill'), thumb: thumb('renobill'),
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
    desc: 'Billing infrastructure stripped to its essence — fast invoicing for modern businesses.',
    accent: '#8e4ec6',
  },
  {
    id: '12', slug: 'nts', title: 'NTS with Ankit', category: 'Personal Brand', type: 'Web',
    year: '2025', url: 'ntswithankit.com', link: 'https://ntswithankit.com/', shot: shot('nts'), thumb: thumb('nts'),
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
    desc: 'A personal brand platform built with conviction — content, community and credibility.',
    accent: '#ef6c00',
  },
];

export const FILTERS = ['All', 'Web', 'Mobile', 'SaaS', 'E-Commerce'];

export const CAPABILITIES = [
  {
    n: '01', title: 'Interfaces', sub: 'Frontend architecture',
    desc: 'Pixel-exact, motion-literate interfaces. Design systems, scroll choreography, WebGL when it earns its place — all shipped at a perf budget.',
    tags: ['React', 'Next.js', 'Flutter', 'GSAP', 'WebGL', 'Tailwind'],
  },
  {
    n: '02', title: 'Backends', sub: 'APIs & data',
    desc: 'Services that stay boring under load. REST APIs, auth, payments, quote and billing engines — modelled carefully, documented, tested.',
    tags: ['Node.js', 'Express', 'Go', 'MongoDB', 'Firebase', 'REST'],
  },
  {
    n: '03', title: 'Intelligence', sub: 'AI & machine learning',
    desc: 'LLM features that do real work inside products, not demos bolted on. Retrieval, tool use, evaluation, predictive models.',
    tags: ['LLM integration', 'Python', 'TensorFlow', 'RAG'],
  },
  {
    n: '04', title: 'Systems', sub: 'Cloud & delivery',
    desc: 'Cloud-native deployments with the pipeline to match. Containers, CI/CD and automation so releases are a non-event.',
    tags: ['AWS', 'Docker', 'CI/CD', 'Linux', 'System design'],
  },
];

export const LOG = [
  { hash: 'e9c4a10', head: true, kind: 'work', role: 'Software Engineer', org: 'Staffbee Solutions INC', place: 'Hyderabad', date: 'Mar 2026 — Present', msg: 'Building and shipping full-time software. Engineering scalable systems and delivering production-grade products.' },
  { hash: '7b2f3d8', kind: 'work', role: 'Full-stack Developer', org: 'Sharkify', place: 'Hyderabad', date: 'Jul 2024 — Mar 2026', msg: 'Led full-stack development for AI-driven solutions. Architected scalable web platforms and integrated advanced LLM features.' },
  { hash: '41ad9e6', kind: 'work', role: 'Development Intern', org: 'My Perfect Fit', place: 'Hyderabad', date: 'Jan 2024 — Jul 2024', msg: 'Contributed to a luxury fashion-tech platform. Optimised frontend performance and mobile responsiveness.' },
  { hash: 'c08e57b', kind: 'work', role: 'DevOps Intern', org: 'EstateDekho.com', place: 'Hyderabad', date: 'Oct 2023 — Dec 2023', msg: 'Managed cloud infrastructure and CI/CD pipelines. Automated deployment workflows to improve release efficiency.' },
  { hash: '2f6d1a4', kind: 'edu', role: 'B.Tech, Computer Science', org: 'KIIT University', place: 'Bhubaneswar', date: 'Aug 2021 — Aug 2024', msg: 'Software engineering and algorithms. Active member of the university coding society.' },
  { hash: '9d35b02', kind: 'edu', role: 'Diploma, Computer Science', org: 'UCP Engineering School', place: 'Berhampur', date: 'Jun 2018 — Jul 2021', msg: 'Foundations in computer science, networking and programming logic.' },
];

export const CLIENTS = ['Keystone Projects', 'NTS', 'Bounten', 'Renobill', 'Sharkify AI', 'Kaizernews', 'Carvaan Holidays', 'Creoit', 'Candle Cove', 'GRIPL India', 'Anjna Global'];
export const STACK = ['React', 'Next.js', 'Node.js', 'Flutter', 'Go', 'Python', 'TensorFlow', 'MongoDB', 'Firebase', 'AWS', 'Docker', 'GSAP', 'WebGL', 'Tailwind'];

export const SECTIONS = [
  { id: 'top', label: 'Index' },
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'process', label: 'Process' },
  { id: 'log', label: 'Log' },
  { id: 'contact', label: 'Contact' },
];
