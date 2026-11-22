export default {
  slug: 'first-touch',
  order: 1,
  title: 'First Touch',
  what: 'Shampoo and dispenser kit',
  context: 'Natulim',
  kind: 'Professional',
  year: '[[year]]',
  categories: ['packaging'],
  line: 'A shampoo and its dispenser, presented together as one kit for stores.',
  notice: null,
  approval: 'Confirm with Natulim which images can be shown.',
  facts: [
    ['My part', '[[e.g. concept, visual proposal, samples, supplier development]]'],
    ['Stage', '[[launched / in development / prototype]]'],
  ],
  cover: { src: 'images/first-touch/starter-kit.jpg', alt: 'Natulim kēr starter kit: refillable dispenser and Sunrise shampoo can in a cardboard pack', ratio: '1/1', note: 'The complete kit, styled on a plain surface' },
  story: [
    { image: { src: null, alt: '', ratio: '3/2', note: 'Kit contents laid out flat' }, caption: '[[One line: what is in the kit.]]', size: 'full' },
    {
      pair: [
        { src: null, alt: '', ratio: '4/5', note: 'Early proposal or sketch', caption: '[[First proposal.]]' },
        { src: null, alt: '', ratio: '4/5', note: 'Material or finish samples', caption: '[[Samples.]]' },
      ],
    },
    { text: '[[One or two sentences: the idea behind presenting the shampoo and dispenser together.]]' },
    { image: { src: null, alt: '', ratio: '16/9', note: 'The kit in a store, or the final kit in use' }, caption: '[[Final result.]]', size: 'wide' },
  ],
};
