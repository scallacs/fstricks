<?php

namespace App\Lib;
/**
 * Description of VideoRequest
 *
 * @author stephane
 */
class VideoRequestFactory {
    
    public static function instance($provider){
        switch ($provider){
            case 'youtube':
                return YoutubeRequest::instance();
            case 'vimeo':
                return VimeoRequest::instance();
        }
        
        throw Exception("Unknown provider: $provider");
    }
}
