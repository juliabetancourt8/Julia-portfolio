export default {
  slug: 'family-likeness',
  order: 2,
  title: 'Family Likeness',
  what: 'Cup, spoon and plate',
  context: 'Final degree project · La Llotja',
  kind: 'Academic',
  year: '2024',
  categories: ['product'],
  line: 'Three small objects that share one visual language, drawn from the SMEG universe.',
  notice: 'Academic, conceptual project. Not commissioned, produced or endorsed by SMEG.',
  approval: null,
  facts: [
    ['My part', 'Concept, form, colour and material, renders [[confirm it was an individual project]]'],
    ['Material', 'Steel'],
  ],
  preview: 'images/family-likeness/cup-red.webp',
  card: { src: 'images/family-likeness/set-render-cutout.webp', cutout: true },
  cover: { src: 'images/family-likeness/set-render.jpg', alt: 'Render of the cup, spoon and plate set in every colourway, next to a SMEG coffee machine', ratio: '1600/1173', note: 'Best render of the full set' },
  // Product showcase in place of the cover: the cup in every colourway, a big word behind it.
  showcase: {
    word: 'family',
    sub: 'Cup, saucer and spoon',
    items: [
      { src: 'images/family-likeness/cup-black.webp', name: 'Black' },
      { src: 'images/family-likeness/cup-cream.webp', name: 'Cream' },
      { src: 'images/family-likeness/cup-blue.webp', name: 'Pastel blue' },
      { src: 'images/family-likeness/cup-green.webp', name: 'Pastel green' },
      { src: 'images/family-likeness/cup-pink.webp', name: 'Pink' },
      { src: 'images/family-likeness/cup-red.webp', name: 'Red' },
      { src: 'images/family-likeness/cup-white.webp', name: 'White' },
    ],
    specs: [
      ['Pieces', 'Cup, saucer, spoon'],
      ['Colourways', '7'],
      ['Inspired by', 'SMEG'],
      ['Material', 'Steel'],
      ['Year', '2024'],
    ],
  },
  story: [
    { image: { src: 'images/family-likeness/spoons.webp', alt: 'The spoon in seven colourways: black, cream, pastel blue, green, pink, red and white', ratio: '1389/558', cutout: true }, caption: 'The spoon in all seven colourways.', size: 'full' },
    { text: '[[One or two sentences: what the three pieces share that makes them a family.]]' },
    // Loose pieces floating over the grid, as if the set had been dropped.
    {
      scatter: [
        { src: 'images/family-likeness/set-perspective-black.webp', alt: 'The black cup on its square steel saucer with the spoon resting in its slot, seen from above', x: 36, y: 12, w: 27, r: -4 },
        { src: 'images/family-likeness/spoons-pair.webp', alt: 'Two spoons, one with a pastel green tip and one with a pink tip', x: 70, y: 20, w: 16, r: 10 },
        { src: 'images/family-likeness/cup-red-fallen.webp', alt: 'The red cup lying on its side, showing its rounded steel base', x: 12, y: 46, w: 15, r: -14 },
      ],
      caption: 'Cup, saucer and spoon. The spoon rests in its own slot on the saucer.',
    },
    { image: { src: 'images/family-likeness/set-render-cutout.webp', alt: 'Render of the cup, spoon and plate set in every colourway, next to a SMEG coffee machine', ratio: '1000/569', cutout: true }, caption: 'The whole family next to the SMEG coffee machine.', size: 'full' },
    { image: { src: null, alt: '', ratio: '16/9', note: 'Reference board: SMEG forms, colours, details' }, caption: 'Starting point: the SMEG brand universe.', size: 'wide' },
  ],
};
