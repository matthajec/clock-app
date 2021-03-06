(function () {
  'use strict';

  var el = (e) => document.querySelector(e);

  var animate = (options) => {
    return new Promise((resolve, reject) => {
      let before;
      let after;
      let startTime;
      let stepSize;
      let operation;

      const {
        elements, // DOM node to perform the animation on
        duration, // how long the animation should last
        property, // css property you want to change (opacity, height, width, etc.)
        startValue,
        endValue,
        units, // units (px, rem, %, etc.)
        transform, //when doing a transform specify what operation you are doing (rotate, translate, etc.)
        condition // executes on every change passing an object with keys 'elapsed' being the amount of time in ms the animation has been running for, and 'value' being the current value of the css property
      } = options;

      // if the property is transform prepare a before and after string for the transform property chosen
      if (property === 'transform') {
        before = `${transform}(`;
        after = `${units})`;
      } else {
        before = '';
        after = units;
      }

      // calculate the step size(amount to change each ms) based on whether the the value increases or decreases during the animation
      if (startValue - endValue < 0) {
        stepSize = (endValue - startValue) / duration;
        operation = 'min';
      } else {
        stepSize = (startValue - endValue) / duration;
        operation = 'max';
      }

      function step(timestamp) {
        // only set the start time if there is no start time (will only run once)
        if (startTime === undefined) startTime = timestamp;

        const elapsed = timestamp - startTime;

        // calculate the angle using the elapsed time since the animation started
        const value = Math[operation](operation === 'min' ? stepSize * elapsed : stepSize * (duration - elapsed), endValue);

        // set the value for the selected property for every element that was passed in
        elements.forEach(element => {
          element.style[property] = before + value + after;
        });

        // if the user chose to pass a condition (a function which gets a snapshot of the animation status) then run it
        if (condition) condition({
          value: value,
          elapsed: elapsed
        });

        if (elapsed < duration) {
          // call this again if the animation isn't done
          window.requestAnimationFrame(step);
        } else {
          // reset the transform property once the animation completes and resolve the promise
          resolve(true);
        }
      }

      // trigger the start of the animation
      window.requestAnimationFrame(step);
    });
  };

  let quotes;

  // fetches and stores api data in quotes if it's not already saved, and then returns a random quote
  var getRandomQuote = async () => {
    if (!quotes) {
      const res = await fetch("https://type.fit/api/quotes");
      const data = await res.json();
      quotes = data;
    }

    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  var setQuote = () => {
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
      .then(({ text, author }) => {
        el('.quote_content').textContent = `"${text}"`;
        el('.quote_author').textContent = author ? author : 'Author Unknown';
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

  var now = () => {
    const date = new Date();

    const hour = date.getHours();
    const timeOfDay = () => {
      switch (true) {
        case hour < 5:
          return 'night';
        case hour < 11:
          return 'morning';
        case hour < 18:
          return 'afternoon';
        default:
          return 'evening';
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

  var setTime = () => {
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
    el('.info-group_content[data-type="timezone"]').textContent = timezone.name.split('_').join(' ').split('/').join(' / '); // destroy underscores and create spaces, pad "/" with spaces so that it will be split into new lines on small viewports
    el('.info-group_content[data-type="dotw"]').textContent = dayOfTheWeek;
    el('.info-group_content[data-type="doty"]').textContent = dayOfTheYear;
    el('.info-group_content[data-type="woty"]').textContent = weekOfTheYear;

    if (timeOfDay === 'evening' || timeOfDay === 'night') el('body').classList.add('night');
  };

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
      el('body').classList.add('open');
    } else {
      el('body').classList.remove('open');
    }
  });

  setInterval(() => {
    setQuote();
  }, 180000);

  setInterval(() => {
    setTime();
  }, 1000);

}());
//# sourceMappingURL=bundle.js.map
