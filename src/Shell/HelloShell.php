<?php

namespace App\Shell;

use Cake\Console\Shell;
use App\Lib\SitemapGenerator;
use Cake\Routing\Router;

class HelloShell extends Shell {
    
    public function main() {
        $this->out('Hello');
        $this->success();
    }

}
