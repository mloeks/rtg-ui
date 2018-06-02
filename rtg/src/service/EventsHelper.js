import { rectangle, viewportH } from 'verge';

// throttle event listeners using requestAnimationFrames
// Adopted from https://developer.mozilla.org/en-US/docs/Web/Events/resize
// Made an ES6 class from the code, made generic for arbitrary event, added remove method
export class ThrottledEventListener {
  constructor(event) {
    this.event = event;
    this.callbacks = [];
    this.running = false;

    this._runCallbacks = this._runCallbacks.bind(this);
    this._listener = this._listener.bind(this);
    this._addCallback = this._addCallback.bind(this);
  }

  _runCallbacks() {
    this.callbacks.forEach((callback) => { callback(); });
    this.running = false;
  }

  // fired on event
  _listener() {
    if (!this.running) {
      this.running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(this._runCallbacks);
      } else {
        setTimeout(this._runCallbacks, 66);
      }
    }
  }

  _addCallback(callback) {
    if (callback) {
      this.callbacks.push(callback);
    }
  }

  addCallback(callback) {
    if (!this.callbacks.length) {
      window.addEventListener(this.event, this._listener);
    }
    this._addCallback(callback);
  }

  removeAll() {
    window.removeEventListener(this.event, this._listener);
  }
}

// Adopted from https://developer.mozilla.org/en-US/docs/Web/Events/scroll
export class ThrottledScrollPositionListener {
  constructor() {
    this.callbacks = [];
    this.lastKnownScrollPosition = 0;
    this.ticking = false;

    this._runCallbacks = this._runCallbacks.bind(this);
    this._listener = this._listener.bind(this);
    this._addCallback = this._addCallback.bind(this);
  }

  _runCallbacks() {
    this.callbacks.forEach((callback) => { callback(this.lastKnownScrollPosition); });
    this.ticking = false;
  }

  _listener() {
    // Note that IE does not support scrollY
    this.lastKnownScrollPosition =
      typeof window.scrollY === 'undefined' ? window.pageYOffset : window.scrollY;

    if (!this.ticking) {
      window.requestAnimationFrame(this._runCallbacks);
      this.ticking = true;
    }
  }

  _addCallback(callback) {
    if (callback) {
      this.callbacks.push(callback);
    }
  }

  addCallback(callback) {
    if (!this.callbacks.length) {
      window.addEventListener('scroll', this._listener);
    }
    this._addCallback(callback);
  }

  removeAll() {
    window.removeEventListener('scroll', this._listener);
  }
}

export const globalThrottledScrollListener = new ThrottledScrollPositionListener();

export const hasScrolledBehind = elem => rectangle(elem).bottom < viewportH();

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// Source: https://davidwalsh.name/javascript-debounce-function
/* eslint-disable */
export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
/* eslint-enable */

// Taken from underscore.js: http://underscorejs.org/docs/underscore.html
/* eslint-disable */
export function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : new Date();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = new Date();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}
/* eslint-enable */
