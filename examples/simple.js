var ProgressBar = require('../index.js');

var bar = new ProgressBar();


var iv = setInterval(function () {

  bar.tick();

  if (bar.completed) {
    clearInterval(iv);
  }

}, 100);
