<?php
namespace App\Lib;

class DataUtil{
    
    static function get($data, $key, $default = null){
        return isset($data[$key]) ? $data[$key] : $default;

    }
    static function getString($data, $key, $default = ''){
        return isset($data[$key]) ? trim($data[$key]) : $default;
    }
    static function getLowerString($data, $key, $default = ''){
        return isset($data[$key]) ? trim(strtolower($data[$key])) : $default;
    }
    
    /**
     * Convert to a lowername
     * @param type $str
     * @return type
     */
    static function lowername($str){
        return mb_strtolower(trim($str));
    }
    static function lowernamenumeric($str){
        return mb_strtolower(trim($str));
    }
}