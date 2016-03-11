/**
 * Accepts any node Stream instance and hijacks its `write()` function,
 * so that it can count any newlines that get written to the output.
 *
 * When a '\n' byte is encountered, then a "newline" event will be emitted
 * on the stream, with no arguments. It is up to the listeners to determine
 * any necessary deltas required for their use-case.
 */


function newlinesEvent(stream) {

  if (stream._newlinesEventInsalled) {
    // already emitting newline events
    return;
  }

  var write = stream.write;

  stream.write = function (data) {

    if (stream.listeners('newlines').length > 0) {

      var c = 0;
      var i = 0;
      var l = data.length;

      // now try to calculate any deltas

      if (typeof data === 'string') {
        for (; i < l; i++) {
          if (isNewline(data.charCodeAt(i))) {
            c += 1;
          }
        }
      } else {
        // buffer
        for (; i < l; i++) {
          if (isNewline(data[i])) {
            c += 1;
          }
        }
      }

      if (c) {
        stream.emit('newlines', c);
      }
    }

    return write.apply(stream, arguments);
  };

  stream._newlinesEventInsalled = true;
}


// exports
// -------

module.exports = newlinesEvent;


// helpers
// -------

var NEWLINE = '\n'.charCodeAt(0);

function isNewline(byte) {

  // processes an individual byte being written to a stream

  if (typeof byte !== 'number') {
    throw new Error('Invalid byte data for stream');
  }

  if (byte === NEWLINE) {
    return true;
  }
}
