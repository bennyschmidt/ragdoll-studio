const slugify = (phrase = '') => (
  phrase.trim().replace(/ /g, '-').toLowerCase()
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
