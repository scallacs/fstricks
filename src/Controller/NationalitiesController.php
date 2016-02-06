<?php

namespace App\Controller;

use App\Controller\AppController;

/**
 * Nationalities Controller
 *
 * @property \App\Model\Table\NationalitiesTable $Nationalities
 */
class NationalitiesController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow('index');
    }
    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        \App\Lib\ResultMessage::overwriteData($this->Nationalities->find('all'));
        \App\Lib\ResultMessage::setWrapper(false);
    }

}
