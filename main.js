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
    phone: function (current) {
      $test.css('background', 'red')
        .text(current.charAt(0).toUpperCase() + current.slice(1));
    },
    tablet: function (current) {
      $test.css('background', 'green')
        .text(current.charAt(0).toUpperCase() + current.slice(1));
    },
    desktop: function (current) {
      $test.css('background', 'blue')
        .text(current.charAt(0).toUpperCase() + current.slice(1));
    }
  });
  
  notifier.set({
    phone: function () {
      $test.css({
        'width': '20%',
        'font-size': '14px'
      });
    },
    tablet: function () {
      $test.css({
        'width': '40%',
        'font-size': '28px'
      });
    },
    desktop: function () {
      $test.css('width', '80%');
    }
  });

}());