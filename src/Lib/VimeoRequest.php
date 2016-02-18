<?php

namespace App\Lib;
/**
 * Description of VimeoRequest
 *
 * @author stephane
 */
class VimeoRequest {

    private $cache = [];
    private $lib = null;
        
    private static $instance = null;


    public static function instance(){
        if (self::$instance === null){
            self::$instance = new VimeoRequest(\Cake\Core\Configure::read('Vimeo.id'), \Cake\Core\Configure::read('Vimeo.key'));;
        }
        return self::$instance;
    }
    
    // scope is an array of permissions your token needs to access. You can read more at https://developer.vimeo.com/api/authentication#scopes
    private function __construct($client_id, $client_secret, $scope = ['public']) {
        $this->lib = new \Vimeo\Vimeo($client_id, $client_secret);
        $token = $this->lib->clientCredentials($scope);
        $this->lib->setToken($token['body']['access_token']);
    }

    public function exists($videoId){
        $data = $this->load($videoId);
        return !empty($data) && !empty($data['privacy']) 
            && $data['privacy']['embed'] === 'public' && $data['privacy']['view'] === 'anybody';
    }
    
    public function duration($videoId){
        $data = $this->load($videoId);
        return $data['duration'];
    }
    
    public function load($videoId){
        if (!isset($this->cache[$videoId])){
            $this->cache[$videoId] = $this->lib->request('/videos/' . $videoId, [], 'GET');
        }
        return $this->cache[$videoId]['body'];
    }
    
    // TODO 
    public static function urlToId($url){
        return $url;
    }
}
