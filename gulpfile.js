var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var wrap = require('gulp-wrap')
var stripDebug = require('gulp-strip-debug');
var cleanCSS = require('gulp-clean-css');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
//var ngAnnotate = require('gulp-ng-annotate')

var ADMIN_HIDDEN_PATH = 'moFEJPQQS320909j2309923II2ODI2993';
var ROOT = './jsapp/';
var APP_SRC = ROOT + 'src/';
var DEFAULT_APP = APP_SRC + 'default/';
var ADMIN_APP = APP_SRC + 'admin/';
var JS_OUTPUT = './webroot/js/';
var CSS_PATH = './webroot/css/';


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
    gulp.watch([APP_SRC + '*.js', APP_SRC + '**/*.js', APP_SRC + '**/**/*.js', APP_SRC + '**/**/**/*.js'], [
        'lint',
        'concat-js-dev',
        'concat-js-admin'
    ]);
    gulp.watch([APP_SRC + '*.html', APP_SRC + '**/*.html', APP_SRC + '**/**/*.html', APP_SRC + '**/**/**/*.html'], [
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
    gulp.src([DEFAULT_APP + '/**/**/*.html']).pipe(gulp.dest('./webroot/views/default/'));
    gulp.src([ADMIN_APP + '/**/**/*.html']).pipe(gulp.dest('./webroot/views/' + ADMIN_HIDDEN_PATH + '/'));
});

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
            .pipe(gulp.dest(JS_OUTPUT));
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
            .pipe(gulp.dest(JS_OUTPUT));
});

gulp.task('concat-js-dev', function() {
    gulp.src([
        '!' + DEFAULT_APP + '*.spec.js',
        '!' + DEFAULT_APP + '**/*.spec.js',
        '!' + DEFAULT_APP + '**/**/*.spec.js',
        DEFAULT_APP + 'app.config.module.js',
        DEFAULT_APP + 'shared/**/*.module.js',
        DEFAULT_APP + 'shared/**/*.js',
        DEFAULT_APP + 'shared/shared.module.js',
        DEFAULT_APP + '**/*.module.js',
        DEFAULT_APP + '**/*.js',
        DEFAULT_APP + 'app.module.js'
    ])
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
            .pipe(concat('app.js'))
            .pipe(sourcemaps.write('maps'))
            .pipe(gulp.dest(JS_OUTPUT))
});
gulp.task('concat-js', function() {
    gulp.src([
        '!' + DEFAULT_APP + '*.spec.js',
        '!' + DEFAULT_APP + '**/*.spec.js',
        '!' + DEFAULT_APP + '**/**/*.spec.js',
        DEFAULT_APP + 'app.config.module.js',
        DEFAULT_APP + 'shared/**/*.module.js',
        DEFAULT_APP + 'shared/**/*.js',
        DEFAULT_APP + 'shared/shared.module.js',
        DEFAULT_APP + '**/*.module.js',
        DEFAULT_APP + '**/*.js',
        DEFAULT_APP + 'app.module.js'
    ])
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
            .pipe(stripDebug())
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest(JS_OUTPUT))
});


gulp.task('concat-js-admin', function() {
    gulp.src([
        '!' + ADMIN_APP + '*.spec.js',
        '!' + ADMIN_APP + '**/*.spec.js',
        '!' + ADMIN_APP + '**/**/*.spec.js',
        ADMIN_APP + '**/*.module.js',
        ADMIN_APP + '**/*.js',
        ADMIN_APP + 'app.admin.module.js',
        ADMIN_APP + '*.js'
    ])
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
//            .pipe(stripDebug())
            .pipe(concat(ADMIN_HIDDEN_PATH + '.js'))
//            .pipe(uglify())
            .pipe(gulp.dest(JS_OUTPUT));
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
            .pipe(concat('style.min.css'))
            .pipe(gulp.dest(CSS_PATH));
});



var sitemap = require('gulp-sitemap');
var save = require('gulp-save');
 
 
var sports = [
    'all', 'snowboard', 'ski'
];

var pages = [];
for (var i = 0; i < sports.length; i++){
    pages.push('player/bestof/' + sports[i]);
}

// TODO dynamically get pages to index
// Get most famouse riders
 
gulp.task('generate-sitemap', function() {
    gulp.src('./webroot/snapshots/**/*.html')
//        .pipe(save('before-sitemap'))
        .pipe(sitemap({
                siteUrl: 'http://www.fstricks.com',
                changefreq: 'always',
                lastmod: null,
                pages: pages,
                verbose: true
        })) // Returns sitemap.xml 
        .pipe(gulp.dest('./webroot/snapshots'))
//        .pipe(save.restore('before-sitemap')) //restore all files to the state when we cached them 
        // -> continue stream with original html files 
        // ... 
});