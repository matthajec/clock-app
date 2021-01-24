// check if leap year
Date.prototype.isLeapYear = function () {
  var year = this.getFullYear();
  if ((year & 3) != 0) return false; // return false if date is not divisible by 4 (making it a leap year)
  return ((year % 100) != 0 || (year % 400) == 0); // if the year is divisible by 100 but not by 400 the leap year is skipped
};

// Get Day of Year
Date.prototype.getDOY = function () {
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]; // offset for each month (index 0 is added to the day during january, 11 is december)
  var mn = this.getMonth();
  var dn = this.getDate();
  var dayOfYear = dayCount[mn] + dn; // take the day number in the current month and add it it to the total number of days from the previous months
  if (mn > 1 && this.isLeapYear()) dayOfYear++; // account for jan 29 on leap years
  return dayOfYear;
};

Date.prototype.getWeek = function () {
  var startDOTW = new Date(this.getFullYear(), 0, 1).getDay(); // get the index of the day of the week on jan 1st of this year
  return Math.ceil((this.getDOY() + startDOTW) / 7);
};


// this wont be in the bundle it's test code to copy into dev tools
const testDate = function (y, m, d) {
  var today = new Date(y, m, d);
  var startDOTW = new Date(2021, 0, 1).getDay();
  return Math.ceil((today.getDOY() + startDOTW) / 7);
};

export default () => {
  const date = new Date();

  const hour = date.getHours();
  const timeOfDay = () => {
    switch (true) {
      case hour < 5:
        return 'night';
        break;
      case hour < 11:
        return 'morning';
        break;
      case hour < 18:
        return 'afternoon';
        break;
      default:
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
    weekOfTheYear: date.getWeek()
  };
};