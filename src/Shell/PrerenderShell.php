<?php

namespace App\Shell;

use Cake\Console\Shell;
use App\Lib\SitemapGenerator;
use Cake\Routing\Router;

class PrerenderShell extends Shell {
    
    private $siteUrl = '';

    public function main() {
        $this->_init();
        $this->_build();
    }
    
    private function _init() {
        
    }
    
    private function _build() {
        
    }
    
}
