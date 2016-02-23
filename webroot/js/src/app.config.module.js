angular.module('app.config', [])
        .constant('Config', {
            website: {
                name: "FS Tricks",
                version: "Beta"
            },
            api: {
                facebook: '1536208040040285',
                google: 'AIzaSyD_xZX3h4OR8Fhhe_f_M_S9TkBHLCWJqGg'
            },
            path: {
                img: WEBROOT_FULL + 'img/'
            }
        });