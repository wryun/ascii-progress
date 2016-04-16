var ProgressBar = require('../index.js');

var bar = new ProgressBar({
  schema: '╢:bar╟ :current/:total :percent :elapseds :etas',
  blank: '░',
  filled: '█'
});


var iv = setInterval(function () {

  bar.tick();

  if (bar.completed) {
    clearInterval(iv);
  }

}, 100);
