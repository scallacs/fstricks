
module.exports = function(grunt) {

    grunt.initConfig({
        html_snapshots: {
            // options for all targets
            options: {
                source: "webroot/robots.txt",
                hostname: "http://www.fstricks.com",
//                selector: {"__default": "#dynamic-content", "/": "#home-content"},
                outputDirClean: "true",
            },
            // the debug target
            debug: {
                options: {
                    outputDir: "./snapshots/debug"
                }
            },
            // the release target
            release: {
                options: {
                    outputDir: "./snapshots/"
                }
            }
        },
        htmlSnapshot: {
            all: {
                options: {
                    //that's the path where the snapshots should be placed
                    //it's empty by default which means they will go into the directory
                    //where your Gruntfile.js is placed
                    snapshotPath: 'webroot/snapshots/',
                    //This should be either the base path to your index.html file
                    //or your base URL. Currently the task does not use it's own
                    //webserver. So if your site needs a webserver to be fully
                    //functional configure it here.
                    sitePath: 'http://www.fstricks.com/',
                    //you can choose a prefix for your snapshots
                    //by default it's 'snapshot_'
                    fileNamePrefix: '',
                    //by default the task waits 500ms before fetching the html.
                    //this is to give the page enough time to to assemble itself.
                    //if your page needs more time, tweak here.
                    msWaitForPages: 1500,
                    //sanitize function to be used for filenames. Converts '#!/' to '_' as default
                    //has a filename argument, must have a return that is a sanitized string
                    sanitize: function(requestUri) {
                        //returns 'index.html' if the url is '/', otherwise a prefix
                        if (/\/$/.test(requestUri)) {
                            return 'index';
                        } else {
//                            return requestUri.replace(/\//g, 'prefix-');
                            return requestUri;
                        }
                    },
                    //if you would rather not keep the script tags in the html snapshots
                    //set `removeScripts` to true. It's false by default
                    removeScripts: true,
                    //set `removeLinkTags` to true. It's false by default
                    removeLinkTags: true,
                    //set `removeMetaTags` to true. It's false by default
                    removeMetaTags: true,
                    //Replace arbitrary parts of the html
                    replaceStrings: [
//                        {'this': 'will get replaced by this'},
//                        {'/old/path/': '/new/path'}
                    ],
                    // allow to add a custom attribute to the body
//                    bodyAttr: 'data-prerendered',
                    //here goes the list of all urls that should be fetched
                    urls: [
                        '/',
                        'player/bestof/snowboard',
                    ],
                    // a list of cookies to be put into the phantomjs cookies jar for the visited page
                    cookies: [
//                        {"path": "/", "domain": "localhost", "name": "lang", "value": "en-gb"}
                    ],
                    // options for phantomJs' page object
                    // see http://phantomjs.org/api/webpage/ for available options
//                    pageOptions: {
//                        viewportSize: {
//                            width: 1200,
//                            height: 800
//                        }
//                    }
                }
            }
        }
//        jshint: {
//            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
//            options: {
//                globals: {
//                    jQuery: true
//                }
//            }
//        },
//        watch: {
//            files: ['<%= jshint.files %>'],
//            tasks: ['jshint']
//        }
    });
//
//  grunt.loadNpmTasks('grunt-contrib-jshint');
//  grunt.loadNpmTasks('grunt-contrib-watch');
//
//  grunt.registerTask('default', ['jshint']);
    grunt.loadNpmTasks('grunt-html-snapshot');


    // A very basic default task.
    grunt.registerTask('default', 'Create snapshots.', function() {

    });

};

