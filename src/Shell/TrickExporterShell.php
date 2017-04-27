<?php

namespace App\Shell;

use Cake\Console\Shell;
use Cake\Filesystem\Folder;

/**
 * Deploy application
 */
class TrickExporterShell extends Shell {

    public function main() {
        $this->loadModel('Videos');

        if (!isset($this->params['youtube'])){
            $this->abort('Should give an url');
        }
        $videoUrl = $this->params['youtube'];
        $query = $this->Videos
                ->find('withVideoTags')
                ->where([
                    'Videos.video_url' => $videoUrl,
                ]);
        $data = $query->first();
        
        echo 'Some of the tricks we can find in this video: ' . PHP_EOL. PHP_EOL;
        foreach ($data->video_tags as $videoTag){
//            debug($videoTag);
            echo($this->toYoutubeTime($videoTag->begin) . ' '. $videoTag->tag_name . PHP_EOL);
        }
        
        echo PHP_EOL . 'More on www.fstricks.com';
    }

    // -------------------------------------------------------------------------

    public function getOptionParser() {
        $parser = parent::getOptionParser();
        $parser->description(
                        'Trick exporter'
                )
                ->addOption('youtube', [
                    'short' => 'y',
                    'default' => null
        ]);
        return $parser;
    }

    public function toYoutubeTime($input){
        $hour =  floor($input/3600);
        $hour = strlen($hour) === 1 ? '0'.$hour : $hour;
        $input = $input % 3600;
        $minute = floor($input/60);
        $minute = strlen($minute) === 1 ? '0'.$minute : $minute;
        $input = floor($input % 60);
        $second = floor($input);
        $second = strlen($input) === 1 ? '0'.$input : $input;
        return $hour.':'.$minute.':'.$second;
    }
}
