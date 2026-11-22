// Site-wide content.
// Text wrapped in [[double brackets]] is a placeholder or open question.
// It shows marked while `draft` is true, and `npm run build` lists every one left.

export default {
  // Set to false before publishing. Draft mode marks placeholders.
  draft: false,

  name: 'Júlia Betancourt',
  initials: 'JB',
  role: 'Product designer',
  descriptor: 'Product · Packaging · Visual communication',
  location: 'Barcelona',

  // Opening screen. The two lines of the big headline.
  hero: {
    lines: ['Júlia', 'Betancourt'],
    statement: 'I move between product, packaging and print, turning ideas into things people can see, hold and choose.',
  },

  about: {
    photo: { src: 'images/about/julia.jpg', alt: 'Portrait of Júlia Betancourt, smiling, outdoors' },
    hello: "Hi, I'm Júlia!", // bold
    tagline: 'A designer by choice, an overthinker by nature.', // bold
    paragraphs: [
      "This portfolio is a little collection of things I've worked on, things I've learned and ideas I've had way too much fun bringing to life.",
    ],
  },

  // Numbered list under the about text. Each line comes from what Júlia already wrote.
  services: [
    { title: 'Product & packaging', text: 'The box, the display, the finish, the object.' },
    { title: 'Visual communication & print', text: 'Paper, texture and finish, and how much they change a printed piece.' },
    { title: 'Concepts, renders & colour', text: 'Form, colour and material as one decision.' },
  ],

  // Shown as small labels next to each project.
  categories: [
    { tag: 'packaging', label: 'Packaging' },
    { tag: 'sustainability', label: 'Sustainability' },
    { tag: 'communications', label: 'Communications' },
    { tag: 'branding', label: 'Branding' },
    { tag: 'sensory', label: 'Sensory' },
    { tag: 'product', label: 'Product' },
  ],

  // Drawn as the hand-drawn line under About me, oldest first.
  // Dates and roles from Júlia's CV. `images` float under the text (use cut-out PNG/WebP);
  // with more than one, arrows let visitors flip through them. `kind: 'logo'` shows smaller.
  // `projects` lists the project pages made there (by slug); they replace the stop's text.
  // `link` adds a single "View project" link under the stop's picture instead. `tag` is a small hand-drawn stamp; `note` a hand-written
  // aside with an arrow. `pathEnd` is the note at the end of the line.
  path: [
    {
      when: '2020–2024',
      place: 'La Llotja (ESDAP)',
      role: 'Degree in Product Design · Barcelona',
      learned: 'Training in form, colour and material. Packaging became my focus, where product, brand and people meet.',
      note: 'where packaging clicked',
      images: [
        { src: 'images/path/danonino-frozen.webp', alt: 'Render of a tall, tapered Danonino push-up pack in pink and white', caption: 'Danonino, the petit suisse we all froze as kids, sold as a push-up ice lolly. Entry to an awards competition organised by Danone.', width: 300, height: 487 },
      ],
    },
    {
      when: 'Dec 2023–Apr 2024',
      place: 'Moodka Studio',
      role: 'Design intern · Sant Cugat',
      learned: 'Rebranding a brand: visual proposals and content, plus brand and competitor analysis.',
      tag: 'rebranding',
    },
    {
      when: 'Dec 2023–Apr 2024',
      place: 'Totparquet.cat',
      role: 'Store team · Barcelona',
      learned: 'Advising customers on materials and types of parquet for each problem, and looking after the look of the website.',
      tag: 'wood & materials',
    },
    {
      when: '2024',
      place: 'Final degree project',
      role: 'Academic project · Barcelona',
      learned: 'Family Likeness: cup, spoon and plate drawn from the SMEG universe. Not commissioned by SMEG.',
      images: [{ src: 'images/family-likeness/set-render-cutout.webp', alt: 'Render of the cup, spoon and plate set next to a SMEG coffee machine', width: 1000, height: 569 }],
      projects: ['family-likeness'],
    },
    {
      when: 'May 2024–Oct 2025',
      place: 'Fedrigoni Self-Adhesives',
      role: 'Marketing trade & sales support · Girona',
      learned: 'Coordinating a small team and working with papers, textures and the world of adhesives.',
      tag: 'paper, texture & adhesive',
      projects: ['paper-weight'],
    },
    {
      when: 'Oct 2025–now',
      place: 'Natulim',
      role: 'Product team',
      learned: 'Turning commercial briefs into packaging and in-store pieces, developed with suppliers.',
      note: 'here now',
      images: [
        { src: 'images/path/natulim-starter-kit.webp', alt: 'Natulim kēr starter kit: refillable dispenser and Sunrise shampoo can in a cardboard pack', caption: 'Starter kit for retail.', width: 600, height: 737 },
      ],
      link: 'work/first-touch/index.html',
    },
  ],

  pathEnd: 'to be continued…',

  // The CV page (about/index.html), reached from "About" in the menu.
  // From Júlia's CV (Spanish PDF, translated) plus her later corrections:
  // Fedrigoni ended Oct 2025, Natulim since Oct 2025, Moodka = design intern, Totparquet = store.
  cv: {
    experience: [
      { when: 'Oct 2025–now', place: 'Natulim', role: 'Product team',
        points: ['Turning commercial briefs into packaging and in-store pieces, developed with suppliers.'] },
      { when: 'May 2024–Oct 2025', place: 'Fedrigoni Self-Adhesives', role: 'Marketing trade & sales support · Girona',
        points: [
          'Sales presentations and sales arguments, designed and laid out.',
          'Newsletters, product sheets and promotional material for international trade fairs.',
          'Coordinating a small team and working with suppliers on printed materials.',
          'Support on internal training about CRM and sales documentation.',
        ] },
      { when: 'Dec 2023–Apr 2024', place: 'Moodka Studio', role: 'Design intern · Sant Cugat',
        points: [
          'Visual proposals and content for clients in different sectors.',
          'Brand and competitor analysis for communication campaigns.',
          'Branding strategy and actions.',
        ] },
      { when: 'Dec 2023–Apr 2024', place: 'Totparquet.cat', role: 'Store team · Barcelona',
        points: [
          'Advising customers on materials and types of parquet for each problem.',
          'Looking after the website and social media.',
        ] },
    ],
    education: [
      { when: 'Sep 2020–Jun 2024', place: 'Degree in Product Design', role: 'ESDAP La Llotja · Barcelona' },
      { when: '2018–2019', place: 'Seminar in Communication', role: 'University of Girona' },
      { when: '2016–2018', place: 'Baccalaureate in Humanities', role: 'La Salle' },
    ],
    languages: [['Spanish', 'Native'], ['Catalan', 'Native'], ['English', 'B2']],
    // Grouped for the CV page cards.
    skills: [
      { title: 'Graphic & image', text: 'Adobe Creative Suite: Photoshop, Illustrator, InDesign, After Effects.' },
      { title: '3D & CAD', text: 'SolidWorks, AutoCAD.' },
      { title: 'UI & prototyping', text: 'Figma, Sketch, Adobe XD.' },
      { title: 'Office & organisation', text: 'Microsoft Office, Google Workspace, Notion, CRM.' },
    ],
  },

  contact: {
    title: "Let's talk.",
    email: 'juliabetancourt8@gmail.com',
    linkedin: 'https://www.linkedin.com/in/julia-betancourt8',
    cv: 'files/julia-betancourt-cv.pdf', // made from the About page (print to PDF); replace to update
  },
};
