<?php

namespace App\Test;

class TestUtils {

    public static function generateTags($max) {
        $tags = [];
        for ($i = 0; $i < $max; $i++) {
            $tags[] = 'test' . $i;
        }
        return $tags;
    }

    public static function generateString($length) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }


}
