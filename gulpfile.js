var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var combiner = require('stream-combiner2');
var http = require('http');
var ecstatic = require('ecstatic');

var CSS_SOURCE = 'less';
var CSS_DEST = 'css';
var MAIN_LESS_FILE = '/main.less';
var SERVER_PORT = 1337;

/* Compile, minify, and compress LESS files */
gulp.task('less', function() {
  var combined = combiner.obj([
    gulp.src(CSS_SOURCE + MAIN_LESS_FILE),
    less(),
    autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }),
    gulp.dest(CSS_DEST)
  ]);

  // any errors in the above streams will get caught
  // by this listener, instead of being thrown:
  combined.on('error', console.error.bind(console));

  return combined;
});

/* Watch Files For Changes */
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(CSS_SOURCE + '/**/*.less', ['less']);

  /* Trigger a live reload on any template changes */
  gulp.watch('**/*.html').on('change', livereload.changed);

  /* Trigger a live reload upon CSS complilation */
  gulp.watch(CSS_DEST + '/**').on('change', livereload.changed);
});

gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dr
  http.createServer(ecstatic({ root: __dirname })).listen(SERVER_PORT);
});

/* Run a server for development */
// gulp.task('serve', ['serve:backend', 'less', 'less_themes', 'watch']);
gulp.task('default', ['less', 'watch', 'serve']);

/* Create a build of frontend code */
// gulp.task('default', ['less', 'less_themes']);
gulp.task('build', ['less']);
