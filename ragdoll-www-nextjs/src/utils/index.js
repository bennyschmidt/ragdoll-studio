const slugify = (phrase = '') => (
  phrase
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\-*|\-*$/, '')
);

const getStarRating = (rating, maxStars = 5) => (
  new Array(maxStars)
    .fill('')
    .map((_, index) => rating > index ? '★' : '☆')
);

export {
  slugify,
  getStarRating
};
