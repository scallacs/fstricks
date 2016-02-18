<?php

namespace App\Model\Validation\Providers;

use App\Lib\YoutubeRequest;
use App\Lib\VimeoRequest;

class VideoUrlProvider {

    public static function youtube($url, $context) {
        try {
            $youtube = YoutubeRequest::instance();
            return $youtube->exists(YoutubeRequest::urlToId($url));
        } catch (Exception $e) {
            
        }
        return false;
    }

    public static function vimeo($url, $context) {
        return VimeoRequest::instance()->exists(VimeoRequest::urlToId($url));
    }

    public static function url($url, $context) {
        if (!isset($context['data']['provider_id'])){
            return false;
        }
        $provider = $context['data']['provider_id'];
        switch ($provider){
            case 'youtube': 
                return self::youtube($url, $context);
            case 'vimeo': 
                return self::vimeo($url, $context);
            default:
                return false;
        }
    }

}
