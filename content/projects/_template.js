// Copy this file to create a new project. Files starting with "_" are ignored.
//
// Images: put files in /public/images/<slug>/ and set `src: 'images/<slug>/file.jpg'`.
// While `src` is null a grey placeholder is shown, using `note` to describe
// the photo that should go there.
//
// `story` is the case study, top to bottom. Each item is one of:
//   { image: {...}, caption, size: 'full' | 'wide' | 'inset' }
//   { pair: [{ ...image, caption }, { ...image, caption }] }
//   { text: 'One or two sentences.' }

export default {
  slug: 'project-slug', // URL: /work/project-slug/
  order: 99, // position on the homepage
  title: 'Concept title',
  what: 'What it is, in a few words',
  context: 'Where it was made',
  kind: 'Professional', // or 'Academic'
  year: '[[year]]',
  categories: ['packaging'], // from content/site.js → categories
  line: 'One line about what the design does for the product.',
  notice: null, // always-visible note, e.g. an affiliation disclaimer
  approval: null, // draft-only reminder about permissions
  facts: [['My part', '...']],
  cover: { src: null, alt: '', note: 'Cover image' },
  story: [],
};
