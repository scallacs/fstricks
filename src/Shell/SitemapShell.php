<?php

namespace App\Shell;

use Cake\Console\Shell;
use App\Lib\SitemapGenerator;
use Cake\Routing\Router;

/**
 * @warning Must have permission on folders: webroot/sitemap*, logs, tmp...
 * 
 */
class SitemapShell extends Shell {

    const SITEMAP_INDEX = "sitemap-index.xml";

    private $siteUrl = '';
    private $sitemap = [
        'sports' => null,
        'riders' => null,
        'tricks' => null
    ];

    public function main() {
        $this->siteUrl = !empty($this->params['url']) ? $this->params['url'] : Router::url('/', true);
        $this->info('Generating sitemapp for website: ' . $this->siteUrl);
        $this->_init();
        $this->_build();
    }

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        $parser->description(
                        'Generate the sitemapp'
                )
                ->addOption('url', [
                    'default' => Router::url('/', true),
//                'short' => 'u',
                ]);
        return $parser;
    }

    private function _init() {
        $this->_initModels();
        foreach ($this->sitemap as $name => $sitemap) {
            $this->_initSitemap($name);
        }
//        $this->_initStaticUrls();
        $this->_initDynamicUrls();
    }

    private function _initSitemap($name) {
        $this->out("Generating sitemap '" . $name . "' for website: " . $this->siteUrl);
        $this->out("Output will be saved to: " . WWW_ROOT);
        $this->sitemap[$name] = new SitemapGenerator($this->siteUrl, WWW_ROOT);
        //        $this->sitemap->createGZipFile = true;
        // determine how many urls should be put into one file
        $this->sitemap[$name]->maxURLsPerSitemap = 10000;
        // sitemap file name
        $this->sitemap[$name]->sitemapFileName = "sitemap-" . $name . ".xml";
        // sitemap index file name
        $this->sitemap[$name]->sitemapIndexFileName = self::SITEMAP_INDEX;
        // robots file name
        $this->sitemap[$name]->robotsFileName = "robots.txt";
    }

    private function _initModels() {
        $this->loadModel('Sports');
        $this->loadModel('Riders');
        $this->loadModel('Tags');
        $this->loadModel('VideoTags');
    }

//    private function _initStaticUrls(){
//        $urls = [
//            '/',
//        ];
//        foreach ($urls as $url){
//            $this->addUrl($url, date('c'), 'daily', '1');
//        }
//    }

    private function _initDynamicUrls() {
        $sports = $this->Sports->findForSitemap();
        foreach ($sports as $sport) {
            $this->_addSportLink($sport);
        }
        $this->_addSportLink(['name' => 'all', 'slug' => 'all']);

        $riders = $this->Riders->findForSitemap();
        foreach ($riders as $rider) {
            $this->_addRiderLink($rider);
        }

        $tags = $this->Tags->findForSitemap();
        foreach ($tags as $tag) {
            $this->_addTrickLink($tag);
        }

        $tags = $this->VideoTags->findForSitemap();
        foreach ($tags as $tag) {
            $this->_addPerformanceLink($tag);
        }
    }

    private function _addSportLink($sport) {
        $url = '/player/bestof/' . $sport['slug'];
        $this->addUrl('sports', $url, date('c'), 'daily', '1');
        $this->out("Generating sport bestof: $url");
        if (!empty($sport['categories'])) {
            foreach ($sport['categories'] as $category) {
                $url = '/player/bestof/' . $sport['slug'] . '?category=' . $category['slug'];
                $this->addUrl('sports', $url, date('c'), 'daily', '1');
            }
        }
    }

    private function _addRiderLink($rider) {
        $this->addUrl('riders', '/player/rider/' . $rider['slug'], date('c'), 'daily', '0.5');
    }

    private function _addTrickLink($trick) {
        $this->addUrl('tricks', '/player/trick/' . $trick['slug'], date('c'), 'daily', '1');
    }

    private function _addPerformanceLink($videoTag) {
        $this->addUrl('tricks', '/player/performance/' . $videoTag['slug'], date('c'), 'daily', '0.5');
    }

    private function addUrl($name, $url, $date, $freq, $prio) {
        $this->out('Adding url: ' . $this->siteUrl . $url);
        $this->sitemap[$name]->addUrl($this->siteUrl . $url, $date, $freq, $prio);
    }

    private function _build() {
        $time = explode(" ", microtime());
        $time = $time[1];
        // create sitemap
        $this->out("Creating sitemap...");
        foreach ($this->sitemap as $sitemap) {
            $sitemap->createSitemap();
            $this->out("Writing sitemap in file...");
            $sitemap->writeSitemap();
        }
        // update robots.txt file
//            $this->out("Updating robots...");
//            $this->sitemap[$name]->updateRobots();
//            debug($this->sitemap->toArray());
        // submit sitemaps to search engines
        //$result = $this->sitemap->submitSitemap("yahooAppId");
        // shows each search engine submitting status
        //$this->out($result);
        $this->out("Memory peak usage: " . number_format(memory_get_peak_usage() / (1024 * 1024), 2) . "MB");
        $time2 = explode(" ", microtime());
        $time2 = $time2[1];
        $this->out("Execution time: " . number_format($time2 - $time) . "s");
    }

}
