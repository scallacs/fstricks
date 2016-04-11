<?php

namespace App\Shell;

use Cake\Console\Shell;
use App\Lib\SitemapGenerator;
use Cake\Routing\Router;

class SitemapShell extends Shell {
    
    private $siteUrl = '';

    public function main() {
        $this->_init();
        $this->_build();
    }
    
    private function _init() {
        $this->_initModels();
        $this->_initSitemap();
        $this->_initStaticUrls();
        $this->_initDynamicUrls();
    }
    
    private function _initSitemap(){
        $this->siteUrl = !empty($this->args[0]) ? $this->args[0] : Router::url('/Tricker/', true);
        $this->out("Generating sitemap for website: " . $this->siteUrl);
        $this->out("Output will be saved to: " . WWW_ROOT);
        $this->sitemap = new SitemapGenerator($this->siteUrl, WWW_ROOT);
//        $this->sitemap->createGZipFile = true;
        // determine how many urls should be put into one file
        $this->sitemap->maxURLsPerSitemap = 10000;
        // sitemap file name
        $this->sitemap->sitemapFileName = "sitemap.xml";
        // sitemap index file name
        $this->sitemap->sitemapIndexFileName = "sitemap-index.xml";
        // robots file name
        $this->sitemap->robotsFileName = "robots.txt";
        
    }
    
    private function _initModels(){
        $this->loadModel('Sports');
        $this->loadModel('Riders');
        $this->loadModel('Tags');
    }
    
    private function _initStaticUrls(){
        $urls = [
            '/',
        ];
        foreach ($urls as $url){
            $this->addUrl($url, date('c'), 'daily', '1');
        }
    }
    
    private function _initDynamicUrls(){
        $sports = $this->Sports->findAllCached();
        foreach ($sports as $sport){
            $this->_addSportLink($sport);
        }
        $this->_addSportLink(['name' => 'all']);
        
        $riders = $this->Riders->findPublic()
                ->order(['Riders.count_tags DESC'])
                ->where(['Riders.count_tags >' => '1'])
                ->limit(1000);
        foreach ($riders as $rider){
            $this->_addRiderLink($rider);
        }
        
        $tags = $this->Tags->findPublic()
                ->order(['Tags.count_ref DESC'])
                ->where(['Tags.count_ref >' => '1'])
                ->limit(1000);
        foreach ($tags as $tag){
            $this->_addTrickLink($tag);
        }
    }
    
    private function _addSportLink($sport){
        $url = $this->siteUrl . '/player/bestof/'.$sport['name'];
        $this->sitemap->addUrl($url, date('c'), 'daily', '1');
        $this->out("Adding url: $url");
        if (!empty($sport['categories'])){
            foreach ($sport['categories'] as $category){
                $url = '/player/bestof/'.$sport['name'].'?category='.$category['name'];
                $this->addUrl($url, date('c'), 'daily', '1');
            }
        }
    }

    private function _addRiderLink($rider){
        $this->addUrl('/player/rider/'.$rider['slug'], date('c'), 'daily', '0.5');
    }
    private function _addTrickLink($trick){
        $this->addUrl('/player/trick/'.$trick['slug'], date('c'), 'daily', '0.5');
    }
    
    private function addUrl($url, $date, $freq, $prio){
        $this->out('Adding url: '. $this->siteUrl . $url);
        $this->sitemap->addUrl($this->siteUrl . $url, $date, $freq, $prio);
    }
    

    private function _build() {
        $time = explode(" ", microtime());
        $time = $time[1];
        try {
            // create sitemap
            $this->out("Creating sitemap...");
            $this->sitemap->createSitemap();
            // write sitemap as file
            $this->out("Writing sitemap in file...");
            $this->sitemap->writeSitemap();
            // update robots.txt file
//            $this->out("Updating robots...");
//            $this->sitemap->updateRobots();
//            debug($this->sitemap->toArray());
            // submit sitemaps to search engines
            //$result = $this->sitemap->submitSitemap("yahooAppId");
            // shows each search engine submitting status
            //$this->out($result);
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
        $this->out("Memory peak usage: " . number_format(memory_get_peak_usage() / (1024 * 1024), 2) . "MB");
        $time2 = explode(" ", microtime());
        $time2 = $time2[1];
        $this->out("Execution time: " . number_format($time2 - $time) . "s");
    }

}
