<?php
namespace App\Lib;
use Cake\Core\Configure\Engine\JsonConfig;
/**
 * Description of CountryHelper
 *
 * @author stephane
 */
class JsonConfigHelper {
    
    /**
     *
     * @var \Cake\Core\Configure\Engine\JsonConfig 
     */
    private static $config = null;
    private static $files = [];


    /**
     * 
     * @return JsonConfig config
     */
    private static function instance(){
        if ( self::$config){
            return self::$config;
        }
        self::$config = new JsonConfig(\Cake\Core\Configure::read("JsonConfigFolder"));
        return self::$config;
    }
    
    private static function read($name){
        if (isset(self::$files[$name])){
            return self::$files[$name];
        }
        self::$files[$name] = self::instance()->read($name);
        return self::$files[$name];
    }

    public static function config(){
        return self::read("config");
    }
    public static function rules($table, $field, $rule){
        return self::read("rules")[$table][$field][$rule];
    }
    public static function countries(){
        return self::read("countries");
    }
}