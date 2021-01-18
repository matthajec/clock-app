import animate from './animate';
import el from './el';
import getRandomQuote from './getRandomQuote';

export default () => {
  animate({
    elements: [el('.quote_content'), el('.quote_author')],
    duration: 250,
    property: 'opacity',
    transform: '',
    startValue: 1,
    endValue: 0,
    units: ''
  })
    .then(() => {
      return getRandomQuote();
    })
    .then(quote => {
      el('.quote_content').textContent = quote.text;
      el('.quote_author').textContent = quote.author;
      return animate({
        elements: [el('.quote_content'), el('.quote_author')],
        duration: 250,
        property: 'opacity',
        transform: '',
        startValue: 0,
        endValue: 1,
        units: ''
      });
    });
};