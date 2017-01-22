<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;

/**
 * Videos Controller
 *
 * @property \App\Model\Table\VideosTable $Videos
 */
class VideoProvidersController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['index']);
    }

    public function index(){
        $query = $this->VideoProviders->find('public');
        ResultMessage::overwriteData($query);
        ResultMessage::setWrapper(false);
    }

}
