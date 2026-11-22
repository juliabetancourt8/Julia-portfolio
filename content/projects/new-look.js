export default {
  slug: 'new-look',
  order: 5,
  title: 'New Look',
  what: 'Packaging redesigns',
  context: 'Natulim',
  kind: 'Professional',
  year: '[[year]]',
  categories: ['packaging', 'branding', 'sustainability'],
  line: 'Updating how a range of household products looks and feels on the shelf.',
  notice: null,
  approval: 'Only include if Natulim agrees to show a before and after. Confirm the materials before keeping this in Sustainability.',
  facts: [
    ['My part', '[[your part]]'],
    ['Materials', '[[e.g. recycled cardboard, recyclable plastic, paper labels]]'],
    ['Stage', '[[on shelf / in development]]'],
  ],
  cover: { src: null, alt: 'Redesigned packaging range', note: 'The redesigned range lined up, front view' },
  story: [
    {
      pair: [
        { src: null, alt: '', ratio: '4/5', note: 'Pack before the redesign', caption: 'Before.' },
        { src: null, alt: '', ratio: '4/5', note: 'The same pack after the redesign', caption: 'After.' },
      ],
    },
    { text: '[[One or two sentences: what changed and why.]]' },
    { image: { src: null, alt: '', ratio: '16/9', note: 'Colour, material or finish detail' }, caption: '[[Material or finish.]]', size: 'wide' },
  ],
};
