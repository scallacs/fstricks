var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var wrap = require('gulp-wrap')
var stripDebug = require('gulp-strip-debug');
var cleanCSS = require('gulp-clean-css');
//var ngAnnotate = require('gulp-ng-annotate')

gulp.task('concat-js-components', function() {
    gulp.src([
        "webroot/js/components/jquery/dist/jquery.min.js",
        "webroot/js/components/angular/angular.min.js",
        "webroot/js/components/angular-resource/angular-resource.min.js",
        "webroot/js/components/angular-messages/angular-messages.min.js",
        "webroot/js/components/angular-animate/angular-animate.min.js",
        "webroot/js/components/angular-cookies/angular-cookies.min.js",
        "webroot/js/components/angular-ui-router/release/angular-ui-router.min.js",
        "webroot/js/components/AngularJS-Toaster/toaster.min.js",
        'webroot/js/components/jquery-timeago/jquery.timeago.js',
        "webroot/js/components/angular-ui-router/release/angular-ui-router.min.js",
        "webroot/js/components/angular-simple-logger/dist/angular-simple-logger.min.js",
        'webroot/js/components/ui-select/dist/select.min.js',
        "webroot/js/components/ng-file-upload/ng-file-upload-shim.min.js",
        "webroot/js/components/ng-file-upload/ng-file-upload.min.js",
        "webroot/js/components/angular-socialshare/angular-socialshare.min.js",
        "webroot/js/components/satellizer/satellizer.min.js",
        "webroot/js/components/angular-utils-pagination/dirPagination.js",
        "webroot/js/components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js"
    ])
            .pipe(stripDebug())
            .pipe(concat('components.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./webroot/js/'))
});

gulp.task('concat-js-lib', function() {
    gulp.src([
        "webroot/js/lib/jquery-ui.min.js",
        'webroot/js/lib/bootstrap.min.js',
        "webroot/js/lib/ui-bootstrap-custom-tpls-0.14.3.min.js",
        "webroot/js/lib/slider.min.js",
        "webroot/js/lib/froogaloop.js"
    ])
            .pipe(stripDebug())
            .pipe(concat('lib.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./webroot/js/'))
});

gulp.task('concat-js', function() {
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
//            .pipe(uglify())
            .pipe(gulp.dest('./webroot/js/'))
});


gulp.task('concat-js-admin', function() {
    gulp.src([
        '!webroot/js/admin/*.spec.js',
        '!webroot/js/admin/**/*.spec.js',
        '!webroot/js/admin/**/**/*.spec.js',
        'webroot/js/admin/**/*.module.js',
        'webroot/js/admin/**/*.js',
        'webroot/js/admin/app.admin.module.js',
        'webroot/js/admin/*.js'
    ])
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
            .pipe(stripDebug())
            .pipe(concat('moFEJPQQS320909j2309923II2ODI2993.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./webroot/js/'));
});

gulp.task('concat-css', function() {
    return gulp.src([
        'webroot/css/select.css',
        'webroot/css/bootstrap.css',
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

