var notifier = new Notifier({
  desktop: {min: 1}
});

var context,
  args;

notifier.set({
  desktop: function () {
    context = this;
    args = arguments;
  }
});

module('Public API.');

test('Able to get the last breakpoint.', function () {
  expect(1);
  
  ok(notifier.getLastBreakpoint(), 'The reported breakpoint was: ' + notifier.getLastBreakpoint());
});

test('Able to get the current breakpoint.', function () {
  expect(1);
  
  ok(notifier.getCurrentBreakpoint(), 'The reported breakpoint was: ' + notifier.getCurrentBreakpoint());
});

test('Callbacks fire in the context of the Notifier prototype.', function () {
  expect(1);
  
  equal(context, Notifier.prototype);
});