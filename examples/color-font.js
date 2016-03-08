var ProgressBar = require('../index.js');

var bar = new ProgressBar({
  total: 100
});

var tokens = ':current.underline.magenta/:total.italic.green :percent.bold.yellow :elapseds.italic.blue :etas.italic.cyan';

var iv = setInterval(function () {

  var completedColor = '';
  var current        = bar.current;
  if (current < 20) {
    completedColor = 'red';
  } else if (current < 40) {
    completedColor = 'magenta';
  } else if (current < 60) {
    completedColor = 'yellow';
  } else if (current < 80) {
    completedColor = 'blue';
  } else if (current < 100) {
    completedColor = 'green';
  }

  var schema = ' [.white:completed.' + completedColor + ':blank.grey] .white' + tokens;

  bar.setSchema(schema);
  bar.tick();

  if (bar.completed) {
    clearInterval(iv);
  }

}, 30);
