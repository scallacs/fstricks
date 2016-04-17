<?php
return [
    /**
     * Debug Level:
     *
     * Production Mode:
     * false: No error messages, errors, or warnings shown.
     *
     * Development Mode:
     * true: Errors and warnings shown.
     */
    'debug' => false,
    'maintenance' => [
        'on' => false,
        'whitelist' => ['78.233.201.181']
    ],
    'user_feedback' => true,
    'concat_js' => true,
    'concat_css' => true,
    'App' => [
        'namespace' => 'App',
        'encoding' => 'UTF-8',
        'base' => false,
        'dir' => 'src',
        'webroot' => 'webroot',
        'wwwRoot' => WWW_ROOT,
        // 'baseUrl' => env('SCRIPT_NAME'),
        'fullBaseUrl' => false,
        'apiBaseUrl' => 'http://www.fstricks.com/api/',
        'adminApiBaseUrl' => 'http://www.fstricks.com/admin/api/',
        'imageBaseUrl' => 'img/',
        'cssBaseUrl' => 'css/',
        'jsBaseUrl' => 'js/',
        'paths' => [
            'plugins' => [ROOT . DS . 'plugins' . DS],
            'templates' => [APP . 'Template' . DS],
            'locales' => [APP . 'Locale' . DS],
        ],
    ],
    'EmailTransport' => [
        'default' => [
            'className' => 'Mail',
            // The following keys are used in SMTP transports
            'host' => 'localhost',
            'port' => 25,
            'timeout' => 30,
            'username' => 'user',
            'password' => 'secret',
            'client' => null,
            'tls' => null,
        ],
    ],

    /**
     * Email delivery profiles
     *
     * Delivery profiles allow you to predefine various properties about email
     * messages from your application and give the settings a name. This saves
     * duplication across your application and makes maintenance and development
     * easier. Each profile accepts a number of keys. See `Cake\Network\Email\Email`
     * for more information.
     */
    'Email' => [
        'default' => [
            'transport' => 'default',
            'from' => 'no-reply@fstricks.com',
            //'charset' => 'utf-8',
            //'headerCharset' => 'utf-8',
        ],
        'gmail' => [
            'transport' => 'Smtp',
            'from' => array('contact.fstricks@gmail.com' => 'Stéphane'),
            'host' => 'ssl://smtp.gmail.com',
            'port' => 465,
            'timeout' => 30,
            'username' => 'contact.fstricks@gmail.com',
            'password' => 'r4xc3oSFST',
            'client' => null,
            'log' => false,
            'charset' => 'utf-8',
            'headerCharset' => 'utf-8',
        ],
    ],

    /**
     * Connection information used by the ORM to connect
     * to your application's datastores.
     * Drivers include Mysql Postgres Sqlite Sqlserver
     * See vendor\cakephp\cakephp\src\Database\Driver for complete list
     */
    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            /**
             * CakePHP will use the default DB port based on the driver selected
             * MySQL on MAMP uses port 8889, MAMP users will want to uncomment
             * the following line and set the port accordingly
             */
            //'port' => 'nonstandard_port_number',
            'username' => 'website',
            'password' => 'r4xc3oSFSTDBwebsite',
            'database' => 'trickers',
            'encoding' => 'utf8',
            'timezone' => 'UTC',
            'cacheMetadata' => true,

            /**
             * Set identifier quoting to true if you are using reserved words or
             * special characters in your table or column names. Enabling this
             * setting will result in queries built using the Query Builder having
             * identifiers quoted when creating SQL. It should be noted that this
             * decreases performance because each query needs to be traversed and
             * manipulated before being executed.
             */
            'quoteIdentifiers' => false,

            /**
             * During development, if using MySQL < 5.6, uncommenting the
             * following line could boost the speed at which schema metadata is
             * fetched from the database. It can also be set directly with the
             * mysql configuration directive 'innodb_stats_on_metadata = 0'
             * which is the recommended value in production environments
             */
            //'init' => ['SET GLOBAL innodb_stats_on_metadata = 0'],
            
            'log' => true,
        ],
    ],
    'Recaptcha' => [
        // Register API keys at https://www.google.com/recaptcha/admin
        'sitekey' => '6Ld3tRkTAAAAADOTCBr8MEMcCO3zZAKQuOslN9_v',
        'secret' => '6Ld3tRkTAAAAANt6_WLUcUG2oH1B_dFUn7iMjfGW',
        // reCAPTCHA supported 40+ languages listed
        // here: https://developers.google.com/recaptcha/docs/language
        'lang' => 'en',
        // either light or dark
        'theme' => 'light',
        // either image or audio
        'type' => 'image',
        // either normal or compact
        'size' => 'normal'
    ],
    'Youtube' => [
        'key' => 'AIzaSyC851NBlFCigGum0qdk04GHGVYF_tqd-M4'
    ],
    'Vimeo' => [
        'id' => 'f941f4c31738338a894c2b547ab6a9d1255d63d1',
        'key' => 'rR8YpMiWxBtkvk6QHjKbj8MK+4EpWJXevpCQTUgsy5RtYgoskrcCbvZUoju1MRzhZXZBpETrX1XvS4Nrr8EW2evFf76/Kz2fNiYsCDL/8tRu1YYbCU666kkoaWMZbr5a'
    ],
    'Facebook' => [
        'key' => '079e8ce1830a2177f3a10b939615a7f6',
        'id' => '1536208040040285'
    ]
];
