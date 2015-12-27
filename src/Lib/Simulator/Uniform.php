<?php

namespace App\Lib\Simulator;

class Uniform{
    
    public $min;
    public $max;
    
    function __construct($min, $max) {
        $this->min = $min;
        $this->max = $max;
    }

    public function get() {
        return rand($this->min, $this->max);
    }
    
    public static function sget($min = 0, $max = 1){
        return rand($min, $max);
    }
    
}