# gulp-concat-style

[![npm version](http://img.shields.io/npm/v/gulp-concat-style.svg?style=flat-square)](https://www.npmjs.org/package/gulp-concat-style) [![npm download](http://img.shields.io/npm/dm/gulp-concat-style.svg?style=flat-square)](https://www.npmjs.org/package/gulp-concat-style) [![npm dependencise](https://david-dm.org/noyobo/gulp-concat-style.svg?style=flat-square)](https://david-dm.org/noyobo/gulp-concat-style)

Concatenates style files `less scss css` according to the grouping rule;

## Install 

Install with [npm](https://www.npmjs.com/)

```bash
npm install --save-dev gulp-concat-style
```

## Examples

```js
var gulp = require('gulp');
var concatStyle = require('gulp-concat-style');

gulp.task('default', function() {
  return gulp
  .src('./src/*.less')
  .pipe(concatStyle({
    entry: '<filename>-<id>.less',
    output: '[filename].less'
  }))
  .pipe(gulp.dest('./build'))
})
```

## Options

```js
{
  entry: '<filename>-<id>.less', // required
  output: '[filename].less'      // required
}
```

- `entry`: *string* Parsing format filename , use the `<>` to define a variable;
- `output`: *string* Use the `[]` get variable by `enrty` variables;

## License

MIT