var ProgressBar = require('../index.js');

console.log();
console.log();
console.log();
console.log();
console.log();

var tokens = ':current.underline.magenta/:total.italic.green :percent.bold.yellow :elapseds.italic.blue :etas.italic.cyan';

var bar0 = new ProgressBar({
  schema : '    [:bar] :current/:total :percent :elapseds :etas',
  width  : 70,
  current: 0
});

var bar1 = new ProgressBar({
  schema : '    [:bar] :current/:total :percent :elapseds :etas',
  width  : 70,
  current: 10
});

var bar2 = new ProgressBar({
  schema : '    [.white:completed.brightGreen:blank.brightYellow].white :current.red/:total.grey :percent.green :elapseds :etas',
  width  : 70,
  current: 20
});

var bar3 = new ProgressBar({
  schema : '    [:bar] :current/:total :percent :elapseds :etas',
  width  : 70,
  current: 30
});

var bar4 = new ProgressBar({
  schema : '    [:bar] :current/:total :percent :elapseds :etas',
  width  : 70,
  current: 40
});

var bar5 = new ProgressBar({
  schema : '    [.white:completed.gradient(red,magenta):blank] :current/:total :percent :elapseds :etas',
  width  : 70,
  current: 50
});


var index = 0;
var steps = [0.1, 0.15, 0.2, 0.25,
  0.1,
  0.3, 0.35, 0.4, 0.45,
  0.2,
  0.5, 0.55, 0.6, 0.65,
  0.3,
  0.3, 0.35, 0.4, 0.45,
  0.4,
  0.7, 0.75, 0.8, 0.85,
  0.4,
  0.9, 0.95, 0.8, 0.85,
  0.7,
  0.8, 1.0];

var backward = false;
var forward  = false;

var timer = setInterval(function () {

  var color   = '';
  var current = bar4.current;

  if (current < 60) {
    color = 'red';
  } else if (current < 70) {
    color = 'magenta';
  } else if (current < 80) {
    color = 'yellow';
  } else if (current < 90) {
    color = 'blue';
  } else if (current < 100) {
    color = 'green';
  }

  var schema = '    [.white:completed.' + color + ':blank.grey] .white' + tokens;

  bar4.setSchema(schema);

  bar0.tick();

  //bar1.tick();

  if (index >= steps.length) {
  } else {
    bar1.update(steps[index++]);
  }


  bar2.tick();

  if (!forward) {
    bar3.tick();
    if (bar3.current >= 50) {
      forward = true;
    }
  } else if (!backward) {
    bar3.tick(-1);
    if (bar3.current <= 10) {
      backward = true;
    }
  } else {
    bar3.tick();
  }


  bar4.tick();
  bar5.tick();

  if (bar0.completed
    && bar1.completed
    && bar2.completed
    && bar3.completed
    && bar4.completed
    && bar5.completed) {
    clearInterval(timer);
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
  }

}, 50);


console.log();
console.log();
console.log();
console.log();
console.log();
