var ansi   = require('ansi.js');
var getpos = require('get-cursor-position');

var placeholder = '\uFFFC';
var instances   = [];


function ProgressBar(options) {

  options = options || {};

  this.cursor  = ansi(process.stdout);
  this.total   = options.total || 100;
  this.current = options.current || 0;
  this.width   = options.width || this.total;

  if (typeof this.width === 'string') {
    if (endWith(this.width, '%')) {
      this.width = parseFloat(this.width) / 100 % 1;
    } else {
      this.width = parseFloat(this.width);
    }
  }

  this.clean = !!options.clean;
  this.chars = {
    completed: options.completed || '▇',
    blank    : options.blank || '—'
  };

  this.completed = false;

  // callback on completed
  this.callback = options.callback;

  this.setSchema(options.schema);

  instances.push(this);
}


// exports
// -------

module.exports = ProgressBar;


// proto
// -----

ProgressBar.prototype.setSchema = function (schema, refresh) {
  this.schema = schema || ' [:bar] :current/:total :percent :elapseds :etas';

  if (refresh) {
    this.refresh(refresh);
  }
};

ProgressBar.prototype.tick = function (delta, tokens) {

  if (this.completed) {
    return;
  }

  if (delta !== 0) {
    delta = delta || 1;
  }

  // swap tokens
  if (typeof delta === 'object') {
    tokens = delta;
    delta  = 1;
  }

  if (!this.start) {
    this.start = new Date;
  }

  this.current += delta;
  this.refresh(tokens);

  if (this.current >= this.total) {
    this.terminate();
  }
};

ProgressBar.prototype.update = function (ratio, tokens) {

  var completed = Math.floor(ratio * this.total);
  var delta     = completed - this.current;

  this.tick(delta, tokens);
};

ProgressBar.prototype.refresh = function (tokens) {

  var ratio = this.current / this.total;

  ratio = Math.min(Math.max(ratio, 0), 1);

  var schema  = this.schema;
  var chars   = this.chars;
  var percent = ratio * 100;
  var elapsed = new Date - this.start;
  var eta     = percent === 100 ? 0 : elapsed * (this.total / this.current - 1);
  var output  = schema
    .replace(/:current/g, this.current)
    .replace(/:total/g, this.total)
    .replace(/:elapsed/g, formatTime(elapsed))
    .replace(/:eta/g, formatTime(eta))
    .replace(/:percent/g, toFixed(percent, 0) + '%');

  if (tokens && typeof tokens === 'object') {
    for (var key in tokens) {
      if (tokens.hasOwnProperty(key)) {
        output = output.replace(new RegExp(':' + key, 'g'), ('' + tokens[key]) || placeholder);
      }
    }
  }

  var raw = output
    .replace(/\.(bgR|r)ed/g, '')
    .replace(/\.(bgB|b)lue/g, '')
    .replace(/\.(bgC|c)yan/g, '')
    .replace(/\.(bgG|g)rey/g, '')
    .replace(/\.(bgW|w)hite/g, '')
    .replace(/\.(bgB|b)lack/g, '')
    .replace(/\.(bgG|g)reen/g, '')
    .replace(/\.(bgY|y)ellow/g, '')
    .replace(/\.(bgM|m)agenta/g, '')
    // bright
    .replace(/\.(bgB|b)right(Black|Red|Green|Yellow|Blue|Magenta|Cyan|White)/g, '')
    // font style
    .replace(/\.bold|italic|underline|inverse/g, '')
    // gradient
    .replace(/\.gradient\((.+),(.+)\)/g, '');

  var width   = this.width;
  var columns = process.stdout.columns;

  width = width < 1 ? columns * width : width;
  width = Math.min(width, Math.max(0, columns - raw.length));

  var length    = Math.round(width * ratio);
  var blank     = repeatChar(width - length + 1, chars.blank);
  var completed = repeatChar(length + 1, chars.completed);

  output = output
    .replace(/:completed/g, completed || placeholder)
    .replace(/:blank/g, blank || placeholder)
    .replace(/:bar/g, (completed + blank) || placeholder);

  this.raw = raw
    .replace(/:completed/g, completed)
    .replace(/:blank/g, blank)
    .replace(/:bar/g, completed + blank);

  this.render(output);
};

