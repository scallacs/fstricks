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
}