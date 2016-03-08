# node-progress-bars

> Render ascii progress bar(s) on the terminal.

![snapshot](https://raw.githubusercontent.com/bubkoo/node-progress-bars/master/snapshot.gif)

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

#### width
 
The displayed width of the progress bar, if `width` is percentage or less 
than `1` the width is relative, otherwise it is absolute with. 

Default `options.total`.


#### completed 

Completion character. 

Default `"▇"`.

#### blank 

Blank character. 

Default `"-"`.

#### clear 

Option to clear the progress bar on completion. 

Default `false`.

#### callback 

Optional function to call when the progress bar completes.


### Properties
 
 - `schema`
 - `total`
 - `current`
 - `completed`

### Methods

 - `tick(delta, tokens)` Update ticks of the progress bar by `delta`, then render the progress bar with optional `tokens`.
 - `update(ratio, tokens)` Update the progress bar to `ratio` by percentage, then render the progress bar with optional `tokens`.
 - `clear()` Clean the progress bar in the terminal.

## Schema

The schema defines appearance the progress bar. Few inner tokens and many 
formatting methods can be used to customer you progress bar.  

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

```javascript
var bar = new ProgressBar({
    schema: ':current: :token1 :token2',
    total : 3 
});
bar.tick({
  'token1': "Hello",
  'token2': "World!"
})
bar.tick(2, {
  'token1': "Goodbye",
  'token2': "World!"
})
```

The above example would result in the output below.

```
1: Hello World!
3: Goodbye World!
```

### Colors

Color names can be use in schema:

```
:bar.red :percent.green
```

Then the progress bar will be red, and the percentage will be green.

All available color names:

- red
- cyan
- blue
- grey
- white
- black
- green
- yellow
- magenta
- brightRed
- brightBlue
- brightCyan
- brightWhite
- brightBlack
- brightGreen
- brightYellow
- brightMagenta

And with the `bg` prefix, such as `bgRed`, the color will be applied to the background.

```
:bar.red.bgBlue
```

The above progress bar has blue background and red foreground.

### Gradient

```
:bar.gradient(red,blue)
```

The arguments can be color names or hex color:

- red
- cyan
- blue
- grey
- white
- black
- green
- yellow
- magenta
- #xxxxxx


### Font style

Same as color names, font style can also be assigned by name:

- bold
- italic
- inverse
- underline

```
:bar.red :percent.green.bold
```

The percentage is green and bold.

## Examples

These are many examples in the `examples` folder.

## License

[MIT](https://github.com/bubkoo/ansi.js/blob/master/LICENSE) © bubkoo
