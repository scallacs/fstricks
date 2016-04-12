<?php

namespace App\Shell;

use Cake\Console\Shell;
use App\Lib\SitemapGenerator;
use Cake\Routing\Router;

class DBMigrationShell extends Shell {

    public function main() {
        $this->_init();

        $this->_updateSlugs('Sports');
        $this->_updateSlugs('Categories');

        $this->_updateTagSlugs();
    }

    private function _init() {
        
    }

    private function _updateSlugs($model) {
        $this->loadModel($model);
        $data = $this->$model->find('all')
                ->limit(10000)
                ->hydrate(true);
        foreach ($data as $d) {
            $d->slug = \Cake\Utility\Inflector::slug(\App\Lib\DataUtil::lowername($d->name));
            $success = $this->$model->save($d);
            if (!$d->errors()) {
                $this->log("Updating " . $model . " slug: " . $d->name . ' -> ' . $d->slug , \Psr\Log\LogLevel::INFO);
            } else {
                $this->log("Cannot update " . $model . " slug: " . $d->name . ' -> ' . $d->slug, \Psr\Log\LogLevel::ERROR);
                $this->log($d->errors());
            }
        }
//        $this->log($this->$model->find('all')->all(), \Psr\Log\LogLevel::INFO);
    }

    private function _updateTagSlugs() {
        $this->loadModel('Tags');
        $tags = $this->Tags->find('all')
                ->select(['id' => 'Tags.id', 'name' => 'Tags.name'])
                ->limit(10000)
                ->hydrate(false);
        foreach ($tags as $tag) {
            $entity = $this->Tags->updateSlug($tag['id']);
            $this->log("Updating tag slug: " . $tag['name'] . ' -> ' . $entity->slug, \Psr\Log\LogLevel::INFO);
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
