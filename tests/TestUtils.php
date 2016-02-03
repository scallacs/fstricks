<?php

namespace App\Test;

class TestUtils{
    
    public static function generateTags($max){
        $tags = [];
        for ($i = 0; $i < $max; $i++){
            $tags[] = 'test' . $i;
        }
        return $tags;
    }
}