var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var wrap = require('gulp-wrap')
//var ngAnnotate = require('gulp-ng-annotate')

gulp.task('js', function () {
  gulp.src([
        '!src/*.spec.js',
        '!src/**/*.spec.js',
        '!src/**/**/*.spec.js',
        'src/app.config.module.js', 
        'src/shared/**/*.module.js', 
        'src/shared/**/*.js', 
        'src/shared/shared.module.js', 
        'src/**/*.module.js', 
        'src/**/*.js',  
        'src/app.module.js'
    ])
    .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
    .pipe(concat('app.js'))
//    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('.'))
})