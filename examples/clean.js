var ProgressBar = require('../index.js');

var bar = new ProgressBar({
  clean   : true,
  schema  : ' [:bar] \n:current/:total \n:percent \n:elapseds :etas',
  callback: function () {
    console.log(123);
  }
});


var iv = setInterval(function () {

  bar.tick();
  console.log(new Date);

  if (bar.completed) {
    clearInterval(iv);
    console.log('completed');
  }

}, 10);
