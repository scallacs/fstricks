<?php

return [
    'debug' => true,
    'maintenance' => 0,
    'user_feedback' => true,
    'concat_js' => true,
    'concat_css' => false,
    'EmailTransport' => [
        'default' => [
            'className' => 'Mail',
            // The following keys are used in SMTP transports
            'host' => 'localhost',
            'port' => 25,
            'timeout' => 30,
            'username' => '',
            'password' => '',
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
            'from' => 'you@localhost',
        //'charset' => 'utf-8',
        //'headerCharset' => 'utf-8',
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
            'username' => 'root',
            'password' => '',
            'database' => 'trickers_test_e2e',
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
        /**
         * The test connection is used during the test suite.
         */
        'test' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            //'port' => 'nonstandard_port_number',
            'username' => 'root',
            'password' => '',
            'database' => 'trickers_test',
            'encoding' => 'utf8',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
            'quoteIdentifiers' => false,
            //'init' => ['SET GLOBAL innodb_stats_on_metadata = 0'],
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
        'key' => 'AIzaSyAiz1-BkVPdVOLtDyR_Fi8gUAhrU8wXrSE'
    ],
    'Vimeo'  => [
        'id' => '9bf172126a2ffd8ec0c9bafcac8183e2450f079c',
        'key' => 'GIHpP3bkais02fTvXsRLNnW3qH6fcgnINaf2cD7Ukapc36rXTvaIUKptWJreztJgXA7dWbTHGedBY0CMwYtL6LVLQpGXiSv31AGkwZfJv2qsNhoey7KGeEJIxlmDYefE'
    ],
    'Facebook' => [
        'key' => '4efeb5e024d7ecbc9905d6c528929e7e',
        'id' => '1567352196925869'
    ]
];
