var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var wrap = require('gulp-wrap')
//var ngAnnotate = require('gulp-ng-annotate')

gulp.task('concat-js', function () {
  gulp.src([
        '!webroot/js/src/*.spec.js',
        '!webroot/js/src/**/*.spec.js',
        '!webroot/js/src/**/**/*.spec.js',
        'webroot/js/src/app.config.module.js', 
        'webroot/js/src/shared/**/*.module.js', 
        'webroot/js/src/shared/**/*.js', 
        'webroot/js/src/shared/shared.module.js', 
        'webroot/js/src/**/*.module.js', 
        'webroot/js/src/**/*.js',  
        'webroot/js/src/app.module.js'
    ])
    .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
    .pipe(concat('webroot/js/app.js'))
//    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('.'))
})