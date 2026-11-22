export default {
  slug: 'paper-weight',
  order: 6,
  title: 'Paper Weight',
  what: 'Printed communication',
  context: 'Fedrigoni Self-Adhesives',
  kind: 'Professional',
  year: '[[years]]',
  categories: ['communications'],
  line: 'Flyers where the paper and the finish are part of the message.',
  notice: null,
  approval: 'Confirm which pieces are originals. Anything recreated must say "Reconstructed" in its caption.',
  facts: [
    ['My part', 'Design of flyers and printed pieces [[confirm which]]'],
    ['Papers & finishes', '[[papers, textures, finishes]]'],
  ],
  // TEST IMAGE ONLY: generated paper swatches to try the colour-on-hover effect. Replace with real photos.
  cover: { src: 'images/sample/paper-swatches.jpg', sample: true, alt: 'Sample image: coloured paper sheets (test, not real work)', note: 'Printed pieces in raking light, texture visible' },
  story: [
    {
      pair: [
        { src: null, alt: '', ratio: '3/4', note: 'Flyer, front', caption: '[[Piece]] · [[Original / Reconstructed]]' },
        { src: null, alt: '', ratio: '3/4', note: 'Flyer, back or second piece', caption: '[[Piece]] · [[Original / Reconstructed]]' },
      ],
    },
    { image: { src: null, alt: '', ratio: '16/9', note: 'Macro of a finish: texture, foil, varnish or emboss' }, caption: '[[Paper and finish used.]]', size: 'wide' },
    { text: '[[Optional: one sentence on what the paper choice added.]]' },
  ],
};
