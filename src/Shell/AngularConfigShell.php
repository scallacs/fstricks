<?php

namespace App\Shell;

use Cake\Console\Shell;
use App\Lib\AngularConfigGenerator;
use Cake\Routing\Router;
use Cake\Core\Configure;

class AngularConfigShell extends Shell {

    public $baseUrl = '';

    public function main() {
        $this->baseUrl = !empty($this->args[0]) ? $this->args[0] : Router::url('/', true);
        $this->urlSuffix =  !empty($this->args[1]) ? $this->args[1] : Configure::read('App.baseUrlSuffix');
        $this->log('Domain='. $this->baseUrl . ', url='.$this->url(), \Psr\Log\LogLevel::INFO);
        $this->_default();
        $this->_admin();
    }
    
    private function url($url = ''){
        return $this->baseUrl . '/' . $this->urlSuffix . '/' . $url;
    }

    private function _default() {
        $generator = new \App\Lib\AngularConfigGenerator("app.serverconfig");
//        $generator->add('EntityRules', \Cake\Core\Configure::read("ServerConfig.rules")); // TODO
        $generator->add('__APIConfig__', [
            'baseUrl' => \Cake\Core\Configure::read('App.apiBaseUrl'),
            'youtube' => [
                'id' => \Cake\Core\Configure::read('Youtube.key')
            ],
            'facebook' => [
                'id' => \Cake\Core\Configure::read('Facebook.id')
            ]
        ]);
        $generator->add('__PathConfig__', [
            'webroot' => $this->url(),
            'domain' => $this->baseUrl,
            'img' => $this->url('img/'),
            'template' => $this->url('views/default/'),
        ]);
        $generator->add('__WebsiteConfig__', [
            'name' => "Freestyle Tricks",
            'short_name' => "FsTricks",
            'version' => "Beta",
            'contact' => 'contact.fstricks@gmail.com'
        ]);

        $output = ROOT . '/jsapp/build/server-constants.js';
        $file = new \Cake\Filesystem\File($output);
        $file->write($generator->generate());

        $this->log("Writing: " . $output, \Psr\Log\LogLevel::INFO);
    }
    
    public function _admin(){
        $generator = new \App\Lib\AngularConfigGenerator("app.serverconfig");$generator->add('__AdminAPIConfig__', [
            'baseUrl' => \Cake\Core\Configure::read('App.adminApiBaseUrl'),
        ]);
        $generator->add('__AdminPathConfig__', [
            'webroot' => $this->url('admin/'),
            'template' => $this->url('views/' . Configure::read('admin_hidden_prefix').'/'),
        ]);
        $output = ROOT . '/jsapp/build/server-constants-admin.js';
        $file = new \Cake\Filesystem\File($output);
        $file->write($generator->generate());

    }

}
