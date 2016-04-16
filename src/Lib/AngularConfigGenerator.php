<?php
namespace App\Lib;

class AngularConfigGenerator{
    
	protected $moduleName = 'serverconfig';
	protected $filename = 'serverconfig.js';

	protected $data = [];

	public function __construct($moduleName){
		$this->moduleName = $moduleName;
	}

	public function add($name, $data){
		$this->data[$name] = $data;		
	}

	public function set($data){
		$this->data = $data;
	}

	public function generate(){
		$result = '';
		foreach ($this->data as $name => $d){
                    $result .= $name .' = '. json_encode($d, JSON_UNESCAPED_SLASHES).'; ';
                }
                return $result;
	}

	public function angularGenerate(){
		$result = '';
		foreach ($this->data as $name => $d){
			$result .= 'angular.module("'.$this->moduleName.'").constant("'.$name.'", '.json_encode($d, JSON_UNESCAPED_SLASHES).');';
		}
                return $result;
	}


}
