export default (options) => {
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
