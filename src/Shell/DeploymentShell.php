<?php

namespace App\Shell;

use Cake\Console\Shell;
use Cake\Filesystem\Folder;

/**
 * Deploy application
 */
class DeploymentShell extends Shell {


    public function main() {
        $this->install();
        $this->success('Installation success');
    }
    
    public function install(){
        $this->cleanCache();
        $this->installEnvironment();
        $this->setOwnerships();
    }

    public function installEnvironment(){
        $envName = $this->params['env'];
        $this->info('Installing environment files: ' . $envName);
        $envFolder = new Folder(CONFIG . 'environments');
        if (!$envFolder->cd($envName)){
            $this->abort('Cannot find environment folder: ' . $envName);
        }
//        debug($envFolder->pwd());
        
        $success = $envFolder->copy([
            'to' => CONFIG,
            'scheme' => Folder::MERGE
        ]);
        if (!$success){
            $this->abort('Cannot copy environment files');
        }
    }
    
    public function cleanCache(){
        $tmpFolder = new Folder(TMP);
        if (!$tmpFolder->delete('*')){
            $this->abort('Cannot clear cache');
        }
//        bin/cake orm_cache build --connection default
//        bin/cake orm_cache clear
    }
    
    public function installComposer(){
        
	//echo "Y" | composer install
    }
    
    
    public function setOwnerships(){
        $envFolder = new Folder(ROOT);
        $envFolder->cd('bin');
        $envFolder->chmod('*', 0775, false);
    }
    
    // -------------------------------------------------------------------------
    
    public function getOptionParser() {
        $parser = parent::getOptionParser();
        $parser->description(
                    'Installation script'
                )
                ->addOption('env', [
                    'default' => 'prod',
                ]);
        return $parser;
    }
}