ProgressBar.prototype.render = function (output) {

  if (this.output !== output) {

    var repaint = !!this.origin;
    var current = getpos.sync();

    if (!repaint) {
      this.origin = current;
    }

    this.clear();

    var originRow = this.origin.row;
    var originCol = this.origin.col;
    var totalRows = process.stdout.rows;
    var rowCount  = this.raw.split('\n').length;

    if (originRow === totalRows) {
      this.cursor.write(repeatChar(rowCount, '\n'));
      instances.forEach(function (instance) {
        if (instance.origin) {
          instance.origin.row -= rowCount;
        }
      });
      originRow -= rowCount - 1;
    }

    this.cursor.moveTo(originRow, originCol);
    //this.cursor.write(output);
    this.colorize(output);

    // move the cursor to the current position.
    if (repaint) {
      this.cursor.moveTo(current.row, current.col);
    }

    this.output = output;
  }
};

ProgressBar.prototype.colorize = function (output) {

  var cursor  = this.cursor;
  var parts   = output.split(/(\.[A-Za-z]+)/g);
  var content = '';
  var matches = [];

  function write() {

    //console.log(content)
    //console.log(matches)

    var hasFg    = false;
    var hasBg    = false;
    var gradient = null;

    matches.forEach(function (match) {

      if (match.method === 'gradient') {
        gradient = match;
        return;
      }

      var host = match.isBg
        ? cursor.bg : match.isFont
        ? cursor.font
        : cursor.fg;

      if (match.isBg) {
        hasBg = true;
      } else {
        hasFg = true;
      }

      host[match.method]();
    });

    content = content.replace(new RegExp(placeholder, 'g'), '');

    if (content) {

      if (gradient) {

        var color1 = gradient.color1;
        var color2 = gradient.color2;

        for (var i = 0, l = content.length; i < l; i++) {

          var color = i === 0
            ? color1 : i === l - 1
            ? color2
            : interpolate(color1, color2, (i + 1) / l);

          cursor.fg.rgb(color.r, color.g, color.b);
          cursor.write(content[i]);
          cursor.fg.reset();
        }
      } else {
        cursor.write(content);
      }
    }

    // reset font style
    matches.forEach(function (match) {
      if (match.isFont) {
        cursor.font['reset' + ucFirst(match.method)]();
      }
    });

    // reset foreground
    if (hasFg) {
      cursor.fg.reset();
    }

    // reset background
    if (hasBg) {
      cursor.bg.reset();
    }

    matches = [];
    content = '';
  }

  for (var i = 0, l = parts.length; i < l; i++) {

    var part  = parts[i];
    var match = null;

    if (!part) {
      continue;
    }

    if (startWith(part, '.')) {

      if (part === '.gradient') {
        if (parts[i + 1]) {
          match = parseGradient(parts[i + 1]);

          parts[i + 1] = parts[i + 1].replace(/^\((.+),(.+)\)/, '');
        }
      } else {
        match = parseMethod(cursor, part);
      }
    }

    if (match) {
      if (match.suffix) {
        if (i < l - 1) {
          parts[i + 1] += match.suffix;
        } else {
          // the last one
          cursor.write(match.suffix);
        }
      }

      matches.push(match);
    } else {

      if (matches.length) {
        write();
      }

      content += part;
    }
  }

  write();

  cursor.write('\n');
};

ProgressBar.prototype.clear = function () {

  if (this.output) {
    this.cursor.moveTo(this.origin.row, this.origin.col);

    var lines = this.raw.split('\n');
    for (var i = 0, l = lines.length; i < l; i++) {
      this.cursor
        .eraseLine()
        .moveDown();
    }
    this.cursor.moveTo(this.origin.row, this.origin.col);
  }
};

