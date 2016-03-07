<?php

namespace App\Lib;

/**
 * Description of SearchHelper
 *
 * @author stephane
 */
class SearchHelper {

    private $data;
    private $defaults = [
        'split' => false
    ];

    public function __construct($data, $query) {
        $this->data = $data;
        $this->query = $query;
    }

    public function optional($name, $field, $options) {
        if ($this->has($name)) {
            $this->_generate($name, $field, $options);
        }
        return $this;
    }

    public function required($name, $field, $options) {
        if (!$this->has($name)) {
            throw new \Exception('Required field ' . $name . ' is missing');
        }
        $this->_generate($name, $field, $options);
        return $this;
    }

    public function orders($name, $map){
        if ($this->has($name)) {
            $v = $this->data[$name];
            if (isset($map[$v])){
                $this->query->order($map[$v]);
            }
        }
        return $this;
    }
    
    public function _generate($name, $field, $options) {
        $v = $this->data[$name];
        $options = array_merge($this->defaults, $options);
        
        $op = '';
        // TODO Check rules
        if ($options['split']) {
            $v = explode($options['split'], $v);
            $op = ' IN';
        }
        $this->query->where([$field.$op => $v]);
    }

    public function has($name) {
        return isset($this->data[$name]);
    }

}
