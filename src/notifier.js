/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global require, define */

(function ($) {
  'use strict';

  var $window = $(window),
    $body = $('body'),
    NotifierClass,
    methods,
    callbacks,
    state;

  /**
   * Notifier constructor.
   *
   * breakpoints  - Object of breakpoints to check against.
   * 
   * Examples
   *  
   *   var notifier = new Notifier({
   *     phone: {max: 480},
   *     tablet: {min: 481, max: 800},
   *     desktop: {min: 801}
   *   });
   */
  NotifierClass = function (breakpoints) {
    // Don't bother continuing if this browser doesn't
    // support the matchMedia API.
    if (!state.matchMedia) {
      return false;
    }

    // Save off the raw breakpoints.
    state.rawBreakpoints = breakpoints;

    // Build breakpoint strings to feed to matchMedia.
    methods.buildBreakpointStrings();

    // Resize listener.
    $window.on('resize', function () {
      methods.checkBreakpoint();
    }).trigger('resize');
  };

  // Private: Internal list of available callbacks.
  callbacks = {};

  // Private: Current notifier state.
  state = {
    matchMedia: (window.matchMedia || window.msMatchMedia) || false,
    breakpointStrings: {},
    lastBreakpoint: '',
    currentBreakpoint: ''
  };

  /**
   * Private API.
   */
  methods = {
    /**
     * Private: Convert the breakpoint object into strings that matchMedia
     * can work with.
     *
     * This won't check for if you have overlapping breakpoints, yet.
     * Overlapping breakpoints don't currently work at all.
     *
     * Returns this.
     */
    buildBreakpointStrings: function () {
      var name, string, breakpoint;

      for (name in state.rawBreakpoints) {
        if (state.rawBreakpoints.hasOwnProperty(name)) {
          string = 'only screen';
          breakpoint = state.rawBreakpoints[name];

          // Add an entry to the callback list.
          callbacks[name] = [];

          if (breakpoint.max) {
            string += ' and (max-width: ' + breakpoint.max + 'px)';
          }

          if (breakpoint.min) {
            string += ' and (min-width: ' + breakpoint.min + 'px)';
          }

          state.breakpointStrings[name] = string;
        }
      }

      return this;
    },

    /**
     * Private: Check the breakpoint strings.
     *
     * Returns false when a breakpoint is found, otherwise returns this.
     */
    checkBreakpoint: function () {
      var name, string;

      // Loop over strings. Stop when one is found.
      for (name in state.breakpointStrings) {
        if (state.breakpointStrings.hasOwnProperty(name)) {
          string = state.breakpointStrings[name];
          if (this.testQuery(string) && name !== state.currentBreakpoint) {
            this.setCurrentBreakpoint(name);
            return false;
          }
        }
      }

      return this;
    },

    /**
     * Private: Test a media query string against matchMedia.
     * 
     * string - String to test.
     * 
     * Returns true if the string matches, false if it doesn't.
     */
    testQuery: function (string) {
      return state.matchMedia.call(window, string).matches;
    },

    /**
     * Private: Set the current breakpoint name, and trigger
     * an event on the body.
     *
     * breakpoint - Breakpoint name to set.
     *
     * Returns this.
     */
    setCurrentBreakpoint: function (breakpoint) {
      state.lastBreakpoint = state.currentBreakpoint || breakpoint;
      state.currentBreakpoint = breakpoint;
      $body.trigger('breakpoint', breakpoint);
      NotifierClass.prototype.fire(breakpoint);
      return this;
    },

    /**
     * Public: Set up a callback list for breakpoints.
     *
     * breakpoint - Breakpoint to set a callback function for.
     * fn         - Callback function to run when a breakpoint is hit.
     *
     * Returns this.
     */
    setCallback: function (breakpoint, fn) {
      if (!callbacks[breakpoint] || typeof fn !== 'function') {
        return false;
      }

      // Add a fired flag to make sure we don't fire callbacks within the same
      // breakpoint more than once. This allows multiple calls to the
      // setCallback method, which in turn calls the public fire method.
      fn.fired = false;

      // Add the callback.
      callbacks[breakpoint].push(fn);

      return this;
    },

    /**
     * Fire a single callback.
     *
     * callback - Callback to fire.
     *
     * Returns this.
     */
    fireCallback: function (callback) {
      // Reset the fired state of the callback if the breakpoint has changed.
      if (state.currentBreakpoint !== state.lastBreakpoint) {
        callback.fired = false;
      }

      // Don't fire callbacks twice in the same breakpoint.
      if (callback.fired) {
        return false;
      }

      callback.call(callback, state.currentBreakpoint, state.lastBreakpoint);
      callback.fired = true;

      return this;
    }
  };

  /**
   * Public API.
   */
  NotifierClass.prototype = {
    /**
     * Public: Get the last breakpoint.
     *
     * Returns the last breakpoint that was set.
     */
    getLastBreakpoint: function () {
      return state.lastBreakpoint;
    },

    /**
     * Public: Get the current breakpoint.
     *
     * Returns the current set breakpoint.
     */
    getCurrentBreakpoint: function () {
      return state.currentBreakpoint;
    },

    /**
     * Public: Set multiple callbacks.
     *
     * callbackList - Object of callbacks to set.
     *
     * Returns this.
     */
    set: function (callbackList) {
      var callback;

      for (callback in callbackList) {
        if (callbackList.hasOwnProperty(callback)) {
          methods.setCallback(callback, callbackList[callback]);
        }
      }

      this.fire();

      return this;
    },

    /**
     * Public: Fire the callbacks for the passed in breakpoint.
     *
     * breakpoint - Breakpoint to fire callbacks for. Defaults to the
     *              current breakpoint. The callback is fired in the context
     *              of the window, with two arguments, the current breakpoint,
     *              and the previous breakpoint.
     *
     * Returns this.
     */
    fire: function (breakpoint) {
      var i;

      // If there's no breakpoint, fire the callbacks for
      // the current breakpoint.
      if (!breakpoint) {
        breakpoint = state.currentBreakpoint;
      }

      // It's possible that this breakpoint never had any callbacks
      // set in the first place.
      // Don't attempt to fire callbacks if there aren't any.
      if (!callbacks[breakpoint]) {
        return false;
      }

      for (i = 0; i < callbacks[breakpoint].length; i++) {
        methods.fireCallback(callbacks[breakpoint][i]);
      }

      return this;
    }
  };

  if (window.define) {
    define([], function () {
      return NotifierClass;
    });
  } else {
    window.Notifier = NotifierClass;
  }
}(window.jQuery));