<?php
namespace App\Lib;

class DataUtil{
    
    static function get($data, $key, $default = null){
        return isset($data[$key]) ? $data[$key] : $default;

    }
    static function isPositiveInt($data, $key){
        return isset($data[$key]) && is_numeric($data[$key]) && $data[$key] >= 0;;
    }
    static function getPositiveInt($data, $key, $default = 0){
        return isset($data[$key]) && is_numeric($data[$key]) && $data[$key] >= 0 ? (int)($data[$key]) : $default;
    }
    static function getString($data, $key, $default = ''){
        return isset($data[$key]) ? trim($data[$key]) : $default;
    }
    static function getLowerString($data, $key, $default = ''){
        return isset($data[$key]) ? self::toLowerString($data[$key]) : $default;
    }
    static function toLowerString($str){
        return mb_strtolower(trim($str));
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