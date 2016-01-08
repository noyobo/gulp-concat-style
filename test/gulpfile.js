var gulp = require('gulp');
var concatStyle = require('../');


gulp.task('default', function() {
  return gulp
  .src('./retina/*.less')
  .pipe(concatStyle({
    entry: '<filename>-<id>.less',
    output: '[filename].less'
  }))
  .pipe(gulp.dest('./build'))
})


