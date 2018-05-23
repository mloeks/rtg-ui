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
    this.secondToLastKnownScrollPosition = 0;
    this.lastKnownScrollPosition = 0;
    this.ticking = false;

    this._runCallbacks = this._runCallbacks.bind(this);
    this._listener = this._listener.bind(this);
    this._addCallback = this._addCallback.bind(this);
  }

  _runCallbacks() {
    this.callbacks.forEach((callback) => {
      callback(
        this.lastKnownScrollPosition,
        this.lastKnownScrollPosition - this.secondToLastKnownScrollPosition,
      );
    });
    this.ticking = false;
  }

  _listener() {
    // Note that IE does not support scrollY
    this.secondToLastKnownScrollPosition = this.lastKnownScrollPosition;
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

export const hasScrolledBehind = elem => rectangle(elem).bottom < viewportH();
