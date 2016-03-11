var ProgressBar = require('../index.js');

var bar0 = new ProgressBar({
  schema : ' Bar-0: [:bar]',
  current: 0
});

var bar1 = new ProgressBar({
  schema : ' Bar-1: [:bar]',
  current: 10
});

var bar2 = new ProgressBar({
  schema : ' Bar-2: [:bar]',
  current: 20,
  tough  : true
});

var bar3 = new ProgressBar({
  schema : ' Bar-3: [:bar]',
  current: 30

});

var bar4 = new ProgressBar({
  schema : ' Bar-4: [:bar]',
  current: 40
});

var bar5 = new ProgressBar({
  schema : ' Bar-5: [:bar]',
  current: 50,
  tough  : true
});

var timer = setInterval(function () {

  bar0.tick();
  bar1.tick();
  bar2.tick();
  bar3.tick();
  bar4.tick();
  bar5.tick();
  console.log(new Date);
  if (bar0.completed
    && bar1.completed
    && bar2.completed
    && bar3.completed
    && bar4.completed
    && bar5.completed) {
    clearInterval(timer);

    setInterval(function () {
      console.log(new Date);
    }, 100);

  }

}, 100);
