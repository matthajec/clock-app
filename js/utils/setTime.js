import now from './now';
import el from './el';

export default () => {
  const {
    hour,
    minute,
    timezone,
    timeOfDay,
    dayOfTheWeek,
    dayOfTheYear,
    weekOfTheYear
  } = now();

  // this to change the minute format from possibly being 1 digit (ie 6) to 2 digits ('06'), it only takes the last 2 characters after padding double digit dates are unnaffected
  const paddedMinuteStr = ('0' + minute.toString()).slice(-2);

  el('.clock_greeting').innerHTML = `<i class="fas fa-${timeOfDay === 'evening' ? 'moon' : 'sun'}"></i> Good ${timeOfDay}, it's currently`;
  el('.clock_time').textContent = `${hour > 12 ? hour - 12 : hour}:${paddedMinuteStr}`;
  el('.clock_timezone').textContent = timezone.abv;
};