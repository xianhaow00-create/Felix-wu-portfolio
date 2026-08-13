// Felix Wu portfolio — site content
// All content in one place: personal info, projects, skills, honors

export const site = {
  meta: {
    title: 'Felix Wu — Visual Designer',
    description:
      'Visual / Brand / AI Designer based in Guangzhou. Crafting refined visual stories.',
    lang: 'zh-CN',
  },

  nav: [
    { id: 'work',     label: 'Work',     cn: '作品' },
    { id: 'about',    label: 'About',    cn: '关于' },
    { id: 'skills',   label: 'Skills',   cn: '能力' },
    { id: 'contact',  label: 'Contact',  cn: '联系' },
  ],

  contact: {
    email:   '3432477782@qq.com',
    phone:   '+86 181 3836 5377',
    location: 'Guangzhou · China',
    school:  'Guangzhou Huali College',
    major:   'Visual Communication · AI minor',
    socials: [
      { label: 'Behance',  href: '#' },
      { label: 'Rednote',  href: '#' },
      { label: 'Email',    href: 'mailto:3432477782@qq.com' },
    ],
  },

  hero: {
    kicker: 'Hello! I’m Felix Wu.',
    titleLines: ['Refined', 'Visual', 'Stories.'],
    subtitle:
      'A design student and creator of meaningful visual experiences — from packaging to brand worlds.',
    videoSrc: '/media/hero/benmingo.mp4',
    poster: '/works/hero-felix.webp',
  },

  about: {
    label: 'About',
    labelCn: '关于我',
    heading: 'Design is about stripping away the unnecessary — and getting to the essence of things.',
    headingCn:
      '水是血脉，文是灵魂，速度是翅膀。设计是剥离多余，直抵事物本质。',
    intro: `I’m Felix Wu (吴先浩), a visual designer and brand storyteller studying Visual Communication (with an AI minor) at Guangzhou Huali College — ranked 1st in my program with a 4.2 / 5.0 GPA.

I’m happiest when I’m making things: brand identities, packaging systems, IP characters, and motion-led editorial work. I interned at L’Oréal BrandStorm (Shu Uemura) and Mengniu (Sosodaily), building visual stories that need to ship.`,
    right: [
      { label: 'Class', value: "2023 — 2027" },
      { label: 'Major', value: 'Visual Comm. / AI minor' },
      { label: 'GPA',   value: '4.2 / 5.0  ·  Rank 1 / 251' },
      { label: 'Based', value: 'Guangzhou, China' },
    ],
    interests: [
      ['Dreaming of', 'Financial freedom, traveling the world'],
      ['Training for', 'AI + a slower life'],
      ['Reading',      'Wu Jun’s “Insights”'],
      ['Eating at',    "Mcdonald’s"],
    ],
    stats: [
      { num: '14+', label: 'Brand projects' },
      { num: '03',  label: 'Internships' },
      { num: '05',  label: 'Awards & patents' },
      { num: '02',  label: 'Languages (CN · EN)' },
    ],
  },

  // Curated for the portfolio. Each card links to the original PDF in /projects/ .
  projects: [
    {
      id: 'weaving',
      title: '织间 — Weaving Sweater Branding',
      titleCn: '织间 毛衣品牌设计',
      category: 'Brand Identity',
      type: 'Brand · IP · Packaging',
      year: '2025',
      cover: '/works/cover-weaving.webp',
      pdf: '/works/weaving-master.webp',
      desc:
        'A full identity system for a sweater brand — logotype, packaging, IP mascots, and spatial applications.',
      size: 'lg',     // large card
    },
    {
      id: 'shuuemura',
      title: 'Shu Uemura — Brand E-commerce Design',
      titleCn: '植村秀 品牌电商设计',
      category: 'Brand Design',
      type: 'Brand · E-commerce',
      year: '2026',
      cover: '/works/cover-shuuemura.webp',
      pdf: '/projects/shu-uemura.pdf',
      desc:
        'Shu Uemura CN e-commerce visual — detail pages, mega-promo banners, and brand-consistent visuals at scale.',
      size: 'md',
    },
    {
      id: 'yze',
      title: 'Yangtze River Delta — Water Town Living Room',
      titleCn: '长三角水乡客厅品牌设计',
      category: 'Brand Design',
      type: 'Brand · Spatial',
      year: '2026',
      cover: '/works/cover-yze.webp',
      pdf: '/projects/project-2.pdf',
      desc:
        'A cultural brand for the junction point of Jiangsu, Zhejiang and Anhui — region, river, and craft.',
      size: 'md',
    },
    {
      id: 'yingge',
      title: 'Yingge Soul — HERO TEA',
      titleCn: '英歌魂品牌设计',
      category: 'Brand Design',
      type: 'Brand · Packaging',
      year: '2026',
      cover: '/works/cover-yingge.webp',
      pdf: '/projects/project-3.pdf',
      desc:
        'Translating Chaozhou intangible cultural heritage into a modern tea-drinker’s universe.',
      size: 'md',
    },
    {
      id: 'pickleball',
      title: 'M+ Pickleball IP Character',
      titleCn: 'M+ 匹克球 IP 形象',
      category: 'IP Character',
      type: 'IP · Illustration',
      year: '2025',
      cover: '/works/cover-pickleball.webp',
      pdf: '/projects/m-pickleball.pdf',
      desc:
        'IP & visual system for a community-level pickleball brand — posters, urban walls, and digital.',
      size: 'md',
    },
    {
      id: 'dinosaur',
      title: 'Changzhou Dinosaur Park — Bubble Rex',
      titleCn: '常州恐龙园 IP 形象',
      category: 'IP Character',
      type: 'IP · Brand',
      year: '2025',
      cover: '/works/cover-dinosaur.webp',
      pdf: '/projects/changzhou-dinosaur.pdf',
      desc:
        'A pink, bubble-loving stegosaurus becomes the face of a theme park — design rationale to applications.',
      size: 'lg',
    },
    {
      id: 'ecom',
      title: 'E-commerce Integrated Design',
      titleCn: '电商整合设计',
      category: 'E-commerce',
      type: 'Design',
      year: '2025',
      cover: '/works/thumbs/project-4-2.webp',
      pdf: '/projects/project-4.pdf',
      desc:
        'Detail pages, structural design, and motion-led product storytelling — making objects feel inevitable.',
      size: 'sm',
    },
    {
      id: 'graphic',
      title: 'Graphic Design Studies',
      titleCn: '平面设计习作',
      category: 'Graphic',
      type: 'Artwork',
      year: '2024',
      cover: '/works/thumbs/project-5-2.webp',
      pdf: '/projects/project-5.pdf',
      desc:
        'Posters, magazine spreads, type experiments — chasing rhythm, hierarchy, and quiet surprises.',
      size: 'sm',
    },
    {
      id: 'magazine',
      title: 'Magazine Study',
      titleCn: '杂志研习',
      category: 'Editorial',
      type: 'Design',
      year: '2025',
      cover: '/works/thumbs/project-6-2.webp',
      pdf: '/projects/project-6.pdf',
      desc:
        'Editorial systems, page rhythm, and image-led storytelling — the slow craft of reading on paper.',
      size: 'sm',
    },
    {
      id: 'display',
      title: 'Display & Spatial Design',
      titleCn: '陈列与空间设计',
      category: 'Spatial',
      type: 'Design',
      year: '2025',
      cover: '/works/cover-display.webp',
      pdf: '/projects/project-7.pdf',
      desc:
        'How a brand behaves when it stands in a room — fixtures, retail rhythm, and the gesture of entry.',
      size: 'md',
    },
    {
      id: 'photo',
      title: 'Narrative Photography',
      titleCn: '叙事摄影',
      category: 'Photography',
      type: 'Artwork',
      year: '2024',
      cover: '/works/thumbs/project-8-2.webp',
      pdf: '/projects/project-8.pdf',
      desc:
        'A camera as a way of paying attention — light, motion, time, and the small frames of ordinary days.',
      size: 'sm',
    },
  ],

  experiences: [
    {
      org: 'L’Oréal BrandStorm',
      role: 'Visual Design Intern',
      cn: '欧莱雅百库 · 设计实习生',
      period: 'Jul 2026 — Present',
      bullets: [
        'Shu Uemura CN & North Asia e-commerce visual — detail pages, banners, video, offline assets.',
        'Visual systems for launches and mega-promotions, keeping brand tone consistent at scale.',
      ],
    },
    {
      org: 'Mengniu',
      role: 'Packaging Design Intern',
      cn: '蒙牛乳业 · 设计实习生',
      period: 'May 2026 — Jul 2026',
      bullets: [
        'Sosodaily probiotic SKUs (Platinum, Gold, Retail) — concept through to print.',
        "Chū'ài Niúniū 750g / 120g (Stage 1–3) — multi-SKU visual cohesion for the endcap.",
      ],
    },
    {
      org: 'Hecheng Sub-district Office',
      role: 'Visual Design Intern',
      cn: '荷城街道办事处 · 视觉实习生',
      period: 'Jul 2025 — Sep 2026',
      bullets: [
        '“Fuwan Industrial Park wall-painting” promo video — culture as a city landmark.',
        '“Koi Station” plan and a rain-season mosquito-control awareness script.',
      ],
    },
    {
      org: 'Pi Yi Xia Design Studio',
      role: 'Studio Head · Dean’s Office Assistant',
      cn: '皮壹下设计工作室 · 部长 / 教务处助理',
      period: '2023 — 2026',
      bullets: [
        'Trained members across departments; ran weekly reviews and meetings.',
        'Built role clarity, on-campus workflow, and bridged design studio with the Dean’s office.',
      ],
    },
  ],

  skills: [
    {
      title: 'Brand Identity',
      cn: '品牌设计',
      desc:
        'Logotypes, identity systems, packaging, IP characters, brand worlds — top to bottom.',
      tags: ['Visual System', 'Packaging', 'Type', 'IP'],
    },
    {
      title: 'Editorial & Print',
      cn: '排版与编辑',
      desc:
        'Magazines, posters, lookbooks — rhythm, hierarchy, and quiet elegance on paper.',
      tags: ['Layout', 'Type', 'Print'],
    },
    {
      title: 'Motion & Video',
      cn: '动态与影像',
      desc:
        'Editing, motion graphics, short-form videos, narrative direction.',
      tags: ['AE', 'Premiere', 'Story'],
    },
    {
      title: 'AI · Visual Research',
      cn: 'AI 视觉研究',
      desc:
        'Midjourney-driven exploration, image pipelines, AI-assisted brand systems.',
      tags: ['Midjourney', 'ComfyUI', 'Workflow'],
    },
    {
      title: 'Spatial & Display',
      cn: '空间与陈列',
      desc:
        'Retail rhythm, fixtures, small-format spatial composition for brands in rooms.',
      tags: ['Spatial', 'Display'],
    },
    {
      title: 'E-commerce Visual',
      cn: '电商视觉',
      desc:
        'Detail pages, banners, mega-promo systems — designed to be read and to sell.',
      tags: ['Detail Page', 'Banner'],
    },
  ],

  tools: [
    { name: 'Photoshop',     level: 95 },
    { name: 'Illustrator',   level: 92 },
    { name: 'After Effects', level: 80 },
    { name: 'Figma',         level: 90 },
    { name: 'Cinema 4D',     level: 70 },
    { name: 'Midjourney',    level: 88 },
  ],

  honors: [
    {
      title: '16th Lanqiao Cup National Finals',
      cn: '蓝桥杯全国总决赛',
      award: 'Third Prize',
      year: '2025',
    },
    {
      title: 'Guangdong Agri-Product Packaging Design',
      cn: '广东大学生农产品包装设计',
      award: 'Third Prize + Packaging Patent',
      year: '2025',
    },
    {
      title: '“Hundred-Thousand-Ten Thousand Project” Live-streamed Video',
      cn: '增城区百千万工程直播短视频',
      award: 'Second Prize',
      year: '2025',
    },
    {
      title: 'Natural Resources Cultural Creative Competition',
      cn: '自然资源文化创意大赛',
      award: 'Silver Award',
      year: '2025',
    },
    {
      title: 'Foshan Gaoming District “Outstanding Intern”',
      cn: '佛山市高明区优秀实习生',
      award: 'Honor',
      year: '2026',
    },
  ],
};
