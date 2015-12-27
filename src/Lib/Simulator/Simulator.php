<?php

namespace App\Lib\Simulator;
/**
 * Description of Simulator
 *
 * @author stephane
 */

class Simulator {

    
    // returns random number with normal distribution:
    // mean=m
    // std dev=s
    public static function gauss($m = 0.0, $s = 1.0) { // N(m,s)
        return self::gauss_0_1() * $s + $m;
    }

    // returns random number with normal distribution:
    // mean=0
    // std dev=1
    // auxilary vars
    private static function gauss_0_1() { // N(0,1)
        $x = self::random_0_1();
        $y = self::random_0_1();

        // two independent variables with normal distribution N(0,1)
        $u = sqrt(-2 * log($x)) * cos(2 * pi() * $y);
        $v = sqrt(-2 * log($x)) * sin(2 * pi() * $y);

        // i will return only one, couse only one needed
        return $u;
    }

    // returns random number with flat distribution from 0 to 1
    private static function random_0_1() { // auxiliary function
        return (float) rand() / (float) getrandmax();
    }

}
