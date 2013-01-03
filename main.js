/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global  */

(function () {
  'use strict';

  var notifier,
    $test = $('.test');

  notifier = new window.Notifier({
    phone: {max: 480},
    tablet: {min: 481, max: 800},
    desktop: {min: 801}
  });

  notifier.set({
    phone: function () {
      $test.css('background', 'red');
    },
    tablet: function () {
      $test.css('background', 'green');
    },
    desktop: function () {
      $test.css('background', 'blue');
    }
  });
  
  notifier.set({
    phone: function () {
      $test.css('width', '10%');
    },
    tablet: function () {
      $test.css('width', '40%');
    },
    desktop: function () {
      $test.css('width', '80%');
    }
  });

}());