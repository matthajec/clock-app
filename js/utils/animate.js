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

    if (property === 'transform') {
      before = `${transform}(`;
      after = `${units})`;
    } else {
      before = '';
      after = units ? units : '';
    }

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

      // calculate the angle
      const value = Math[operation](operation === 'min' ? stepSize * elapsed : stepSize * (duration - elapsed), endValue);

      elements.forEach(element => {
        element.style[property] = before + value + after;
      });

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

    window.requestAnimationFrame(step);
  });
};
