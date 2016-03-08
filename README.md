# node-progress-bars

> Render ascii progress bar(s) on the terminal.

## Install

```
$ npm install node-progress-bars
```

## Usage

```javascript
var ProgressBar = require('node-progress-bars');

var bar = new ProgressBar({ 
    schema: ':bar'
    total : 10 
});

var iv = setInterval(function () {

  bar.tick();

  if (bar.completed) {
    clearInterval(iv);
  }

}, 100);
```

### Options

These are keys in the options object you can pass to the progress bar along with
`total` as seen in the example above.

#### schema

Template string of the progress bar. 

Default `" [:bar] :current/:total :percent :elapseds :etas'"`.

#### total

Total number of ticks to complete. 

Default `100`.

#### current

The number of completed ticks. 

Default `0`.

- `width` The displayed width of the progress bar, if `width` is percentage or less than `1` the width is relative, otherwise it is absolute with. Default `options.total`.
- `completed` Completion character. Default `"▇"`.
- `blank` Blank character. Default `"-"`.
- `clear` Option to clear the bar on completion. Default `false`.
- `callback` Optional function to call when the progress bar completes.

### Properties



### Methods


## Schema

### Tokens

### Tokens

These are tokens you can use in the format of your progress bar.

- `:completed` Completed part of the progress bar.
- `:blank` Blank part of  the progress bar.
- `:bar` Whole progress bar, equal to `:completed:blank`.
- `:current` Current tick number.
- `:total` Total ticks.
- `:percent` Completion percentage.
- `:elapsed` Time elapsed in seconds.
- `:eta` Estimated completion time in seconds.

### Custom Tokens

You can define custom tokens by adding a `{name: value}` object parameter to your method (`tick()`, `update()`, etc.) calls.




## License

[MIT](https://github.com/bubkoo/ansi.js/blob/master/LICENSE) © bubkoo
