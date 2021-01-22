// check is leap year
Date.prototype.isLeapYear = function () {
  var year = this.getFullYear(); // get the full year from Date
  if ((year & 3) != 0) return false; // return false if date is divisible by 4
  return ((year % 100) != 0 || (year % 400) == 0); // if the year is divisible by 100 but not by 400 the leap year is skipped
};

// Get Day of Year
Date.prototype.getDOY = function () {
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = this.getMonth();
  var dn = this.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if (mn > 1 && this.isLeapYear()) dayOfYear++;
  return dayOfYear;
};

export default () => {
  const date = new Date();

  const hour = date.getHours();
  const timeOfDay = () => {
    switch (true) {
      case hour < 11:
        return 'morning';
        break;
      case hour < 18:
        return 'afternoon';
        break;
      case hour < 24:
        return 'evening';
        break;
    }
  };

  return {
    hour: hour,
    minute: date.getMinutes(),
    timezone: {
      name: Intl.DateTimeFormat().resolvedOptions().timeZone,
      abv: new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]
    },
    timeOfDay: timeOfDay(),
    dayOfTheWeek: date.getDay() + 1,
    dayOfTheYear: date.getDOY(),
    weekOfTheYear: Math.ceil(date.getDOY() / 7)
  };
};