ProgressBar.prototype.terminate = function () {

  this.completed = true;

  var currentPosition = getpos.sync();

  if (this.clean) {

    this.clear();

    var lines = this.raw.split('\n');
    for (var i = 0, l = lines.length; i < l; i++) {
      this.cursor
        .deleteLine()
        .moveDown();
    }
  }

  this.cursor.moveTo(this.origin.row, this.origin.col);

  this.callback && this.callback(this);
  this.cursor.moveTo(currentPosition.row, currentPosition.col);
};


// helpers
// -------

function toFixed(value, precision) {

  var power = Math.pow(10, precision);

  return (Math.round(value * power) / power).toFixed(precision);
}

function formatTime(ms) {
  return isNaN(ms) || !isFinite(ms)
    ? '0.0'
    : toFixed(ms / 1000, 1);
}

function startWith(str, prefix) {
  return ('' + str).indexOf(prefix) === 0;
}

function endWith(str, suffix) {

  str = '' + str;

  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function lcFirst(str) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

function repeatChar(len, char) {
  return new Array(len).join(char);
}

function parseMethod(cursor, str) {

  str = str.substr(1);

  return parseColor(cursor, str)
    || parseFont(cursor, str)
    || parseGradient(str);
}

function parseColor(cursor, str) {

  var match = str.match(/^(bgR|r)ed/)
    || str.match(/^(bgB|b)lue/)
    || str.match(/^(bgC|c)yan/)
    || str.match(/^(bgG|g)rey/)
    || str.match(/^(bgW|w)hite/)
    || str.match(/^(bgB|b)lack/)
    || str.match(/^(bgG|g)reen/)
    || str.match(/^(bgY|y)ellow/)
    || str.match(/^(bgM|m)agenta/)
    || str.match(/^(bgB|b)right(Black|Red|Green|Yellow|Blue|Magenta|Cyan|White)/);

  if (match) {

    var method = match[0];
    var suffix = str.substr(method.length);
    var isBg   = startWith(method, 'bg');

    if (isBg) {
      method = lcFirst(method.substr(2));
    }

    if (typeof cursor[method] === 'function') {
      return {
        isBg  : isBg,
        method: method,
        suffix: suffix
      };
    }
  }
}

function parseFont(cursor, str) {

  var match = str.match(/^bold|italic|underline|inverse/);
  if (match) {

    var method = match[0];
    var suffix = str.substr(method.length);

    if (typeof cursor[method] === 'function') {
      return {
        isFont: true,
        method: method,
        suffix: suffix
      };
    }
  }
}

function parseGradient(str) {

  var match = str.match(/^\((.+),(.+)\)/);
  if (match) {

    var color1 = match[1].trim();
    var color2 = match[2].trim();

    color1 = startWith(color1, '#') ? hex2rgb(color1) : name2rgb(color1);
    color2 = startWith(color2, '#') ? hex2rgb(color2) : name2rgb(color2);

    if (color1 && color2) {
      return {
        method: 'gradient',
        color1: color1,
        color2: color2
      };
    }
  }
}

function interpolate(color1, color2, percent) {

  function makeChannel(a, b) {
    return a + Math.round((b - a) * percent);
  }

  return {
    r: makeChannel(color1.r, color2.r),
    g: makeChannel(color1.g, color2.g),
    b: makeChannel(color1.b, color2.b)
  };
}

function hex2rgb(color) {

  var c = color.substring(1);
  var r = c.substring(0, 2);
  var g = c.substring(2, 4);
  var b = c.substring(4, 6);

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16)
  };
}

function name2rgb(name) {
  var hex = {
    red    : '#ff0000',
    blue   : '#0000ff',
    cyan   : '#00ffff',
    grey   : '#808080',
    white  : '#ffffff',
    black  : '#000000',
    green  : '#008000',
    yellow : '#ffff00',
    magenta: '#ff00ff'
  }[name];

  return hex ? hex2rgb(hex) : null;
}
