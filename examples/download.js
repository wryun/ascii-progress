var ProgressBar = require('../index.js');

var contentLength = 128 * 1024;

var bar = new ProgressBar({
  schema: ' Downloading [:bar] :percent :etas',
  width : 80,
  total : contentLength
});

(function next() {

  if (contentLength) {

    var chunk = Math.round(Math.random() * 10 * 1024);

    bar.tick(chunk);

    if (!bar.completed) {
      setTimeout(next, Math.random() * 1000);
    }
  }

})();
