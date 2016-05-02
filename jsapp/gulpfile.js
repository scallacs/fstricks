var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var wrap = require('gulp-wrap')
var stripDebug = require('gulp-strip-debug');
var cleanCSS = require('gulp-clean-css');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var addsrc = require('gulp-add-src');
//var ngAnnotate = require('gulp-ng-annotate')

var ADMIN_HIDDEN_PATH = 'moFEJPQQS320909j2309923II2ODI2993';
var ROOT = './';
var BUILD = ROOT + 'build/';
var APP_SRC_DIR = ROOT + 'src/';
var DEFAULT_APP = APP_SRC_DIR + 'default/';
var ADMIN_APP = APP_SRC_DIR + 'admin/';
var JS_OUTPUT = '../webroot/js/';
var CSS_PATH = '../webroot/css/';
var VIEWS_PATH = '../webroot/views/';
var COMPONENTS_PATH = "../webroot/js/components/";
var LIB_PATH = "../webroot/js/lib/";


var APP_SOURCES = [
        '!' + DEFAULT_APP + '*.spec.js',
        '!' + DEFAULT_APP + '**/*.spec.js',
        '!' + DEFAULT_APP + '**/**/*.spec.js',
//        BUILD + 'server-constants.js',
        DEFAULT_APP + 'app.config.module.js',
        DEFAULT_APP + 'shared/**/*.module.js',
        DEFAULT_APP + 'shared/**/*.js',
        DEFAULT_APP + 'shared/shared.module.js',
        DEFAULT_APP + '**/*.module.js',
        DEFAULT_APP + '**/*.js',
        DEFAULT_APP + 'app.module.js'
    ];

// JSHint task
gulp.task('lint', function() {
    gulp.src(DEFAULT_APP + '*.js')
            .pipe(jshint())
            // You can look into pretty reporters as well, but that's another story
            .pipe(jshint.reporter('default'));
});

gulp.task('build', ['concat-js', 'concat-js-admin', 'concat-css', 'concat-js-lib', 'concat-js-components', 'build-views']);

gulp.task('watch', ['lint'], function() {
    // Watch our scripts
    gulp.watch([APP_SRC_DIR + '*.js', APP_SRC_DIR + '**/*.js', APP_SRC_DIR + '**/**/*.js', APP_SRC_DIR + '**/**/**/*.js'], [
        'lint',
        'concat-js-dev',
        'concat-js-admin'
    ]);
    gulp.watch([APP_SRC_DIR + '*.html', APP_SRC_DIR + '**/*.html', APP_SRC_DIR + '**/**/*.html', APP_SRC_DIR + '**/**/**/*.html'], [
        'build-views'
    ]);

    gulp.watch([JS_OUTPUT + 'lib/*.js'], [
        'concat-js-lib'
    ]);
//  gulp.watch([JS_OUTPUT + 'components/*'],[
//      'concat-js-components'
//  ]);
    gulp.watch([CSS_PATH + '*.css'], [
        'concat-css'
    ]);
});


gulp.task('build-views', function() {
    gulp.src([DEFAULT_APP + '/**/**/*.html']).pipe(gulp.dest(VIEWS_PATH + 'default/'));
    gulp.src([ADMIN_APP + '/**/**/*.html']).pipe(gulp.dest(VIEWS_PATH + ADMIN_HIDDEN_PATH + '/'));
});

gulp.task('concat-js-components', function() {
    gulp.src([
        COMPONENTS_PATH + "jquery/dist/jquery.min.js",
        COMPONENTS_PATH + "angular/angular.min.js",
        COMPONENTS_PATH + "angular-resource/angular-resource.min.js",
        COMPONENTS_PATH + "angular-messages/angular-messages.min.js",
        COMPONENTS_PATH + "angular-animate/angular-animate.min.js",
        COMPONENTS_PATH + "angular-cookies/angular-cookies.min.js",
        COMPONENTS_PATH + "angular-ui-router/release/angular-ui-router.min.js",
        COMPONENTS_PATH + "AngularJS-Toaster/toaster.min.js",
        COMPONENTS_PATH + "jquery-timeago/jquery.timeago.js",
//        COMPONENTS_PATH + "angular-simple-logger/dist/angular-simple-logger.min.js",
        COMPONENTS_PATH + "ui-select/dist/select.min.js",
//        COMPONENTS_PATH + "ng-file-upload/ng-file-upload-shim.min.js",
//        COMPONENTS_PATH + "ng-file-upload/ng-file-upload.min.js",
//        COMPONENTS_PATH + "angular-socialshare/angular-socialshare.min.js",
        COMPONENTS_PATH + "satellizer/satellizer.min.js",
        COMPONENTS_PATH + "angularjs-viewhead/angularjs-viewhead.js",
        COMPONENTS_PATH + "angular-utils-pagination/dirPagination.js",
        COMPONENTS_PATH + "angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js"
    ])
            .pipe(stripDebug())
            .pipe(concat('components.js'))
            .pipe(uglify())
            .pipe(gulp.dest(JS_OUTPUT));
});

gulp.task('concat-js-lib', function() {
    gulp.src([
        LIB_PATH + "jquery-ui.min.js",
        LIB_PATH + "bootstrap.min.js",
        LIB_PATH + "ui-bootstrap-custom-tpls-0.14.3.min.js",
        LIB_PATH + "slider.min.js",
        LIB_PATH + "froogaloop.js"
    ])
            .pipe(stripDebug())
            .pipe(concat('lib.js'))
            .pipe(uglify())
            .pipe(gulp.dest(JS_OUTPUT));
});

gulp.task('concat-js-dev', function() {
    gulp.src(APP_SOURCES)
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
            .pipe(addsrc(BUILD + 'server-constants.js'))
            .pipe(concat('app.js'))
//            .pipe(sourcemaps.write('maps'))
            .pipe(gulp.dest(JS_OUTPUT))
});
gulp.task('concat-js', function() {
    gulp.src(APP_SOURCES)
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
            .pipe(stripDebug())
            .pipe(addsrc(BUILD + 'server-constants.js'))
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest(JS_OUTPUT))
});


gulp.task('concat-js-admin', function() {
    gulp.src([
        ADMIN_APP + '**/*.module.js',
        ADMIN_APP + '**/*.js',
        ADMIN_APP + 'app.admin.module.js',
        ADMIN_APP + '*.js'
    ])
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
//            .pipe(stripDebug())
            .pipe(addsrc(BUILD + 'server-constants-admin.js'))
            .pipe(concat(ADMIN_HIDDEN_PATH + '.js'))
//            .pipe(uglify())
            .pipe(gulp.dest(JS_OUTPUT));
});

gulp.task('concat-css', function() {
    return gulp.src([
        CSS_PATH + 'select.css',
        CSS_PATH + 'bootstrap.css',
        CSS_PATH + 'base.css'
    ])
//        .pipe(cleanCSS({debug: true}, function(details) {
//            console.log(details.stats.originalSize);
//            console.log(details.stats.minifiedSize);
//        }))
            .pipe(cleanCSS())
            .pipe(concat('style.min.css'))
            .pipe(gulp.dest(CSS_PATH));
});
