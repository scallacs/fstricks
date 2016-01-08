<?php

use Cake\Core\Configure;

$config['HybridAuth'] = [
    'providers' => [
        'OpenID' => [
            'enabled' => false
        ],
        // facebook
        "Facebook" => [ 
            "enabled" => true,
            "keys" => array("id" => Configure::read('Facebook.id'), "secret" => Configure::read('Facebook.key')),
            "scope" => "email, user_about_me, user_birthday, user_hometown" // optional
        ],
    ],
    'debug_mode' => Configure::read('debug'),
    'debug_file' => LOGS . 'hybridauth.log',
];
