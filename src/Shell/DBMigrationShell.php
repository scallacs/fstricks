<?php

namespace App\Shell;

use Cake\Console\Shell;
use App\Lib\SitemapGenerator;
use Cake\Routing\Router;

class DBMigrationShell extends Shell {

    public function main() {
        $this->_init();
        $this->_updateTagSlugs();
    }

    private function _init() {
        
    }

    private function _updateTagSlugs() {
        $this->loadModel('Tags');
        $tags = $this->Tags->find('all')
                ->select(['id' => 'Tags.id', 'name' => 'Tags.name'])
                ->limit(10000)
                ->hydrate(false);
        foreach ($tags as $tag) {
            $entity = $this->Tags->updateSlug($tag['id']);
            $this->log("Updating tag slug: " . $tag['name'] . ' -> ' . $entity->slug);
        }
    }

    private function _updateRiderSlugs() {
//        $this->loadModel('Riders');
//        $tags = $this->Riders->find('all')
//                ->select(['id' => 'Riders.id', 'firsnaame' => 'Riders.name'])
//                ->limit(10000)
//                ->hydrate(false);
//        foreach ($tags as $tag) {
//            $entity = $this->Tags->updateSlug($tag['id']);
//            $this->log("Updating tag slug: " . $tag['name'] . ' -> ' . $entity->slug);
//        }
    }

}
