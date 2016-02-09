angular.module('app.config', [])
        .constant('Config', {
            api: {
                facebook: '1536208040040285'
            },
            path: {
                img: WEBROOT_FULL + 'img/',
                html: WEBROOT_FULL + 'img/'
            }
        });