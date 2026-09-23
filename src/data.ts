export const owner = {
  name: "John Albert Carbajal",
  short: "John Albert",
  role: "Full Stack Developer",
  email: "hello@albertcjc.dev",
  tagline: "Detail oriented, tailored specifically for your needs.",
};

export type Project = {
  title: string;
  category: string;
  kind: string;
  blurb: string;
  image: string;
  tags: string[];
  links: { label: string; href: string }[];
};

/**
 * Replace these with your real builds. `kind` is deliberately honest —
 * say whether it was a client job, a rebuild, or a self-directed project.
 */
export const projects: Project[] = [
  {
    title: "Ledgerly",
    category: "Full Stack · Web App",
    kind: "Personal project",
    blurb:
      "An expense tracker I built to learn Postgres properly. Receipts upload to S3, get parsed, and land in a monthly view. Auth, database and UI are all mine.",
    image:
      "https://images.pexels.com/photos/6177562/pexels-photo-6177562.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    tags: ["Next.js", "Postgres", "Tailwind", "Auth"],
    links: [
      { label: "Live site", href: "#" },
      { label: "Source", href: "#" },
    ],
  },
  {
    title: "Northside Interiors",
    category: "Redesign · Marketing Site",
    kind: "Client work",
    blurb:
      "Their old site was a page builder with 14 fonts on it. I rebuilt it on a four-column grid with two typefaces and real photos of their work. Loads in about a second now.",
    image:
      "https://images.pexels.com/photos/38139753/pexels-photo-38139753.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    tags: ["Redesign", "Vue", "CMS", "Responsive"],
    links: [{ label: "Live site", href: "#" }],
  },
  {
    title: "Plotline",
    category: "Full Stack · Collaboration",
    kind: "Personal project",
    blurb:
      "A shared canvas where two people can drag notes around and both see it happen. Websockets, optimistic updates, and a lot of time spent on what happens when the connection drops.",
    image:
      "https://images.pexels.com/photos/6615036/pexels-photo-6615036.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    tags: ["TypeScript", "WebSockets", "Canvas", "Node"],
    links: [
      { label: "Live demo", href: "#" },
      { label: "Source", href: "#" },
    ],
  },
  {
    title: "Field Notes",
    category: "Front-end · Editorial",
    kind: "Practice build",
    blurb:
      "A reading layout for long articles, built to get typography right. Markdown in, proper measure and rhythm out. No layout shift, works without JavaScript.",
    image:
      "https://images.pexels.com/photos/6177630/pexels-photo-6177630.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    tags: ["Astro", "Markdown", "Typography", "A11y"],
    links: [
      { label: "Live site", href: "#" },
      { label: "Source", href: "#" },
    ],
  },
];

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700`;

export const services = [
  {
    title: "Custom Websites",
    desc: "Built from scratch for what you actually need. No page builder, no template with your logo dropped in.",
    icon: "◎",
    preview: px(6177562),
  },
  {
    title: "Redesigns",
    desc: "You have a site that works but looks dated or loads slowly. I rebuild the front-end and keep what already earns its place.",
    icon: "◈",
    preview: px(6615036),
  },
  {
    title: "Front-end Development",
    desc: "You have designs and need them built properly. Responsive, accessible, matching the file down to the spacing.",
    icon: "⌘",
    preview: px(4959781),
  },
  {
    title: "Backend & Databases",
    desc: "Auth, APIs, database schemas and deploys. Full stack means I can finish the thing, not just the part you see.",
    icon: "✳",
    preview: px(38139753),
  },
];

export const stack = [
  { group: "Front-end", items: ["React", "Vue", "Next.js", "Nuxt", "TypeScript", "Tailwind"] },
  { group: "Back-end", items: ["Node", "Express", "Postgres", "Prisma", "REST", "Auth"] },
  { group: "Tooling", items: ["Git", "Vite", "Figma", "Docker", "Vercel", "Lighthouse"] },
];

export const process = [
  {
    no: "01",
    title: "Call",
    duration: "Free, 30 min",
    desc: "You tell me what you need and show me what you have. I tell you straight whether I can build it, how long I think it takes, and what it costs. If I am not the right fit I will say so.",
    deliverables: ["What you want built", "Rough timeline", "A price, not a range"],
  },
  {
    no: "02",
    title: "Design",
    duration: "Depends on size",
    desc: "I send layouts before writing any real code. You comment, I adjust, we repeat until you like it. Changing a layout takes minutes. Changing a built page takes days.",
    deliverables: ["Desktop + mobile layouts", "Your fonts and colours", "Revisions until approved"],
  },
  {
    no: "03",
    title: "Build",
    duration: "Updates every few days",
    desc: "I build it on a live preview link you can open any time. No waiting until the end to see progress. You can flag things as they appear.",
    deliverables: ["Preview link from day one", "Works on phones properly", "Keyboard and screen reader tested"],
  },
  {
    no: "04",
    title: "Launch",
    duration: "And after",
    desc: "I deploy it, hand over the repo and accounts, and walk you through editing your own content. Bugs I introduced get fixed free for 30 days.",
    deliverables: ["Deployed and pointed at your domain", "You own the code", "30 days of bug fixes"],
  },
];

export const tenets = [
  {
    title: "Optical alignment beats the grid",
    desc: "A circle set flush to a square looks smaller than it is. I nudge it a pixel or two and the maths stops matching. That version ships.",
  },
  {
    title: "Type gets set per project",
    desc: "Tracking tightens as headings get bigger. Line height loosens on long paragraphs. A default scale does neither, so I set them myself.",
  },
  {
    title: "Motion is timed, not guessed",
    desc: "Enter 300ms, exit 200ms, easing written down and reused. If a transition cannot explain where something went, I cut it.",
  },
  {
    title: "Empty and error states get built",
    desc: "The screens a frustrated user sees are usually the ones nobody designed. I build them alongside the normal ones.",
  },
  {
    title: "Speed is decided early",
    desc: "Subset a font and you save a couple hundred kilobytes. Set image dimensions and layout shift goes to zero. Both are decisions, not fixes.",
  },
  {
    title: "Keyboard paths get checked",
    desc: "Tab order, visible focus, contrast ratios. Tested before launch, because bolting accessibility on afterwards means rebuilding.",
  },
];

export const fitModes = [
  {
    name: "Single Page",
    tag: "Fig. 01",
    desc: "A landing page, portfolio or one-pager for a small business. Custom built, responsive, fast. Good if you need to exist online properly and nothing more complicated than that.",
    length: "1–2 weeks",
    price: "Get a quote",
    bestFor: "Small business",
    includes: [
      "Designed for your content, not a template",
      "Works on phones, tablets and desktop",
      "Contact form that reaches your inbox",
      "Deployed and connected to your domain",
    ],
  },
  {
    name: "Full Site",
    tag: "Fig. 02",
    desc: "Multiple pages, a CMS so you can edit text yourself, and whatever the site needs to actually do — bookings, a catalogue, a blog. Most projects land here.",
    length: "3–6 weeks",
    price: "Get a quote",
    bestFor: "Growing business",
    includes: [
      "Layouts approved before I build",
      "CMS so you can edit your own content",
      "Backend, database and auth if needed",
      "SEO basics and social preview cards",
      "Speed and accessibility pass",
      "30 days of bug fixes after launch",
    ],
  },
  {
    name: "Redesign",
    tag: "Fig. 03",
    desc: "You already have a site. It works, but it looks dated or loads slowly. I rebuild the front-end, keep what is worth keeping, and leave your content and URLs intact.",
    length: "2–4 weeks",
    price: "Get a quote",
    bestFor: "Existing sites",
    includes: [
      "Audit of what is slowing it down",
      "New front-end, same content",
      "URLs preserved so search rankings hold",
      "Before and after speed numbers",
    ],
  },
];

export const faqs = [
  {
    q: "You are new — why hire you?",
    a: "Because you get my full attention and a fair price. I am building a portfolio, which means your project matters to me more than it would to someone with a waiting list. Every project on this page is code I wrote — open the source links and check.",
  },
  {
    q: "What does it cost?",
    a: "Depends on what you need, so I quote per project rather than publish a number I would have to walk back. Tell me what you want and I will give you a fixed price on the call. No hourly billing, no surprise invoices.",
  },
  {
    q: "Can I edit the site myself afterwards?",
    a: "Yes, if you want that. I will set up a CMS so you can change text and images without touching code, and walk you through it before handover.",
  },
  {
    q: "Who owns the code?",
    a: "You do. The repository, the hosting accounts, the domain — all transferred to you at launch. You are not locked into me for changes later.",
  },
  {
    q: "What if I do not like it?",
    a: "You see layouts before I build anything, and we revise until you approve. That is the point of designing first — changing a layout is quick, changing a finished site is not.",
  },
  {
    q: "Do you work with people outside your area?",
    a: "Yes. Everything happens over email, calls and a shared preview link. Where you are does not matter.",
  },
];
