<?php

namespace App\Lib\Simulator;
class Gauss{
    public $mean;
    public $standardDeviation;
    
    function __construct($mean, $standardDeviation) {
        $this->mean = $mean;
        $this->standardDeviation = $standardDeviation;
    }
    
    public function get(){
        return Simulator::gauss($this->mean, $this->standardDeviation);
    }
    
}