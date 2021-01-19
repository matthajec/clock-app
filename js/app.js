import el from './utils/el';
import animate from './utils/animate';
import changeQuote from './utils/setQuote';
import setTime from './utils/setTime';
import setQuote from './utils/setQuote';

setQuote();
setTime();

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

  setQuote();
});

el('.info-toggle_input').addEventListener('change', (e) => {
  if (e.target.checked) {
    el('main').classList.add('open');
  } else {
    el('main').classList.remove('open');
  }
});

const changeQuoteInterval = setInterval(() => {
  setQuote();
}, 180000);

const setTimeInterval = setInterval(() => {
  setTime();
}, 1000);