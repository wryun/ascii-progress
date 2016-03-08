var ProgressBar = require('../index.js');

var bar = new ProgressBar({
  clean   : true,
  callback: function () {
    console.log(123);
  }
});


var iv = setInterval(function () {

  bar.tick();

  if (bar.completed) {
    clearInterval(iv);
  }

}, 10);
