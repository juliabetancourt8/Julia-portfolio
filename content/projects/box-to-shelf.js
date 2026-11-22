export default {
  slug: 'box-to-shelf',
  order: 3,
  title: 'Box to Shelf',
  what: 'Shelf-ready packaging for Costco [[confirm we can name Costco]]',
  context: 'Natulim',
  kind: 'Professional',
  year: '[[year]]',
  categories: ['packaging', 'sustainability'],
  line: 'A shipping box that becomes the display the moment it is opened.',
  notice: null,
  approval: 'Confirm with Natulim that this can be shown and whether Costco can be named. Confirm the board material before keeping this in Sustainability.',
  facts: [
    ['My part', '[[your part]]'],
    ['Materials', '[[e.g. corrugated board, print, finish]]'],
    ['Stage', '[[produced / proposal]]'],
  ],
  cover: { src: null, alt: 'Retail-ready boxes on a store shelf', note: 'The boxes on shelf' },
  story: [
    {
      pair: [
        { src: null, alt: '', ratio: '4/3', note: 'Closed box, as shipped', caption: 'Shipped.' },
        { src: null, alt: '', ratio: '4/3', note: 'Opened box, product on show', caption: 'Opened.' },
      ],
    },
    { text: '[[One or two sentences: what the box needed to say on the shelf.]]' },
    { image: { src: null, alt: '', ratio: '16/9', note: 'Boxes in store, seen from a shopper’s distance' }, caption: '[[On shelf.]]', size: 'full' },
  ],
};
