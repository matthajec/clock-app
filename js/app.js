import el from './utils/el';
import animate from './utils/animate';
import changeQuote from './utils/changeQuote';

changeQuote();

el('.quote_new-btn').addEventListener('click', () => {
  animate({
    elements: [el('.quote_new-btn')],
    duration: 500,
    property: 'transform',
    transform: 'rotate',
    startValue: 0,
    endValue: 360,
    units: 'deg'
  });

  changeQuote();
});
