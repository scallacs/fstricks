var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var wrap = require('gulp-wrap')
var stripDebug = require('gulp-strip-debug');
var cleanCSS = require('gulp-clean-css');
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
    .pipe(stripDebug())
    .pipe(concat('app.js'))
//    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./webroot/js/'))
});

gulp.task('concat-css', function() {
    return gulp.src([
            'webroot/css/select.min.css', 
            'webroot/css/bootstrap.css', 
            'webroot/css/ui-bootstrap.css', 
            'webroot/css/base.css'
        ])
//        .pipe(cleanCSS({debug: true}, function(details) {
//            console.log(details.stats.originalSize);
//            console.log(details.stats.minifiedSize);
//        }))
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('webroot/css/'));
});

